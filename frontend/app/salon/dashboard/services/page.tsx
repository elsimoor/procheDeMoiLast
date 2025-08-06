"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
import { Search, Plus, Edit, Trash2, X, Clock, DollarSign, Star, Scissors } from "lucide-react"

interface Service {
  id: string
  name: string
  category: string
  description?: string
  duration?: number
  price: number
  available?: boolean
  popular?: boolean
  /**
   * IDs of staff roles required to perform this service.  For example,
   * ["hairstylist"] or ["masseuse", "assistant"].  Optional.
   */
  staffRequired?: string[]
  /**
   * Array of image URLs associated with this service.  Used for
   * showcasing services on the public website.  Optional.
   */
  images?: string[]
  /**
   * Default staff member assigned when clients do not choose a stylist.
   * This is the staff ID.  Optional.
   */
  defaultEmployee?: string
  /**
   * Default room assigned for the service when clients do not choose a
   * room.  Uses the table model as rooms in the backend.  Optional.
   */
  defaultRoom?: string
  /**
   * Whether clients are allowed to choose their own stylist/room.  If
   * false, the default assignments are used.  Optional.
   */
  allowClientChoose?: boolean
}

/**
 * SalonServices page displays a list of all services offered by the salon
 * and provides CRUD operations via GraphQL.  Services are grouped by
 * category and can be filtered using a search bar.  A modal allows
 * creating and editing services.
 */
export default function SalonServices() {
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [salonId, setSalonId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session")
        if (!res.ok) {
          setSessionLoading(false)
          return
        }
        const data = await res.json()
        if (data.salonId) {
          setSalonId(data.salonId)
        } else {
          setSessionError("You are not associated with a salon business.")
        }
      } catch (err) {
        setSessionError("Failed to load session.")
      } finally {
        setSessionLoading(false)
      }
    }
    fetchSession()
  }, [])

  // GraphQL queries and mutations
  const GET_SERVICES = gql`
    query GetServices($salonId: ID!) {
      services(salonId: $salonId) {
        id
        name
        description
        category
        duration
        price
        available
        popular
        staffRequired
        images
        defaultEmployee
        defaultRoom
        allowClientChoose
      }
    }
  `

  // Fetch staff list for default employee selection.  We re-use the staff query
  // from other pages to populate a dropdown of employees.
  const GET_STAFF = gql`
    query GetStaff($salonId: ID!) {
      staff(salonId: $salonId) {
        id
        name
        role
      }
    }
  `
  // Fetch rooms (tables) list for default room selection.  In the backend
  // salon rooms are stored using the table model with restaurantId equal
  // to the salonId, so we query tables by restaurantId.  Only id and
  // location (name) are needed for the dropdown.
  const GET_ROOMS = gql`
    query GetTables($salonId: ID!) {
      tables(salonId: $salonId) {
        id
        location
        capacity
      }
    }
  `
  const CREATE_SERVICE = gql`
    mutation CreateService($input: ServiceInput!) {
      createService(input: $input) {
        id
      }
    }
  `
  const UPDATE_SERVICE = gql`
    mutation UpdateService($id: ID!, $input: ServiceInput!) {
      updateService(id: $id, input: $input) {
        id
      }
    }
  `
  const DELETE_SERVICE = gql`
    mutation DeleteService($id: ID!) {
      deleteService(id: $id)
    }
  `

  const { data: servicesData, loading: servicesLoading, error: servicesError, refetch: refetchServices } = useQuery(GET_SERVICES, {
    variables: { salonId: salonId },
    skip: !salonId,
  })

  // staff query for default employee field
  const { data: staffData } = useQuery(GET_STAFF, {
    variables: { salonId: salonId },
    skip: !salonId,
  })
  const { data: roomsData } = useQuery(GET_ROOMS, {
    variables: { salonId: salonId },
    skip: !salonId,
  })
  const [createService] = useMutation(CREATE_SERVICE)
  const [updateService] = useMutation(UPDATE_SERVICE)
  const [deleteService] = useMutation(DELETE_SERVICE)

  const services: Service[] = servicesData?.services ?? []

  // Compute categories list from services
  const categories = useMemo(() => {
    const map: Record<string, number> = {}
    services.forEach((service) => {
      const cat = service.category || "other"
      map[cat] = (map[cat] || 0) + 1
    })
    const result = Object.entries(map).map(([id, count]) => ({ id, name: id[0].toUpperCase() + id.slice(1), count }))
    // Set default active category if not already set
    if (!activeCategory && result.length > 0) {
      setActiveCategory(result[0].id)
    }
    return result
  }, [services, activeCategory])

  // Form data for create/edit service
  const [formData, setFormData] = useState<Partial<Service>>({
    name: "",
    category: "",
    description: "",
    duration: 60,
    price: 0,
    available: true,
    popular: false,
    staffRequired: [],
    images: [],
    defaultEmployee: "",
    defaultRoom: "",
    allowClientChoose: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      category: activeCategory,
      description: "",
      duration: 60,
      price: 0,
      available: true,
      popular: false,
      staffRequired: [],
      images: [],
      defaultEmployee: "",
      defaultRoom: "",
      allowClientChoose: true,
    })
  }

  const openCreateModal = () => {
    setEditingService(null)
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({ ...service })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    try {
      await deleteService({ variables: { id } })
      await refetchServices()
    } catch (err) {
      console.error(err)
      alert("Failed to delete service")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!salonId) {
      alert("Unable to save service: salon context unavailable.")
      return
    }
    const input = {
      salonId: salonId,
      name: formData.name || "",
      description: formData.description || "",
      category: formData.category || "other",
      duration: formData.duration || 60,
      price: formData.price || 0,
      available: formData.available !== undefined ? formData.available : true,
      popular: formData.popular !== undefined ? formData.popular : false,
      staffRequired: formData.staffRequired || [],
      requirements: [],
      images: formData.images || [],
      defaultEmployee: formData.defaultEmployee || null,
      defaultRoom: formData.defaultRoom || null,
      allowClientChoose: formData.allowClientChoose ?? true,
    }
    try {
      if (editingService) {
        await updateService({ variables: { id: editingService.id, input } })
      } else {
        await createService({ variables: { input } })
      }
      await refetchServices()
      setShowModal(false)
      setEditingService(null)
      resetForm()
    } catch (err) {
      console.error(err)
      alert("Failed to save service")
    }
  }

  // Filter services by active category and search term
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const inCategory = service.category === activeCategory
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
      return inCategory && matchesSearch
    })
  }, [services, activeCategory, searchTerm])

  if (sessionLoading) {
    return <div>Loading...</div>
  }
  if (sessionError) {
    return <div className="text-red-500">{sessionError}</div>
  }
  if (servicesLoading) {
    return <div>Loading services...</div>
  }
  if (servicesError) {
    return <div className="text-red-500">Error loading services.</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage your salon services and offerings</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Service
        </button>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                activeCategory === cat.id ? "bg-pink-600 text-white border-pink-600" : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                {service.popular && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">{service.description || "No description"}</p>
              <div className="mt-4 space-y-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-pink-600" />
                  <span>{service.duration || 60} min</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-pink-600" />
                  <span>${service.price}</span>
                </div>
                {service.staffRequired && service.staffRequired.length > 0 && (
                  <div className="flex items-center">
                    <Scissors className="h-4 w-4 mr-2 text-pink-600" />
                    <span>{service.staffRequired.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => handleEdit(service)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
        {filteredServices.length === 0 && <p className="text-gray-500">No services found.</p>}
      </div>

      {/* Modal for Create/Edit Service */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingService ? "Edit Service" : "New Service"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration || 60}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value, 10) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available !== undefined ? formData.available : true}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.popular !== undefined ? formData.popular : false}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="mr-2"
                  />
                    <span className="text-sm text-gray-700">Popular</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Required (comma separated)</label>
                <input
                  type="text"
                  name="staffRequired"
                  value={formData.staffRequired?.join(", ") || ""}
                  onChange={(e) => setFormData({ ...formData, staffRequired: e.target.value.split(/\s*,\s*/).filter((s) => s) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Default employee selection */}
              {staffData?.staff && staffData.staff.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default employee</label>
                  <select
                    name="defaultEmployee"
                    value={formData.defaultEmployee || ""}
                    onChange={(e) => setFormData({ ...formData, defaultEmployee: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">None</option>
                    {staffData.staff.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} {emp.role ? `– ${emp.role}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Default room selection */}
              {roomsData?.tables && roomsData.tables.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default room</label>
                  <select
                    name="defaultRoom"
                    value={formData.defaultRoom || ""}
                    onChange={(e) => setFormData({ ...formData, defaultRoom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">None</option>
                    {roomsData.tables.map((room: any) => (
                      <option key={room.id} value={room.id}>
                        {room.location || room.id}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Allow client to choose */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.allowClientChoose ?? true}
                  onChange={(e) => setFormData({ ...formData, allowClientChoose: e.target.checked })}
                  className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">Allow client to choose stylist/room</span>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-3 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700"
                >
                  {editingService ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}