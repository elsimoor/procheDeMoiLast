"use client"

import { useState, useEffect } from "react"
import { gql, useQuery } from "@apollo/client"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($restaurantId: ID!, $from: Date!, $to: Date!) {
    reservations(businessId: $restaurantId, businessType: "restaurant", dateRange: { from: $from, to: $to }) {
      id
      date
      time
      partySize
      status
    }
    restaurant(id: $restaurantId) {
      name
    }
  }
`

export default function RestaurantDashboardPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session")
        if (!res.ok) {
          setSessionLoading(false)
          return
        }
        const data = await res.json()
        if (data.businessType && data.businessType.toLowerCase() === "restaurant" && data.businessId) {
          setRestaurantId(data.businessId)
        } else {
          setSessionError("You are not associated with a restaurant business.")
        }
      } catch (err) {
        setSessionError("Failed to load session.")
      } finally {
        setSessionLoading(false)
      }
    }
    fetchSession()
  }, [])

  const from = date ? new Date(date.getFullYear(), date.getMonth(), 1) : new Date()
  const to = date ? new Date(date.getFullYear(), date.getMonth() + 1, 0) : new Date()

  const { data, loading, error } = useQuery(GET_DASHBOARD_DATA, {
    variables: { restaurantId, from, to },
    skip: !restaurantId,
  })

  if (sessionLoading || loading) return <p>Loading...</p>
  if (sessionError) return <p className="text-red-600">{sessionError}</p>
  if (error) return <p className="text-red-600">Error loading dashboard data.</p>

  const reservations = data?.reservations || []
  const restaurant = data?.restaurant

  const totalReservations = reservations.length
  const totalRevenue = reservations.reduce((acc: number, res: any) => acc + (res.totalAmount || 0), 0)
  const occupancyRate = 85 // Placeholder

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-gray-500">Aperçu de vos réservations et performances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Réservations totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalReservations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d’affaires généré</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalRevenue} €</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Taux de remplissage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{occupancyRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Nombre de personnes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((res: any) => (
                    <TableRow key={res.id}>
                      <TableCell>{new Date(res.date).toLocaleDateString()}</TableCell>
                      <TableCell>{res.time}</TableCell>
                      <TableCell>{restaurant?.name}</TableCell>
                      <TableCell>{res.partySize}</TableCell>
                      <TableCell>
                        <Badge variant={res.status === 'confirmed' ? 'default' : 'secondary'}>
                          {res.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Annuler</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
