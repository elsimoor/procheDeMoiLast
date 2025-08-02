"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, Users, Bed, Settings, Hotel, BarChart3 } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/hotel/dashboard", icon: LayoutDashboard },
  { name: "Reservations", href: "/hotel/dashboard/reservations", icon: Calendar },
  { name: "Guests", href: "/hotel/dashboard/guests", icon: Users },
  { name: "Rooms", href: "/hotel/dashboard/rooms", icon: Bed },
  { name: "Options", href: "/hotel/dashboard/options", icon: BarChart3 },
  { name: "Settings", href: "/hotel/dashboard/settings", icon: Settings },
  { name: "Opening Hours", href: "/hotel/dashboard/opening-hours", icon: Calendar },
]

export default function HotelSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-blue-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Hotel className="h-8 w-8 text-white" />
            <span className="ml-2 text-white text-lg font-semibold">Hotel Dashboard</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive ? "bg-blue-900 text-white" : "text-blue-100 hover:bg-blue-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${isActive ? "text-white" : "text-blue-300"} mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
