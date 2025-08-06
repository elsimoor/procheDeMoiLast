"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { gql, useQuery } from "@apollo/client";
import { Suspense } from "react";

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      images
    }
  }
`;

function AccueilContent() {
  const { loading, error, data } = useQuery(GET_RESTAURANTS);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading restaurants...</div>;
  if (error) return <div className="flex h-screen items-center justify-center">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-gray-800">Choisissez un restaurant</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.restaurants.map((restaurant: any) => (
            <Card key={restaurant.id} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <img src={restaurant.images[0] || '/placeholder.jpg'} alt={restaurant.name} className="w-full h-56 object-cover" />
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 h-20 overflow-hidden">{restaurant.description}</p>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4">
                <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full py-6 text-lg font-semibold">
                  <Link href={`/u/reserver?restaurantId=${restaurant.id}`}>
                    Réserver une table
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AccueilPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <AccueilContent />
        </Suspense>
    )
}
