"use client"

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { gql, useMutation, useQuery } from "@apollo/client";
import { getBooking, clearBooking } from "../../../lib/booking";

/*
 * Checkout page
 *
 * Presents a summary of the user’s stay including dates, selected
 * room, extras and computed pricing.  The user can confirm the
 * reservation which will create a record on the backend via the
 * GraphQL API.  Upon completion the booking data is cleared and
 * the user is returned to the hotel landing page with a success
 * notification.
 */

const GET_ROOM = gql`
  query GetRoom($id: ID!) {
    room(id: $id) {
      id
      type
      price
      images
    }
  }
`;

const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReservationInput!) {
    createReservation(input: $input) {
      id
      status
    }
  }
`;

export default function CheckoutPage() {
  const router = useRouter();
  const booking = typeof window !== "undefined" ? getBooking() : {};

  useEffect(() => {
    // Ensure required data exists
    if (!booking.checkIn || !booking.checkOut || !booking.roomId) {
      router.replace("/hotel/search");
    }
  }, [booking, router]);

  const { data, loading, error } = useQuery(GET_ROOM, {
    variables: { id: booking.roomId || "" },
    skip: !booking.roomId,
  });

  const [createReservation, { loading: creating }] = useMutation(CREATE_RESERVATION);

  // Compute nights and cost
  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const inDate = new Date(booking.checkIn);
    const outDate = new Date(booking.checkOut);
    const diff = outDate.getTime() - inDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [booking.checkIn, booking.checkOut]);
  const room = data?.room;
  const basePrice = room ? room.price * nights : 0;
  const extras = booking.extras || {};
  const extrasCost = (() => {
    let cost = 0;
    if (extras.breakfast) cost += 20 * nights;
    if (extras.parking) cost += 15 * nights;
    if (extras.champagne) cost += 50;
    return cost;
  })();
  const tax = nights * 10; // simple tax estimate (€10/night) to match mockup
  const total = basePrice + extrasCost + tax;

  const handleReserve = async () => {
    if (!room) return;
    try {
      await createReservation({
        variables: {
          input: {
            businessId: booking.hotelId,
            businessType: "hotel",
            customerInfo: {
              name: "Guest",
              email: "guest@example.com",
              phone: "0000000000",
            },
            roomId: booking.roomId,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            guests: booking.guests || booking.adults + booking.children || 1,
            date: booking.checkIn,
            totalAmount: total,
            status: "pending",
            paymentStatus: "pending",
            notes: Object.entries(extras)
              .filter(([k, v]) => v)
              .map(([k]) => k)
              .join(", "),
          },
        },
      });
      clearBooking();
      alert("Your reservation has been submitted!");
      router.push("/hotel");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to create reservation");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-gray-900">StayEase</span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Log in
          </a>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Réserver votre séjour
        </h1>
        {loading ? (
          <p>Loading…</p>
        ) : error || !room ? (
          <p className="text-red-600">Unable to load reservation.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Votre séjour</h2>
              <p className="mb-4">
                {nights} night{nights > 1 ? "s" : ""} <br />
                {new Date(booking.checkIn!).toLocaleDateString()} – {new Date(booking.checkOut!).toLocaleDateString()}
              </p>
              <h3 className="text-lg font-semibold mb-2">Chambre</h3>
              <p className="mb-4">
                {room.type} <br />
                {booking.guests || booking.adults + booking.children || 1} guest{(booking.guests || booking.adults + booking.children || 1) > 1 ? "s" : ""}
              </p>
              <h3 className="text-lg font-semibold mb-2">Options</h3>
              <ul className="list-disc list-inside mb-4 text-sm text-gray-700 space-y-1">
                {extras.breakfast && <li>Breakfast included</li>}
                {extras.parking && <li>Parking included</li>}
                {extras.champagne && <li>Champagne bottle</li>}
                {!extras.breakfast && !extras.parking && !extras.champagne && <li>No extras selected</li>}
              </ul>
              <h3 className="text-lg font-semibold mb-2">Prix</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex justify-between">
                  <span>Prix de base</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes et frais</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Prix total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-start">
              {room.images && room.images.length > 0 ? (
                <img
                  src={room.images[0]}
                  alt={room.type}
                  className="w-full h-auto object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg" />
              )}
            </div>
          </div>
        )}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleReserve}
            className="bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700"
            disabled={creating || !room}
          >
            {creating ? "Processing…" : "Réserver"}
          </button>
        </div>
      </main>
    </div>
  );
}