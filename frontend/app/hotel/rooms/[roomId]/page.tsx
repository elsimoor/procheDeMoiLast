"use client"

import { useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { getBooking, updateBooking } from "../../../../lib/booking";
import { useState, useEffect, useMemo } from "react";

/*
 * Room detail page
 *
 * Displays detailed information about the selected room along with
 * available add‑on options (breakfast, parking and champagne).  The
 * user can review the room images, description and amenities and
 * choose extras which will adjust the price summary.  When the
 * booking is added to the cart the selection is persisted and
 * the user is taken to the checkout page.
 */

// Query a single room by id
const GET_ROOM = gql`
  query GetRoom($id: ID!) {
    room(id: $id) {
      id
      type
      price
      images
      amenities
      features
      description
    }
  }
`;

interface Extras {
  breakfast: boolean;
  parking: boolean;
  champagne: boolean;
}

export default function RoomDetailPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const roomId = params.roomId;

  // Load existing booking; if missing necessary details redirect
  const booking = typeof window !== "undefined" ? getBooking() : {};
  useEffect(() => {
    if (!booking.checkIn || !booking.checkOut) {
      router.replace("/hotel/search");
    }
    // ensure roomId persists on reload
    updateBooking({ roomId });
  }, [booking, router, roomId]);

  const { data, loading, error } = useQuery(GET_ROOM, {
    variables: { id: roomId },
  });

  // Determine number of nights from booking
  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const inDate = new Date(booking.checkIn);
    const outDate = new Date(booking.checkOut);
    const diff = outDate.getTime() - inDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [booking.checkIn, booking.checkOut]);

  // Manage extras state
  const [extras, setExtras] = useState<Extras>({
    breakfast: false,
    parking: false,
    champagne: false,
  });

  // When extras change, recompute total cost and persist extras to booking
  const extrasCost = useMemo(() => {
    let cost = 0;
    if (extras.breakfast) cost += 20 * nights;
    if (extras.parking) cost += 15 * nights;
    if (extras.champagne) cost += 50;
    return cost;
  }, [extras, nights]);

  const room = data?.room;
  const basePrice = room ? room.price * nights : 0;
  const total = basePrice + extrasCost;

  const toggleExtra = (key: keyof Extras) => {
    setExtras((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    // Persist extras and total price
    updateBooking({ extras, total });
    router.push("/hotel/checkout");
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <p>Loading room…</p>
        ) : error || !room ? (
          <p className="text-red-600">Unable to load room details.</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {room.type}
            </h1>
            {/* Image grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {room.images && room.images.length > 0 ? (
                room.images.slice(0, 4).map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${room.type} image ${idx + 1}`}
                    className={
                      idx === 0
                        ? "col-span-2 row-span-2 w-full h-64 object-cover rounded-lg"
                        : "w-full h-32 object-cover rounded-lg"
                    }
                  />
                ))
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
              )}
            </div>
            {/* Description */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                About this stay
              </h2>
              <p className="text-gray-700">
                {room.description ||
                  "A comfortable and well equipped room to make your stay memorable."}
              </p>
            </section>
            {/* Amenities */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ce que cet espace offre
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {room.amenities && room.amenities.length > 0
                  ? room.amenities.map((a: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 border border-gray-200 rounded-md px-3 py-2 text-sm"
                      >
                        <span>{a}</span>
                      </div>
                    ))
                  : room.features &&
                    room.features.map((f: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 border border-gray-200 rounded-md px-3 py-2 text-sm"
                      >
                        <span>{f}</span>
                      </div>
                    ))}
              </div>
            </section>
            {/* Extras */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Add‑ons
              </h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extras.breakfast}
                    onChange={() => toggleExtra("breakfast")}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-800">Breakfast (+$20/day)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extras.parking}
                    onChange={() => toggleExtra("parking")}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-800">Parking (+$15/day)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extras.champagne}
                    onChange={() => toggleExtra("champagne")}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-800">Champagne Bottle (+$50)</span>
                </label>
              </div>
            </section>
            {/* Price summary */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Price summary
              </h2>
              <div className="border border-gray-200 rounded-lg p-4 divide-y divide-gray-200 text-sm">
                <div className="flex justify-between py-2">
                  <span>
                    Base price ({nights} night{nights > 1 ? "s" : ""})
                  </span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {extras.breakfast && (
                  <div className="flex justify-between py-2">
                    <span>Breakfast</span>
                    <span>${(20 * nights).toFixed(2)}</span>
                  </div>
                )}
                {extras.parking && (
                  <div className="flex justify-between py-2">
                    <span>Parking</span>
                    <span>${(15 * nights).toFixed(2)}</span>
                  </div>
                )}
                {extras.champagne && (
                  <div className="flex justify-between py-2">
                    <span>Champagne</span>
                    <span>$50.00</span>
                  </div>
                )}
                <div className="flex justify-between py-2 font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </section>
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-blue-600 text-white rounded-full px-6 py-3 font-medium hover:bg-blue-700"
            >
              Add to cart
            </button>
          </>
        )}
      </main>
    </div>
  );
}