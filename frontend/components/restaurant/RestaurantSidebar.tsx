"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, UtensilsCrossed, Settings, Menu, UserCheck } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/restaurant/dashboard", icon: LayoutDashboard },
  { name: "Reservations", href: "/restaurant/dashboard/reservations", icon: Calendar },
  { name: "Tables", href: "/restaurant/dashboard/tables", icon: UtensilsCrossed },
  { name: "Menus", href: "/restaurant/dashboard/menus", icon: Menu },
  { name: "Staff", href: "/restaurant/dashboard/staff", icon: UserCheck },
  { name: "Settings", href: "/restaurant/dashboard/settings", icon: Settings },
]

export default function RestaurantSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-red-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <UtensilsCrossed className="h-8 w-8 text-white" />
            <span className="ml-2 text-white text-lg font-semibold">Restaurant Dashboard</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive ? "bg-red-900 text-white" : "text-red-100 hover:bg-red-700"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${isActive ? "text-white" : "text-red-300"} mr-3 flex-shrink-0 h-6 w-6`}
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
