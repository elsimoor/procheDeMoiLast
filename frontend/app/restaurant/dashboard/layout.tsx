import type React from "react"
import RestaurantSidebar from "@/components/restaurant/RestaurantSidebar"
import RestaurantNavigation from "@/components/restaurant/RestaurantNavigation"

export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantSidebar />
      <div className="md:pl-64">
        <RestaurantNavigation />
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
