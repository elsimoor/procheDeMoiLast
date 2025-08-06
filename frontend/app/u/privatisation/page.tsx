"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { gql, useQuery } from "@apollo/client";
import { toast } from "sonner";

const GET_PRIVATISATION_OPTIONS = gql`
  query PrivatisationOptionsByRestaurant($restaurantId: ID!) {
    privatisationOptionsByRestaurant(restaurantId: $restaurantId) {
      id
      nom
      menusDeGroupe
    }
  }
`;

export default function PrivatisationPage() {
  const [type, setType] = useState<"restaurant" | "menu" | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [menu, setMenu] = useState("");
  const [espace, setEspace] = useState("Salle entière"); // Default as per requirements

  const router = useRouter();

  // Replace with actual restaurant ID logic
  const restaurantId = "66b3e6e58d389964b73b7553";

  const { loading, error, data } = useQuery(GET_PRIVATISATION_OPTIONS, {
    variables: { restaurantId },
    skip: !restaurantId,
    onError: (err) => {
      toast.error("Erreur lors du chargement des options.");
      console.error(err);
    }
  });

  const selectedOption = data?.privatisationOptionsByRestaurant.find(opt => opt.id === selectedOptionId);

  const isFormValid = type && selectedOptionId && menu && espace;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const params = new URLSearchParams({
      typePrivatisation: selectedOption.nom,
      menuGroupe: menu,
      espace,
      // Pass other required info for confirmation page
      personnes: "50", // Example value, this should be collected
      date: new Date().toISOString().split("T")[0], // Example
      heure: "19:00", // Example
    });

    router.push(`/u/confirmation?${params.toString()}&type=privatisation`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto">
        <Card className="shadow-2xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold text-gray-800 tracking-tight">Privatisation</CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Choisissez votre option</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="button"
                    variant={type === 'restaurant' ? "default" : "outline"}
                    onClick={() => setType("restaurant")}
                    className="flex-1 py-6 text-lg rounded-xl"
                  >
                    Privatiser le restaurant
                  </Button>
                  <Button
                    type="button"
                    variant={type === 'menu' ? "default" : "outline"}
                    onClick={() => setType("menu")}
                    className="flex-1 py-6 text-lg rounded-xl"
                  >
                    Réserver un menu à l’avance
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700">Détails de la privatisation</h3>

                <Select onValueChange={setSelectedOptionId} value={selectedOptionId} required>
                  <SelectTrigger className="w-full p-6 text-lg rounded-xl">
                    <SelectValue placeholder="Type de privatisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading && <SelectItem value="loading" disabled>Chargement...</SelectItem>}
                    {data?.privatisationOptionsByRestaurant?.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>{opt.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={setMenu} value={menu} disabled={!selectedOption} required>
                  <SelectTrigger className="w-full p-6 text-lg rounded-xl">
                    <SelectValue placeholder="Menu du groupe" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedOption?.menusDeGroupe.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={setEspace} value={espace} required>
                  <SelectTrigger className="w-full p-6 text-lg rounded-xl">
                    <SelectValue placeholder="Choix de l'espace" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* If space management is not implemented, this is the only option */}
                    <SelectItem value="Salle entière">Salle entière</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={!isFormValid || loading} size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-12 py-6 text-xl shadow-lg">
                  Confirmer la réservation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
