"use client"

import Link from "next/link"
import { gql, useQuery } from "@apollo/client"

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      description
      images
    }
  }
`

const GET_MENU_ITEMS = gql`
    query GetMenuItems($restaurantId: ID!) {
        menuItems(restaurantId: $restaurantId) {
            name
            description
            price
        }
    }
`

const GET_TABLES = gql`
    query GetTables($restaurantId: ID!) {
        tables(restaurantId: $restaurantId) {
            id
            number
            capacity
            status
        }
    }
`

/**
 * Landing page for the restaurant service.  Highlights the cuisine and
 * atmosphere of the restaurant and encourages guests to book a table.
 */
const RestaurantSection = ({ restaurant }: { restaurant: any }) => {
  const { data: menuItemsData, loading: menuItemsLoading, error: menuItemsError } = useQuery(GET_MENU_ITEMS, {
    variables: { restaurantId: restaurant.id },
  });

  const { data: tablesData, loading: tablesLoading, error: tablesError } = useQuery(GET_TABLES, {
    variables: { restaurantId: restaurant.id },
  });

  if (menuItemsLoading || tablesLoading) return <p>Loading...</p>;
  if (menuItemsError || tablesError) return <p>Error :(</p>;

  const menuItems = menuItemsData?.menuItems || [];
  const tables = tablesData?.tables || [];

  return (
    <div className="mb-16">
      <div
        className="relative bg-cover bg-center h-[70vh]"
        style={{ backgroundImage: `url('${restaurant.images?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'}')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {restaurant.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8">
            {restaurant.description}
          </p>
          <Link
            href={`/restaurant/booking?restaurantId=${restaurant.id}`}
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            Réserver une table
          </Link>
        </div>
      </div>
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-10 text-center">Notre Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.slice(0, 6).map((item: any) => (
            <div key={item.name} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4 h-16 overflow-hidden">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-red-600">{item.price}€</span>
                  <Link href={`/restaurant/menus?restaurantId=${restaurant.id}`} className="text-red-600 font-semibold hover:underline">
                    Voir le menu
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">Nos Tables</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {tables.map((table: any) => (
              <div key={table.id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-2">Table {table.number}</h3>
                <p className="text-gray-600">Capacité: {table.capacity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function RestaurantLanding() {
  const { data: restaurantsData, loading: restaurantsLoading, error: restaurantsError } = useQuery(GET_RESTAURANTS)

  if (restaurantsLoading) return <p>Loading...</p>
  if (restaurantsError) return <p>Error :(</p>

  const restaurants = restaurantsData?.restaurants || []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
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
              className="hidden md:inline-block bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Réserver
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
        {restaurants.map((restaurant: any) => (
            <RestaurantSection key={restaurant.id} restaurant={restaurant} />
        ))}
        {/* Reservation Info */}
        <section className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Réservez Votre Table</h2>
            <p className="text-lg text-gray-600 mb-8">Appelez-nous au <a href="tel:+123456789" className="text-red-600 hover:underline">123-456-789</a> ou réservez en ligne.</p>
            <Link href="/restaurant/booking" className="inline-block bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-transform transform hover:scale-105">
                Réserver en ligne
            </Link>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Gastronomie. Tous droits réservés.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="#" className="hover:text-red-400">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-red-400">Conditions d’utilisation</Link>
            <Link href="#" className="hover:text-red-400">Nous contacter</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}