"use client"

import { useState, useEffect } from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
import { Plus, Edit, Trash2, X } from "lucide-react"

interface Table {
  id: string
  number: number
  capacity: number
  location: string
  status: string
  features: string[]
}

/**
 * Salon room management.  Rooms are implemented using the same Table
 * model as restaurants.  Each room has a number (generated
 * sequentially), a capacity and a list of equipment stored in the
 * features array.  The location field is used to store the room
 * name, e.g. "Room 1".
 */
export default function SalonRooms() {
  // state for session and rooms
  const [salonId, setSalonId] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Table | null>(null)
  const [formData, setFormData] = useState<{ name: string; capacity: number; equipment: string }>({
    name: "",
    capacity: 1,
    equipment: "",
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
        if (data.businessType && data.businessType.toLowerCase() === "salon" && data.businessId) {
          setSalonId(data.businessId)
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

  // GraphQL operations
  const GET_TABLES = gql`
    query GetTables($restaurantId: ID!) {
      tables(restaurantId: $restaurantId) {
        id
        number
        capacity
        location
        status
        features
      }
    }
  `
  const CREATE_TABLE = gql`
    mutation CreateTable($input: TableInput!) {
      createTable(input: $input) {
        id
      }
    }
  `
  const UPDATE_TABLE = gql`
    mutation UpdateTable($id: ID!, $input: TableInput!) {
      updateTable(id: $id, input: $input) {
        id
      }
    }
  `
  const DELETE_TABLE = gql`
    mutation DeleteTable($id: ID!) {
      deleteTable(id: $id)
    }
  `

  const { data, loading, error, refetch } = useQuery(GET_TABLES, {
    variables: { restaurantId: salonId },
    skip: !salonId,
  })
  const [createTable] = useMutation(CREATE_TABLE, {
    onCompleted: () => refetch(),
  })
  const [updateTable] = useMutation(UPDATE_TABLE, {
    onCompleted: () => refetch(),
  })
  const [deleteTable] = useMutation(DELETE_TABLE, {
    onCompleted: () => refetch(),
  })

  const rooms: Table[] = data?.tables ?? []

  const openModal = (room?: Table) => {
    if (room) {
      // editing existing room
      setEditingRoom(room)
      setFormData({
        name: room.location,
        capacity: room.capacity,
        equipment: room.features.join(", "),
      })
    } else {
      setEditingRoom(null)
      setFormData({ name: "", capacity: 1, equipment: "" })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!salonId) return
    const features = formData.equipment
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    const input: any = {
      restaurantId: salonId,
      number: editingRoom ? editingRoom.number : rooms.length + 1,
      capacity: formData.capacity,
      location: formData.name,
      status: "available",
      features,
    }
    try {
      if (editingRoom) {
        await updateTable({ variables: { id: editingRoom.id, input } })
      } else {
        await createTable({ variables: { input } })
      }
      setShowModal(false)
    } catch (err) {
      console.error(err)
      alert("Failed to save room")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this room?")) return
    try {
      await deleteTable({ variables: { id } })
    } catch (err) {
      console.error(err)
      alert("Failed to delete room")
    }
  }

  if (sessionLoading) return <div>Loading...</div>
  if (sessionError) return <div className="text-red-500">{sessionError}</div>
  if (loading) return <div>Loading rooms...</div>
  if (error) return <div className="text-red-500">Error loading rooms</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Room
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {room.location || `Room ${room.number}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {room.features.join(", ") || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-3">
                  <button
                    onClick={() => openModal(room)}
                    className="text-pink-600 hover:text-pink-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRoom ? "Edit Room" : "Add Room"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  min={1}
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment (comma‑separated)</label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}