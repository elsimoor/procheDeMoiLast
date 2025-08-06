import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AccueilPage() {
  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Top Right Buttons */}
      <div className="absolute top-6 right-6 z-10 flex items-center space-x-4">
        <Button asChild variant="outline" className="border-red-500 text-white hover:bg-red-500 hover:text-white rounded-full px-6 py-2 transition-colors duration-300">
          <Link href="/u/privatisation">Privatiser</Link>
        </Button>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 transition-colors duration-300">
          <Link href="/u/reserver">Réserver</Link>
        </Button>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <div className="bg-black bg-opacity-30 p-10 rounded-2xl backdrop-blur-sm">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Découvrez une Expérience Culinaire Inoubliable
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            Savourez des plats exquis préparés avec passion par nos chefs de renommée mondiale. Une ambiance élégante et un service impeccable vous attendent pour rendre chaque visite mémorable.
          </p>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-16 py-8 text-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
              <Link href="/u/reserver">Réserver</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
