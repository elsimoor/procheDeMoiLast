"use client"

import Link from "next/link"
import { gql, useQuery } from "@apollo/client"

const GET_SALONS = gql`
  query GetSalons {
    salons {
      id
      name
      description
      images
    }
  }
`

const GET_SERVICES = gql`
    query GetServices($salonId: ID!) {
        services(salonId: $salonId) {
            name
            description
            price
        }
    }
`

/**
 * Landing page for the salon service.  Presents a luxurious hero
 * section and showcases top salon services with a consistent pink
 * colour scheme.  Visitors are encouraged to book appointments or
 * browse services.
 */
export default function SalonLanding() {
  const { data: salonsData, loading: salonsLoading, error: salonsError } = useQuery(GET_SALONS)

  const salons = salonsData?.salons || []
  const salon = salons[0] || {}

  const { data: servicesData, loading: servicesLoading, error: servicesError } = useQuery(GET_SERVICES, {
    variables: { salonId: salon.id },
    skip: !salon.id,
  })

  if (salonsLoading || servicesLoading) return <p>Loading...</p>
  if (salonsError || servicesError) return <p>Error :(</p>

  const services = servicesData?.services || []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl text-pink-600">{salon.name || "Salon Zenith"}</span>
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
              className="hidden md:inline-block bg-pink-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-pink-700 transition-colors"
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
        <div
          className="relative bg-cover bg-center h-[70vh]"
          style={{ backgroundImage: `url('${salon.images?.[0] || 'https://images.unsplash.com/photo-1583267743713-0f36bcbc89e4'}')` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="max-w-3xl mx-auto px-4 py-24 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {salon.name || "Laissez‑vous tenter par le luxe, rajeunissez vos sens"}
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8">
              {salon.description || "Découvrez le summum de la détente et de la beauté au Salon Zenith. Notre équipe d’experts se consacre à fournir des services personnalisés qui vous laisseront une sensation de fraîcheur et d’éclat."}
            </p>
            <Link
              href="/salon/booking"
              className="inline-block bg-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-700 transition-transform transform hover:scale-105"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
        {/* Services */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service: any) => (
              <div key={service.name} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 h-16 overflow-hidden">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-pink-600">{service.price}€</span>
                    <Link href="/salon/booking" className="text-pink-600 font-semibold hover:underline">
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Stylists */}
        <section className="bg-pink-50 py-16">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-gray-900 mb-10">Nos Stylistes Experts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61" alt="Stylist 1" className="w-32 h-32 rounded-full mx-auto mb-4" />
                        <h3 className="text-xl font-bold">Jessica</h3>
                        <p className="text-gray-600">Spécialiste couleur</p>
                    </div>
                    <div className="text-center">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e" alt="Stylist 2" className="w-32 h-32 rounded-full mx-auto mb-4" />
                        <h3 className="text-xl font-bold">Marc</h3>
                        <p className="text-gray-600">Expert en coupe</p>
                    </div>
                    <div className="text-center">
                        <img src="https://images.unsplash.com/photo-1521119989659-a83eee488004" alt="Stylist 3" className="w-32 h-32 rounded-full mx-auto mb-4" />
                        <h3 className="text-xl font-bold">Sophie</h3>
                        <p className="text-gray-600">Maître styliste</p>
                    </div>
                </div>
            </div>
        </section>
        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Ce que nos clients disent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Une expérience incroyable ! Je suis tellement contente de ma nouvelle coupe."</p>
              <p className="font-bold text-gray-900">- Chloé</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Le meilleur salon de la ville. Le personnel est sympathique et professionnel."</p>
              <p className="font-bold text-gray-900">- Isabelle</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Je me sens comme une nouvelle femme ! Merci Salon Zenith."</p>
              <p className="font-bold text-gray-900">- Amélie</p>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Salon Zenith. Tous droits réservés.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="#" className="hover:text-pink-400">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-pink-400">Conditions d’utilisation</Link>
            <Link href="#" className="hover:text-pink-400">Nous contacter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}