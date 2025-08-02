"use client"

import Link from "next/link"

/**
 * Landing page for the hotel service.  This page showcases the
 * hospitality offering and invites visitors to explore rooms and
 * amenities.  A simple navigation bar provides links to key
 * sections and a call‑to‑action button directs users to make a
 * reservation.
 */
export default function HotelLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-gray-50 border-b border-gray-200">
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
              className="hidden md:inline-block bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700"
            >
              Réserver maintenant
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>
      {/* Hero */}
      <main className="flex-1">
        <div className="relative bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501117716987-c8e1ecfb3542')` }}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="max-w-3xl mx-auto px-4 py-24 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Bienvenue à StayEase</h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8">
              Découvrez des séjours d’exception, des chambres confortables et un service attentif pour rendre votre visite inoubliable.
            </p>
            <Link
              href="/hotel/booking"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
        {/* Services teaser */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nos chambres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
                alt="Suite"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Suites de luxe</h3>
                <p className="text-sm text-gray-600">
                  Des suites spacieuses avec vue panoramique et services premium pour une expérience de luxe ultime.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1550958034-4d4c3e86e3cc"
                alt="Standard"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chambres standard</h3>
                <p className="text-sm text-gray-600">
                  Un confort moderne et tout le nécessaire pour un séjour agréable à un prix abordable.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
                alt="Familiale"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chambres familiales</h3>
                <p className="text-sm text-gray-600">
                  Des espaces conçus pour accueillir toute la famille avec confort et praticité.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600 flex justify-between items-center">
          <span>@2024 StayEase. Tous droits réservés.</span>
          <div className="space-x-6">
            <Link href="#" className="hover:text-blue-600">
              Politique de confidentialité
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Conditions d’utilisation
            </Link>
            <Link href="#" className="hover:text-blue-600">
              Nous contacter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}