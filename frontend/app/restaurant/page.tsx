"use client"

import Link from "next/link"

/**
 * Landing page for the restaurant service.  Highlights the cuisine and
 * atmosphere of the restaurant and encourages guests to book a table.
 */
export default function RestaurantLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-red-600">Gastronomie</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <Link href="/restaurant" className="hover:text-red-600">Accueil</Link>
            <Link href="/restaurant/menus" className="hover:text-red-600">Menus</Link>
            <Link href="/restaurant/gallery" className="hover:text-red-600">Galerie</Link>
            <Link href="/restaurant/contact" className="hover:text-red-600">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/restaurant/booking"
              className="hidden md:inline-block bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700"
            >
              Réserver
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
        <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="max-w-3xl mx-auto px-4 py-24 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Bienvenue au Gastronomie</h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8">
              Savourez des plats raffinés préparés avec passion par nos chefs et profitez d’une atmosphère chaleureuse.
            </p>
            <Link
              href="/restaurant/booking"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-red-700"
            >
              Réserver une table
            </Link>
          </div>
        </div>
        {/* Menus teaser */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nos spécialités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                alt="Entrée"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Entrées gourmandes</h3>
                <p className="text-sm text-gray-600">
                  Des entrées délicates et savoureuses pour éveiller vos papilles dès le début du repas.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1478145046317-39f10e56b5e9"
                alt="Plat principal"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plats principaux</h3>
                <p className="text-sm text-gray-600">
                  Des plats généreux aux saveurs authentiques inspirés par la cuisine locale et internationale.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1498579809087-ef1e558fd1bf"
                alt="Dessert"
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Desserts délicieux</h3>
                <p className="text-sm text-gray-600">
                  Terminez votre repas en beauté avec nos desserts maison gourmands et délicats.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600 flex justify-between items-center">
          <span>@2024 Gastronomie. Tous droits réservés.</span>
          <div className="space-x-6">
            <Link href="#" className="hover:text-red-600">
              Politique de confidentialité
            </Link>
            <Link href="#" className="hover:text-red-600">
              Conditions d’utilisation
            </Link>
            <Link href="#" className="hover:text-red-600">
              Nous contacter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}