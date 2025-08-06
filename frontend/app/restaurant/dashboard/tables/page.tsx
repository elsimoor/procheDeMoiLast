"use client"

import { useState, useEffect } from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const GET_RESTAURANT_SETTINGS = gql`
  query GetRestaurantSettings($restaurantId: ID!) {
    restaurant(id: $restaurantId) {
      id
      settings {
        openingHours {
          day
          openTime
          closeTime
          isOpen
        }
        slotFrequencyMinutes
        maxReservationsPerSlot
        totalCapacityOverride
      }
      tableCounts {
        seats2
        seats4
        seats6
        seats8
      }
    }
  }
`

const UPDATE_RESTAURANT_SETTINGS = gql`
  mutation UpdateRestaurantSettings($id: ID!, $input: RestaurantInput!) {
    updateRestaurant(id: $id, input: $input) {
      id
    }
  }
`

export default function RestaurantTablesPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({
    openingHours: [],
    slotFrequencyMinutes: 15,
    maxReservationsPerSlot: 5,
    totalCapacityOverride: 0,
    tableCounts: {
      seats2: 0,
      seats4: 0,
      seats6: 0,
      seats8: 0,
    },
  })

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

  const { data, loading, error } = useQuery(GET_RESTAURANT_SETTINGS, {
    variables: { restaurantId },
    skip: !restaurantId,
    onCompleted: (data) => {
      if (data?.restaurant) {
        setFormData({
          openingHours: data.restaurant.settings.openingHours,
          slotFrequencyMinutes: data.restaurant.settings.slotFrequencyMinutes,
          maxReservationsPerSlot: data.restaurant.settings.maxReservationsPerSlot,
          totalCapacityOverride: data.restaurant.settings.totalCapacityOverride,
          tableCounts: data.restaurant.tableCounts,
        })
      }
    },
  })

  const [updateRestaurantSettings] = useMutation(UPDATE_RESTAURANT_SETTINGS)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!restaurantId) return

    const input = {
      settings: {
        openingHours: formData.openingHours,
        slotFrequencyMinutes: Number(formData.slotFrequencyMinutes),
        maxReservationsPerSlot: Number(formData.maxReservationsPerSlot),
        totalCapacityOverride: Number(formData.totalCapacityOverride),
      },
      tableCounts: {
        seats2: Number(formData.tableCounts.seats2),
        seats4: Number(formData.tableCounts.seats4),
        seats6: Number(formData.tableCounts.seats6),
        seats8: Number(formData.tableCounts.seats8),
      },
    }

    try {
      await updateRestaurantSettings({ variables: { id: restaurantId, input } })
      alert("Settings updated successfully")
    } catch (err) {
      console.error(err)
      alert("Failed to update settings")
    }
  }

  if (sessionLoading || loading) return <p>Loading...</p>
  if (sessionError) return <p className="text-red-600">{sessionError}</p>
  if (error) return <p className="text-red-600">Error loading settings.</p>

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des tables et des disponibilités</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Jours d’ouverture</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add form fields for opening hours here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacité totale du restaurant</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="totalCapacityOverride">Nombre total de personnes acceptées</Label>
            <Input
              id="totalCapacityOverride"
              type="number"
              value={formData.totalCapacityOverride}
              onChange={(e) => setFormData({ ...formData, totalCapacityOverride: e.target.value })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nombre de tables par taille</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seats2">Tables de 2 personnes</Label>
              <Input
                id="seats2"
                type="number"
                value={formData.tableCounts.seats2}
                onChange={(e) => setFormData({ ...formData, tableCounts: { ...formData.tableCounts, seats2: e.target.value } })}
              />
            </div>
            <div>
              <Label htmlFor="seats4">Tables de 4 personnes</Label>
              <Input
                id="seats4"
                type="number"
                value={formData.tableCounts.seats4}
                onChange={(e) => setFormData({ ...formData, tableCounts: { ...formData.tableCounts, seats4: e.target.value } })}
              />
            </div>
            <div>
              <Label htmlFor="seats6">Tables de 6 personnes</Label>
              <Input
                id="seats6"
                type="number"
                value={formData.tableCounts.seats6}
                onChange={(e) => setFormData({ ...formData, tableCounts: { ...formData.tableCounts, seats6: e.target.value } })}
              />
            </div>
            <div>
              <Label htmlFor="seats8">Tables de 8 personnes</Label>
              <Input
                id="seats8"
                type="number"
                value={formData.tableCounts.seats8}
                onChange={(e) => setFormData({ ...formData, tableCounts: { ...formData.tableCounts, seats8: e.target.value } })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créneaux de réservation</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="slotFrequencyMinutes">Fréquence des créneaux (minutes)</Label>
            <Input
              id="slotFrequencyMinutes"
              type="number"
              value={formData.slotFrequencyMinutes}
              onChange={(e) => setFormData({ ...formData, slotFrequencyMinutes: e.target.value })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Limites de réservation par créneau</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="maxReservationsPerSlot">Nombre maximum de réservations par créneau</Label>
            <Input
              id="maxReservationsPerSlot"
              type="number"
              value={formData.maxReservationsPerSlot}
              onChange={(e) => setFormData({ ...formData, maxReservationsPerSlot: e.target.value })}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Enregistrer les modifications</Button>
        </div>
      </form>
    </div>
  )
}
