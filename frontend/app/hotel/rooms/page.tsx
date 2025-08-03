"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import { getBooking, updateBooking } from "../../../lib/booking";

/*
 * Rooms listing page
 *
 * Displays all available rooms for the selected hotel along with
 * basic information such as the type, amenities and price per
 * night.  The user can select a room which will persist the
 * selection in localStorage and navigate to the detail page to
 * configure add‑ons.  If no search criteria are stored the user
 * will be redirected back to the search page.
 */

// GraphQL queries for hotels and rooms
const GET_HOTELS = gql`
  query GetHotels {
    hotels {
      id
      name
    }
  }
`;

const GET_ROOMS = gql`
  query GetRooms($hotelId: ID!) {
    rooms(hotelId: $hotelId) {
      id
      number
      type
      price
      status
      amenities
      features
      images
      capacity
      description
    }
  }
`;

// Query for rooms that are available within a date range
const GET_AVAILABLE_ROOMS = gql`
  query AvailableRooms($hotelId: ID!, $checkIn: Date!, $checkOut: Date!) {
    availableRooms(hotelId: $hotelId, checkIn: $checkIn, checkOut: $checkOut) {
      id
      number
      type
      price
      status
      amenities
      features
      images
      capacity
      description
    }
  }
`;

export default function RoomsListPage() {
  const router = useRouter();
  // Load search criteria from storage
  const booking = typeof window !== "undefined" ? getBooking() : {};

  useEffect(() => {
    // If the user hasn’t selected dates go back to search
    if (!booking.checkIn || !booking.checkOut) {
      router.replace("/hotel/search");
    }
  }, [booking, router]);

  // Fetch hotels to determine a default hotelId
  const {
    data: hotelsData,
    loading: hotelsLoading,
    error: hotelsError,
  } = useQuery(GET_HOTELS);

  // Determine the current hotelId; either use the one stored or
  // default to the first available hotel once hotels load.  When a
  // default is chosen it is persisted to localStorage.
  const hotelId = booking.hotelId || (hotelsData?.hotels?.[0]?.id ?? null);

  useEffect(() => {
    if (!booking.hotelId && hotelId) {
      updateBooking({ hotelId });
    }
  }, [booking.hotelId, hotelId]);

  // Fetch rooms for the selected hotel once we know the id
  const hasDates = !!booking.checkIn && !!booking.checkOut;
  // Choose between availableRooms and rooms depending on whether dates
  // are provided.  When check‑in/out are specified we fetch only
  // available rooms; otherwise we fall back to all rooms.
  const {
    data: roomsData,
    loading: roomsLoading,
    error: roomsError,
  } = useQuery(hasDates ? GET_AVAILABLE_ROOMS : GET_ROOMS, {
    variables: hasDates
      ? { hotelId, checkIn: booking.checkIn, checkOut: booking.checkOut }
      : { hotelId },
    skip: !hotelId,
  });

  // Determine array of rooms from either the rooms or availableRooms fields
  const roomsArray: any[] = roomsData?.rooms
    ? roomsData.rooms
    : roomsData?.availableRooms
    ? roomsData.availableRooms
    : [];
  // Group rooms by type and select the first entry in each group.  We
  // intentionally ignore the status filter here because availableRooms
  // will already filter out unavailable rooms.  For the rooms query we
  // still filter to status "available".
  const grouped: { [type: string]: any } = {};
  roomsArray.forEach((room: any) => {
    if (!room) return;
    if (!roomsData?.availableRooms && room.status !== "available") return;
    if (!grouped[room.type]) {
      grouped[room.type] = {
        type: room.type,
        price: room.price,
        amenities: room.amenities,
        features: room.features,
        image: room.images?.[0] ?? null,
        roomId: room.id,
        description: room.description,
      };
    }
  });
  const roomTypes = Object.values(grouped);

  const handleSelect = (roomId: string) => {
    updateBooking({ roomId });
    router.push(`/hotel/rooms/${roomId}`);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Chambres disponibles</h1>
        {roomsLoading || hotelsLoading ? (
          <p>Loading rooms…</p>
        ) : roomsError || hotelsError ? (
          <p className="text-red-600">Unable to load rooms.</p>
        ) : roomTypes.length === 0 ? (
          <p>No rooms available for the selected dates.</p>
        ) : (
          <div className="space-y-6">
            {roomTypes.map((room: any) => (
              <div
                key={room.roomId}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelect(room.roomId)}
              >
                <div className="flex items-start space-x-4">
                  {room.image ? (
                    <img
                      src={room.image}
                      alt={room.type}
                      className="w-28 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-28 h-20 bg-gray-200 rounded"></div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {room.type}
                    </h3>
                    {room.features && room.features.length > 0 ? (
                      <p className="text-sm text-gray-600">
                        {room.features.slice(0, 3).join(", ")}
                      </p>
                    ) : (
                      room.amenities && room.amenities.length > 0 && (
                        <p className="text-sm text-gray-600">
                          {room.amenities.slice(0, 3).join(", ")}
                        </p>
                      )
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-gray-900">
                    {room.price}€/nuit
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => router.push("/hotel/search")}
            className="text-blue-600 hover:text-blue-500"
          >
            ← Modifier la recherche
          </button>
        </div>
      </main>
    </div>
  );
}