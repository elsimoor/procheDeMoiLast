"use client"

import { useState, useEffect } from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const GET_PRIVATIZATION_OPTIONS = gql`
  query GetPrivatizationOptions($restaurantId: ID!) {
    privatizationOptions(restaurantId: $restaurantId) {
      id
      name
      description
      type
      maxCapacity
      maxDurationHours
      menuIds
    }
  }
`

const CREATE_PRIVATIZATION_OPTION = gql`
  mutation CreatePrivatizationOption($input: PrivatizationOptionInput!) {
    createPrivatizationOption(input: $input) {
      id
    }
  }
`

const UPDATE_PRIVATIZATION_OPTION = gql`
  mutation UpdatePrivatizationOption($id: ID!, $input: PrivatizationOptionInput!) {
    updatePrivatizationOption(id: $id, input: $input) {
      id
    }
  }
`

const GET_GROUP_MENUS = gql`
    query GetGroupMenus($restaurantId: ID!) {
        groupMenus(restaurantId: $restaurantId) {
            id
            name
        }
    }
`

export default function RestaurantPrivatizationsPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    type: "",
    maxCapacity: 0,
    maxDurationHours: 0,
    menuIds: [],
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

  const { data, loading, error } = useQuery(GET_PRIVATIZATION_OPTIONS, {
    variables: { restaurantId },
    skip: !restaurantId,
  })

  const { data: groupMenusData } = useQuery(GET_GROUP_MENUS, {
    variables: { restaurantId },
    skip: !restaurantId,
  })

  const [createPrivatizationOption] = useMutation(CREATE_PRIVATIZATION_OPTION)
  const [updatePrivatizationOption] = useMutation(UPDATE_PRIVATIZATION_OPTION)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!restaurantId) return

    const input = {
      restaurantId,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      maxCapacity: Number(formData.maxCapacity),
      maxDurationHours: Number(formData.maxDurationHours),
      menuIds: formData.menuIds,
    }

    try {
        if (formData.id) {
            await updatePrivatizationOption({ variables: { id: formData.id, input } })
        } else {
            await createPrivatizationOption({ variables: { input } })
        }
      alert("Privatization option saved successfully")
    } catch (err) {
      console.error(err)
      alert("Failed to save privatization option")
    }
  }

  if (sessionLoading || loading) return <p>Loading...</p>
  if (sessionError) return <p className="text-red-600">{sessionError}</p>
  if (error) return <p className="text-red-600">Error loading privatization options.</p>

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gérer les privatisations</h1>
      </div>

      <Tabs defaultValue="options">
        <TabsList>
          <TabsTrigger value="options">Options de privatisation</TabsTrigger>
          <TabsTrigger value="pricing">Tarifs et disponibilités</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
        </TabsList>
        <TabsContent value="options">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Options de privatisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de l’option de privatisation</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type de privatisation</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxCapacity">Capacité maximale</Label>
                  <Input
                    id="maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="maxDurationHours">Durée maximale de la privatisation (heures)</Label>
                  <Input
                    id="maxDurationHours"
                    type="number"
                    value={formData.maxDurationHours}
                    onChange={(e) => setFormData({ ...formData, maxDurationHours: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Menus de groupe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {groupMenusData?.groupMenus.map((menu: any) => (
                  <div key={menu.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={menu.id}
                      checked={formData.menuIds.includes(menu.id)}
                      onCheckedChange={(checked) => {
                        const newMenuIds = checked
                          ? [...formData.menuIds, menu.id]
                          : formData.menuIds.filter((id: string) => id !== menu.id)
                        setFormData({ ...formData, menuIds: newMenuIds })
                      }}
                    />
                    <Label htmlFor={menu.id}>{menu.name}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit">Enregistrer les modifications</Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="pricing">
          {/* Add pricing and availability form here */}
        </TabsContent>
        <TabsContent value="conditions">
          {/* Add conditions form here */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
