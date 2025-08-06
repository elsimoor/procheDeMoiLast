"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const GET_RESTAURANT_SETTINGS = gql`
  query Restaurant($id: ID!) {
    restaurant(id: $id) {
      id
      settings {
        horaires {
          ouverture
          fermeture
        }
        capaciteTotale
        tables {
          size2
          size4
          size6
          size8
        }
        frequenceCreneauxMinutes
        maxReservationsParCreneau
      }
    }
  }
`;

const UPDATE_RESTAURANT_MUTATION = gql`
    mutation UpdateRestaurant($id: ID!, $input: UpdateRestaurantInput!) {
        updateRestaurant(id: $id, input: $input) {
            id
        }
    }
`;

const formSchema = z.object({
  horaires: z.array(
    z.object({
      ouverture: z.string(),
      fermeture: z.string(),
    })
  ).min(1, "Au moins une plage horaire est requise."),
  capaciteTotale: z.coerce.number().positive("La capacité totale doit être un nombre positif."),
  tables: z.object({
    size2: z.coerce.number().min(0, "Doit être un nombre positif."),
    size4: z.coerce.number().min(0, "Doit être un nombre positif."),
    size6: z.coerce.number().min(0, "Doit être un nombre positif."),
    size8: z.coerce.number().min(0, "Doit être un nombre positif."),
  }),
  frequenceCreneauxMinutes: z.coerce.number().positive("La fréquence doit être un nombre positif."),
  maxReservationsParCreneau: z.coerce.number().positive("La limite doit être un nombre positif."),
})
.refine(data => {
    // Validate that for any schedule, opening time is before closing time.
    return data.horaires.every(h => !h.ouverture || !h.fermeture || h.ouverture < h.fermeture);
}, {
    message: "L'heure d'ouverture doit être antérieure à l'heure de fermeture pour chaque plage.",
    path: ["horaires"],
})
.refine(data => data.frequenceCreneauxMinutes > 0 && data.frequenceCreneauxMinutes % 5 === 0, {
    message: "La fréquence des créneaux doit être un multiple de 5 (ex: 15, 30, 60).",
    path: ["frequenceCreneauxMinutes"],
})
.refine(data => data.maxReservationsParCreneau <= data.capaciteTotale, {
    message: "La limite par créneau ne peut pas dépasser la capacité totale.",
    path: ["maxReservationsParCreneau"],
});

export default function TablesDisponibilitesPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      horaires: [
        { ouverture: "", fermeture: "" },
        { ouverture: "", fermeture: "" },
      ],
      capaciteTotale: 0,
      tables: { size2: 0, size4: 0, size6: 0, size8: 0 },
      frequenceCreneauxMinutes: 0,
      maxReservationsParCreneau: 0,
    },
  });

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) {
          setSessionLoading(false);
          return;
        }
        const data = await res.json();
        if (data.restaurantId) {
          setRestaurantId(data.restaurantId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSessionLoading(false);
      }
    }
    fetchSession();
  }, []);

  const { loading: queryLoading, error: queryError } = useQuery(GET_RESTAURANT_SETTINGS, {
    variables: { id: restaurantId },
    skip: !restaurantId,
    onCompleted: (data) => {
      if (data.restaurant && data.restaurant.settings) {
        const settings = data.restaurant.settings;
        form.reset({
            horaires: settings.horaires.length ? settings.horaires : [{ ouverture: "", fermeture: "" }, { ouverture: "", fermeture: "" }],
            capaciteTotale: settings.capaciteTotale || 0,
            tables: settings.tables || { size2: 0, size4: 0, size6: 0, size8: 0 },
            frequenceCreneauxMinutes: settings.frequenceCreneauxMinutes || 0,
            maxReservationsParCreneau: settings.maxReservationsParCreneau || 0,
        });
      }
    },
  });

  const [updateRestaurant, { loading: updateLoading }] = useMutation(UPDATE_RESTAURANT_MUTATION);

  const watchTables = form.watch("tables");
  const watchCapaciteTotale = form.watch("capaciteTotale");

  const capaciteTheorique =
    (watchTables.size2 || 0) * 2 +
    (watchTables.size4 || 0) * 4 +
    (watchTables.size6 || 0) * 6 +
    (watchTables.size8 || 0) * 8;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!restaurantId) return;

    try {
      await updateRestaurant({
        variables: {
          id: restaurantId,
          input: {
            settings: values,
          },
        },
      });
      toast.success("Modifications enregistrées");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue.");
    }
  }

  if (sessionLoading || queryLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des tables et des disponibilités</h1>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <Card>
            <CardHeader>
              <CardTitle>Jours d’ouverture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">La sélection des jours sera disponible dans une future mise à jour.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horaires d’ouverture et de fermeture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.getValues().horaires.map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`horaires.${index}.ouverture`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure d’ouverture</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="rounded-lg border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`horaires.${index}.fermeture`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de fermeture</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="rounded-lg border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capacité totale du restaurant</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="capaciteTotale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre total de personnes acceptées</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-lg border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchCapaciteTotale > capaciteTheorique && (
                  <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Attention</AlertTitle>
                      <AlertDescription>
                          La capacité totale saisie ({watchCapaciteTotale}) est supérieure à la capacité théorique calculée ({capaciteTheorique}) en fonction du nombre de tables.
                      </AlertDescription>
                  </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nombre de tables par taille</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="tables.size2"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tables de 2 personnes</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} className="rounded-lg border-gray-300"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tables.size4"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tables de 4 personnes</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} className="rounded-lg border-gray-300"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tables.size6"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tables de 6 personnes</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} className="rounded-lg border-gray-300"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tables.size8"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tables de 8 personnes</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} className="rounded-lg border-gray-300"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Créneaux de réservation</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="frequenceCreneauxMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fréquence des créneaux (en minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-lg border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limites de réservation par créneau</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="maxReservationsParCreneau"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum de réservations par créneau</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-lg border-gray-300" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={updateLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 ease-in-out">
              {updateLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
