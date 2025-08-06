"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const GET_RESTAURANT_SETTINGS = gql`
  query RestaurantForPrivatisation($id: ID!) {
    restaurant(id: $id) {
      id
      settings {
        capaciteTheorique
        frequenceCreneauxMinutes
      }
    }
  }
`;

const GET_PRIVATISATION_OPTIONS = gql`
  query PrivatisationOptionsByRestaurant($restaurantId: ID!) {
    privatisationOptionsByRestaurant(restaurantId: $restaurantId) {
      id
      nom
      description
      type
      capaciteMaximale
      dureeMaximaleHeures
      menusDeGroupe
    }
  }
`;

const CREATE_PRIVATISATION_OPTION = gql`
  mutation CreatePrivatisationOption($input: CreatePrivatisationOptionInput!) {
    createPrivatisationOption(input: $input) {
      id
      nom
      description
      type
      capaciteMaximale
      dureeMaximaleHeures
      menusDeGroupe
    }
  }
`;

const UPDATE_PRIVATISATION_OPTION = gql`
  mutation UpdatePrivatisationOption($id: ID!, $input: UpdatePrivatisationOptionInput!) {
    updatePrivatisationOption(id: $id, input: $input) {
      id
      nom
      description
      type
      capaciteMaximale
      dureeMaximaleHeures
      menusDeGroupe
    }
  }
`;

const baseFormSchema = z.object({
  nom: z.string().min(1, { message: "Le nom est requis." }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Le type est requis." }),
  capaciteMaximale: z.coerce.number().positive({ message: "La capacité doit être un nombre positif." }),
  dureeMaximaleHeures: z.coerce.number().positive({ message: "La durée doit être un nombre positif." }),
  menusDeGroupe: z.array(z.string()).optional(),
});


export default function PrivatisationPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [existingOptionId, setExistingOptionId] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const { data: restaurantData, loading: settingsLoading } = useQuery(GET_RESTAURANT_SETTINGS, {
    variables: { id: restaurantId },
    skip: !restaurantId,
  });
  const settings = restaurantData?.restaurant?.settings;

  const formSchema = baseFormSchema
    .refine(data => {
        if (!settings) return true; // Don't validate if settings aren't loaded yet
        return data.capaciteMaximale <= settings.capaciteTheorique;
    }, {
        message: `La capacité maximale ne peut pas dépasser la capacité théorique du restaurant (${settings?.capaciteTheorique || 'N/A'}).`,
        path: ["capaciteMaximale"],
    })
    .refine(data => {
        if (!settings || !settings.frequenceCreneauxMinutes) return true;
        return (data.dureeMaximaleHeures * 60) % settings.frequenceCreneauxMinutes === 0;
    }, {
        message: `La durée doit être compatible avec les créneaux de ${settings?.frequenceCreneauxMinutes || 'N/A'} minutes.`,
        path: ["dureeMaximaleHeures"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      description: "",
      type: "",
      capaciteMaximale: 0,
      dureeMaximaleHeures: 0,
      menusDeGroupe: [],
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
        if (data.businessType && data.businessType.toLowerCase() === "restaurant" && data.businessId) {
          setRestaurantId(data.businessId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSessionLoading(false);
      }
    }
    fetchSession();
  }, []);

  const { loading: queryLoading, error: queryError } = useQuery(GET_PRIVATISATION_OPTIONS, {
    variables: { restaurantId },
    skip: !restaurantId,
    onCompleted: (data) => {
      if (data.privatisationOptionsByRestaurant && data.privatisationOptionsByRestaurant.length > 0) {
        const option = data.privatisationOptionsByRestaurant[0];
        form.reset({
          nom: option.nom,
          description: option.description || "",
          type: option.type,
          capaciteMaximale: option.capaciteMaximale,
          dureeMaximaleHeures: option.dureeMaximaleHeures,
          menusDeGroupe: option.menusDeGroupe,
        });
        setExistingOptionId(option.id);
      }
    },
  });

  const [createOption, { loading: createLoading }] = useMutation(CREATE_PRIVATISATION_OPTION);
  const [updateOption, { loading: updateLoading }] = useMutation(UPDATE_PRIVATISATION_OPTION);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!restaurantId) return;

    try {
      let result;
      if (existingOptionId) {
        result = await updateOption({
          variables: {
            id: existingOptionId,
            input: values,
          },
        });
        if (result.data.updatePrivatisationOption) {
            setExistingOptionId(result.data.updatePrivatisationOption.id);
            form.reset(result.data.updatePrivatisationOption);
        }
      } else {
        result = await createOption({
          variables: {
            input: {
              ...values,
              restaurantId: restaurantId,
            },
          },
        });
        if (result.data.createPrivatisationOption) {
            setExistingOptionId(result.data.createPrivatisationOption.id);
            form.reset(result.data.createPrivatisationOption);
        }
      }
      toast.success("Modifications enregistrées");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue.");
    }
  }

  const menuItems = ["Menu A (3 plats)", "Menu B (4 plats)", "Menu C (5 plats)"];

  if (sessionLoading || queryLoading || settingsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gérer les privatisations</h1>
      </header>

      <Tabs defaultValue="options" className="w-full">
        <TabsList className="border-b border-gray-200 w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger value="options" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-500 rounded-none">
            Options de privatisation
          </TabsTrigger>
          <TabsTrigger value="tarifs" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-500 rounded-none">
            Tarifs et disponibilités
          </TabsTrigger>
          <TabsTrigger value="conditions" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-gray-900 data-[state=active]:font-bold text-gray-500 rounded-none">
            Conditions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="font-bold">Options de privatisation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l’option de privatisation</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} className="rounded-lg border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea rows={5} {...field} className="rounded-lg border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de privatisation</FormLabel>
                        <FormControl>
                          <Input {...field} className="rounded-lg border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capaciteMaximale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacité maximale</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="rounded-lg border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dureeMaximaleHeures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée maximale de la privatisation (heures)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="rounded-lg border-gray-300" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="font-bold">Menus de groupe</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="menusDeGroupe"
                    render={() => (
                      <FormItem className="space-y-3">
                        {menuItems.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="menusDeGroupe"
                            render={({ field }) => {
                              return (
                                <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createLoading || updateLoading || settingsLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 ease-in-out">
                  {createLoading || updateLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="tarifs">
          <Card>
            <CardHeader>
              <CardTitle>Tarifs et disponibilités</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Section en cours de construction.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <CardTitle>Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Section en cours de construction.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
