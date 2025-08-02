import type React from "react"
import HotelSidebar from "@/components/hotel/HotelSidebar"
import HotelNavigation from "@/components/hotel/HotelNavigation"

export default function HotelDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HotelSidebar />
      <div className="md:pl-64">
        <HotelNavigation />
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
