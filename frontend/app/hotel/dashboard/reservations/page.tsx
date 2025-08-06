"use client";

import { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

/**
 * Reservation management page for hotel businesses.  This page allows the
 * operator to view, create and delete reservations.  It uses session data
 * exposed via `/api/session` to determine the current hotel (business)
 * context and fetches all rooms so the user can select a room for the
 * reservation.
 */

// Query to fetch rooms for the current hotel
const GET_ROOMS = gql`
  query GetRooms($hotelId: ID!) {
    rooms(hotelId: $hotelId) {
      id
      number
      type
    }
  }
`;

// Query to fetch reservations for a business
const GET_RESERVATIONS = gql`
  query GetReservations($businessId: ID!, $businessType: String!) {
    reservations(businessId: $businessId, businessType: $businessType) {
      id
      customerInfo {
        name
        email
        phone
      }
      roomId {
        id
        number
      }
      checkIn
      checkOut
      guests
      status
      totalAmount
      createdAt
    }
  }
`;

// Mutation to create a reservation
const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationInput!) {
    createReservation(input: $input) {
      id
      status
    }
  }
`;

// Mutation to update a reservation
const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($id: ID!, $input: ReservationInput!) {
    updateReservation(id: $id, input: $input) {
      id
      status
    }
  }
`;

// Mutation to delete a reservation
const DELETE_RESERVATION = gql`
  mutation DeleteReservation($id: ID!) {
    deleteReservation(id: $id)
  }
`;

interface ReservationFormState {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number | "";
  totalAmount: number | "";
  status: string;
}

export default function HotelReservationsPage() {
  // Session / business context
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) {
          setSessionLoading(false);
          return;
        }
        const data = await res.json();
        // Session stores the businessType in lower case.  Compare
        // case-insensitively when determining if this is a hotel account.
        if (data.businessType && data.businessType.toLowerCase() === "hotel" && data.businessId) {
          setBusinessId(data.businessId);
          setBusinessType(data.businessType);
        } else {
          setSessionError("You are not associated with a hotel business.");
        }
      } catch (err) {
        setSessionError("Failed to load session.");
      } finally {
        setSessionLoading(false);
      }
    }
    fetchSession();
  }, []);

  // Fetch rooms to populate the room select
  const {
    data: roomsData,
    loading: roomsLoading,
    error: roomsError,
  } = useQuery(GET_ROOMS, {
    variables: { hotelId: businessId },
    skip: !businessId,
  });

  // Fetch reservations
  const {
    data: reservationsData,
    loading: reservationsLoading,
    error: reservationsError,
    refetch: refetchReservations,
  } = useQuery(GET_RESERVATIONS, {
    variables: { businessId, businessType },
    skip: !businessId || !businessType,
  });

  // Mutations
  const [createReservation] = useMutation(CREATE_RESERVATION);
  const [deleteReservation] = useMutation(DELETE_RESERVATION);
const [updateReservation] = useMutation(UPDATE_RESERVATION);

  // Form state
  const [formState, setFormState] = useState<ReservationFormState>({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    totalAmount: "",
    status: "pending",
  });
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setFormState({
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomId: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      totalAmount: "",
      status: "pending",
    });
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId || !businessType) return;
    try {
      const input: any = {
        businessId,
        businessType,
        customerInfo: {
          name: formState.guestName,
          email: formState.guestEmail,
          phone: formState.guestPhone,
        },
        roomId: formState.roomId || null,
        checkIn: formState.checkIn || null,
        checkOut: formState.checkOut || null,
        guests: formState.guests !== "" ? Number(formState.guests) : undefined,
        date: new Date().toISOString(),
        status: formState.status,
        totalAmount: formState.totalAmount !== "" ? Number(formState.totalAmount) : undefined,
        paymentStatus: "pending",
      };
      await createReservation({ variables: { input } });
      resetForm();
      refetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this reservation?")) {
      await deleteReservation({ variables: { id } });
      refetchReservations();
    }
  };

  // Handle updating the status (or other fields) of a reservation.  When
  // changing the status we need to send all required fields expected by
  // ReservationInput because GraphQL does not support partial updates.
  const handleStatusChange = async (reservation: any, newStatus: string) => {
    if (!businessId || !businessType) return;
    try {
      const input: any = {
        businessId,
        businessType,
        customerInfo: {
          name: reservation.customerInfo?.name,
          email: reservation.customerInfo?.email,
          phone: reservation.customerInfo?.phone,
        },
        roomId: reservation.roomId?.id ?? null,
        checkIn: reservation.checkIn ?? null,
        checkOut: reservation.checkOut ?? null,
        guests: reservation.guests,
        date: reservation.createdAt ?? reservation.date ?? new Date().toISOString(),
        totalAmount: reservation.totalAmount ?? undefined,
        status: newStatus,
        paymentStatus: reservation.paymentStatus ?? 'pending',
      };
      await updateReservation({ variables: { id: reservation.id, input } });
      refetchReservations();
    } catch (err) {
      console.error(err);
    }
  };

  // Render loading/error states
  if (sessionLoading || roomsLoading || reservationsLoading) return <p>Loading...</p>;
  if (sessionError) return <p>{sessionError}</p>;
  if (roomsError) return <p>Error loading rooms.</p>;
  if (reservationsError) return <p>Error loading reservations.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Reservations</h1>

      {/* List of reservations */}
      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Existing Reservations</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            New Reservation
          </button>
        </div>
        {reservationsData?.reservations && reservationsData.reservations.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium">Guest</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Room</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Check‑In</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Check‑Out</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Guests</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Amount</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservationsData.reservations.map((res: any) => (
                <tr key={res.id} className="border-t">
                  <td className="px-4 py-2">{res.customerInfo?.name}</td>
                  <td className="px-4 py-2">{res.roomId?.number || ""}</td>
                  <td className="px-4 py-2">{res.checkIn ? new Date(res.checkIn).toLocaleDateString() : ""}</td>
                  <td className="px-4 py-2">{res.checkOut ? new Date(res.checkOut).toLocaleDateString() : ""}</td>
                  <td className="px-4 py-2">{res.guests}</td>
                  <td className="px-4 py-2">{res.totalAmount ?? ""}</td>
                  <td className="px-4 py-2 capitalize">
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res, e.target.value)}
                      className="border rounded px-2 py-1 text-sm capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                      onClick={() => handleDelete(res.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reservations found.</p>
        )}
      </section>

      {/* Form for creating a new reservation */}
      {showForm && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">New Reservation</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Guest Name</label>
              <input
                type="text"
                value={formState.guestName}
                onChange={(e) => setFormState({ ...formState, guestName: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Guest Email</label>
              <input
                type="email"
                value={formState.guestEmail}
                onChange={(e) => setFormState({ ...formState, guestEmail: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Guest Phone</label>
              <input
                type="text"
                value={formState.guestPhone}
                onChange={(e) => setFormState({ ...formState, guestPhone: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Room</label>
              <select
                value={formState.roomId}
                onChange={(e) => setFormState({ ...formState, roomId: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a room</option>
                {roomsData?.rooms?.map((room: any) => (
                  <option key={room.id} value={room.id}>
                    {room.number} ({room.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Check‑In Date</label>
              <input
                type="date"
                value={formState.checkIn}
                onChange={(e) => setFormState({ ...formState, checkIn: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Check‑Out Date</label>
              <input
                type="date"
                value={formState.checkOut}
                onChange={(e) => setFormState({ ...formState, checkOut: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Guests</label>
              <input
                type="number"
                value={formState.guests}
                onChange={(e) => setFormState({ ...formState, guests: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full p-2 border rounded"
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Total Amount</label>
              <input
                type="number"
                value={formState.totalAmount}
                onChange={(e) => setFormState({ ...formState, totalAmount: e.target.value === "" ? "" : Number(e.target.value) })}
                className="w-full p-2 border rounded"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                value={formState.status}
                onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Create Reservation
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}