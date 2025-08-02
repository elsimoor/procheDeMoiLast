"use client"

import Link from "next/link"

/**
 * Landing page for the salon service.  Presents a luxurious hero
 * section and showcases top salon services with a consistent pink
 * colour scheme.  Visitors are encouraged to book appointments or
 * browse services.
 */
export default function SalonLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-pink-600">Salon&nbsp;Zenith</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            <Link href="/salon" className="hover:text-pink-600">Accueil</Link>
            <Link href="/salon/services" className="hover:text-pink-600">Services</Link>
            <Link href="/salon/about" className="hover:text-pink-600">À propos de nous</Link>
            <Link href="/salon/contact" className="hover:text-pink-600">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/salon/booking"
              className="hidden md:inline-block bg-pink-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-pink-700"
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
        <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583267743713-0f36bcbc89e4')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="max-w-3xl mx-auto px-4 py-24 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Laissez‑vous tenter par le luxe, rajeunissez vos sens
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8">
              Découvrez le summum de la détente et de la beauté au Salon&nbsp;Zenith. Notre équipe
              d’experts se consacre à fournir des services personnalisés qui vous laisseront une
              sensation de fraîcheur et d’éclat.
            </p>
            <Link
              href="/salon/booking"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-pink-700"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
        {/* Services teaser */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Nos services</h2>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="max-w-xs bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
                alt="Coiffure"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Coiffure</h3>
                <p className="text-sm text-gray-600">
                  Transformez votre look avec nos stylistes experts. Des coupes classiques aux
                  tendances modernes, nous créons un style qui vous convient.
                </p>
              </div>
            </div>
            <div className="max-w-xs bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522337660859-ebc2f28d17b8"
                alt="Massothérapie"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Massothérapie</h3>
                <p className="text-sm text-gray-600">
                  Détendez‑vous et relaxez‑vous avec nos massages thérapeutiques. Nos thérapeutes
                  qualifiés soulageront vos tensions et restaureront votre bien‑être.
                </p>
              </div>
            </div>
            <div className="max-w-xs bg-white rounded-xl shadow overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"
                alt="Bronzage UV"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bronzage UV</h3>
                <p className="text-sm text-gray-600">
                  Obtenez un éclat ensoleillé avec nos services de bronzage UV sûrs et efficaces.
                  Personnalisez votre bronzage pour un look naturel.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-sm text-gray-600 flex justify-between items-center">
          <span>@2024 Salon&nbsp;Zenith. Tous droits réservés.</span>
          <div className="space-x-6">
            <Link href="#" className="hover:text-pink-600">
              Politique de confidentialité
            </Link>
            <Link href="#" className="hover:text-pink-600">
              Conditions d’utilisation
            </Link>
            <Link href="#" className="hover:text-pink-600">
              Nous contacter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}