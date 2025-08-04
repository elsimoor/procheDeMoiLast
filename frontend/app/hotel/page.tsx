"use client"

import Link from "next/link"
import { gql, useQuery } from "@apollo/client"

const GET_HOTELS = gql`
  query GetHotels {
    hotels {
      id
      name
      description
      images
    }
  }
`

/**
 * Landing page for the hotel service.  This page showcases the
 * hospitality offering and invites visitors to explore rooms and
 * amenities.  A simple navigation bar provides links to key
 * sections and a call‑to‑action button directs users to make a
 * reservation.
 */
export default function HotelLanding() {
  const { data, loading, error } = useQuery(GET_HOTELS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const hotels = data?.hotels || []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-blue-600">StayEase</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <Link href="/hotel" className="hover:text-blue-600">Accueil</Link>
            <Link href="/hotel/services" className="hover:text-blue-600">Services</Link>
            <Link href="/hotel/about" className="hover:text-blue-600">À propos</Link>
            <Link href="/hotel/contact" className="hover:text-blue-600">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/hotel/search"
              className="hidden md:inline-block bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Réserver maintenant
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>
      {/* Hero */}
      <main className="flex-1">
        <div className="relative bg-cover bg-center h-[60vh]" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501117716987-c8e1ecfb3542')` }}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="max-w-3xl mx-auto px-4 py-24 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">Bienvenue à StayEase</h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8">
              Découvrez des séjours d’exception, des chambres confortables et un service attentif pour rendre votre visite inoubliable.
            </p>
            <Link
              href="/hotel/search"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Trouver une chambre
            </Link>
          </div>
        </div>
        {/* Featured Hotels */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Nos Hôtels Vedettes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.slice(0, 3).map((hotel: any) => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <img
                  src={hotel.images[0] || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511'}
                  alt={hotel.name}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 h-16 overflow-hidden">{hotel.description}</p>
                  <Link href={`/hotel/rooms?hotelId=${hotel.id}`} className="text-blue-600 font-semibold hover:underline">
                    Voir les chambres
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Special Offers */}
        <section className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Offres Spéciales</h2>
            <p className="text-lg text-gray-600 mb-8">Profitez de nos offres exclusives pour un séjour inoubliable.</p>
            <div className="inline-block bg-white p-6 rounded-lg shadow-lg">
              <p className="text-2xl font-bold text-blue-600">20% de réduction pour les longs séjours</p>
              <p className="text-gray-700 mt-2">Réservez 5 nuits ou plus et économisez !</p>
            </div>
          </div>
        </section>
        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Ce que nos clients disent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Un séjour absolument fantastique ! Le personnel était incroyable et les chambres étaient magnifiques."</p>
              <p className="font-bold text-gray-900">- Jean Dupont</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Le meilleur hôtel où j'ai séjourné. Propre, moderne et avec une vue imprenable."</p>
              <p className="font-bold text-gray-900">- Marie Lemaire</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Je recommande vivement StayEase. Un service 5 étoiles du début à la fin."</p>
              <p className="font-bold text-gray-900">- Pierre Martin</p>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} StayEase. Tous droits réservés.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="#" className="hover:text-blue-400">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-blue-400">Conditions d’utilisation</Link>
            <Link href="#" className="hover:text-blue-400">Nous contacter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}