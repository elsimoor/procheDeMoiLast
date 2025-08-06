"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { gql, useLazyQuery } from "@apollo/client";
import { toast } from "sonner";
import moment from "moment";

const GET_AVAILABILITY = gql`
  query Availability($restaurantId: ID!, $date: String!, $partySize: Int!) {
    availability(restaurantId: $restaurantId, date: $date, partySize: $partySize) {
      time
      available
    }
  }
`;

export default function ReserverPage() {
  const [personnes, setPersonnes] = useState(2);
  const [emplacement, setEmplacement] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [heure, setHeure] = useState("");
  const [availableSlots, setAvailableSlots] = useState<{time: string, available: boolean}[]>([]);

  const router = useRouter();

  // Replace with actual restaurant ID logic
  const restaurantId = "66b3e6e58d389964b73b7553";

  const [loadAvailability, { loading, error, data }] = useLazyQuery(GET_AVAILABILITY, {
    onCompleted: (data) => {
      setAvailableSlots(data.availability);
      if (data.availability.filter(s => s.available).length === 0) {
        toast.info("Aucun créneau disponible pour cette date ou ce nombre de personnes.");
      }
    },
    onError: (error) => {
      toast.error("Erreur lors de la récupération des disponibilités.");
      console.error(error);
    }
  });

  useEffect(() => {
    if (date && personnes > 0 && restaurantId) {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      loadAvailability({ variables: { restaurantId, date: formattedDate, partySize: personnes } });
    }
  }, [date, personnes, restaurantId, loadAvailability]);

  const isFormValid = date && heure && personnes > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const params = new URLSearchParams({
      date: date.toISOString().split("T")[0],
      heure,
      personnes: personnes.toString(),
      ...(emplacement && { emplacement }),
    });

    router.push(`/u/confirmation?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          <Card className="shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold text-gray-800 tracking-tight">Réserver une table</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <Label htmlFor="personnes" className="text-lg font-medium text-gray-700">Nombre de personne</Label>
                    <Input
                      id="personnes"
                      type="number"
                      value={personnes}
                      onChange={(e) => setPersonnes(parseInt(e.target.value, 10) || 1)}
                      min="1"
                      max="20"
                      required
                      className="mt-2 p-6 text-lg rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emplacement" className="text-lg font-medium text-gray-700">Endroit dans le restaurant</Label>
                    <Input
                      id="emplacement"
                      type="text"
                      value={emplacement}
                      onChange={(e) => setEmplacement(e.target.value)}
                      placeholder="Optionnel (ex: près de la fenêtre)"
                      className="mt-2 p-6 text-lg rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-lg font-medium text-gray-700">Heure de la réservation</Label>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {loading && <p>Chargement des créneaux...</p>}
                    {error && <p className="text-red-500">Erreur de chargement.</p>}
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        type="button"
                        variant={heure === slot.time ? "default" : "outline"}
                        onClick={() => setHeure(slot.time)}
                        disabled={!slot.available}
                        className="rounded-full px-6 py-3 text-md font-semibold"
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={!isFormValid || loading} size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-12 py-6 text-xl shadow-lg">
                    Réserver
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Date de la réservation</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
                disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                className="p-0"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
