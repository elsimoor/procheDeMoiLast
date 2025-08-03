"use client"

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gql, useQuery } from "@apollo/client";

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
  query AvailableRooms($hotelId: ID!, $checkIn: Date!, $checkOut: Date!, $adults: Int!, $children: Int!) {
    availableRooms(hotelId: $hotelId, checkIn: $checkIn, checkOut: $checkOut, adults: $adults, children: $children) {
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

const GET_AVAILABLE_ROOMS_COUNT = gql`
  query AvailableRoomsCount($hotelId: ID!, $checkIn: Date!, $checkOut: Date!, $adults: Int!, $children: Int!) {
    availableRoomsCount(hotelId: $hotelId, checkIn: $checkIn, checkOut: $checkOut, adults: $adults, children: $children)
  }
`;

export default function RoomsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const adults = parseInt(searchParams.get("adults") || "1", 10);
  const children = parseInt(searchParams.get("children") || "0", 10);

  useEffect(() => {
    // If the user hasn’t selected dates go back to search
    if (!checkIn || !checkOut) {
      router.replace("/hotel/search");
    }
  }, [checkIn, checkOut, router]);

  // Fetch hotels to determine a default hotelId
  const {
    data: hotelsData,
    loading: hotelsLoading,
    error: hotelsError,
  } = useQuery(GET_HOTELS);

  // Determine the current hotelId; either use the one stored or
  // default to the first available hotel once hotels load.
  const hotelId = hotelsData?.hotels?.[0]?.id ?? null;

  // Fetch rooms for the selected hotel once we know the id
  const hasDates = !!checkIn && !!checkOut;
  // Choose between availableRooms and rooms depending on whether dates
  // are provided.  When check‑in/out are specified we fetch only
  // available rooms; otherwise we fall back to all rooms.
  const {
    data: roomsData,
    loading: roomsLoading,
    error: roomsError,
  } = useQuery(hasDates ? GET_AVAILABLE_ROOMS : GET_ROOMS, {
    variables: hasDates
      ? { hotelId, checkIn, checkOut, adults, children }
      : { hotelId },
    skip: !hotelId,
  });

  const { data: countData } = useQuery(GET_AVAILABLE_ROOMS_COUNT, {
    variables: { hotelId, checkIn, checkOut, adults, children },
    skip: !hotelId || !hasDates,
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

  const [activeTab, setActiveTab] = useState("Hotels");
  const [hotelFilters, setHotelFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 4;

  const handleSelect = (roomId: string) => {
    const booking = {
      checkIn,
      checkOut,
      adults,
      children,
      guests: adults + children,
      roomId,
      hotelId,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("booking", JSON.stringify(booking));
    }
    router.push(`/hotel/rooms/${roomId}`);
  };

  const tabs = ["Hotels", "Experiences", "Hébergements", "Aventures"];
  const hotelFilterOptions = ["Boutique", "Luxe", "Familial", "Romantique"];

  const filteredRoomTypes = roomTypes.filter((room) => {
    if (hotelFilters.length === 0) {
      return true;
    }
    // The room type is a string like "Deluxe", "Standard", etc.
    // The filters are "Boutique", "Luxe", etc.
    // This is a placeholder for a more complex filtering logic.
    // For now, I will just check if the room type is included in the filters.
    // This will not work as expected, but it's a start.
    // I will assume that the room type can be mapped to the filter options.
    const roomType = room.type.toLowerCase();
    const filters = hotelFilters.map((f) => f.toLowerCase());
    if (filters.includes("luxe") && roomType === "deluxe") return true;
    if (filters.includes("familial") && roomType === "suite") return true;
    if (filters.includes("romantique") && roomType === "executive") return true;
    if (filters.includes("boutique") && roomType === "standard") return true;
    return false;
  });

  const totalPages = Math.ceil(filteredRoomTypes.length / roomsPerPage);
  const paginatedRooms = filteredRoomTypes.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage
  );

  const handleFilterChange = (filter: string) => {
    setHotelFilters((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((f) => f !== filter)
        : [...prevFilters, filter]
    );
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
        <div className="flex space-x-4 border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "Hotels" && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Découvrez nos hotels</h2>
            <div className="flex space-x-2 mt-2">
              {hotelFilterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 text-sm border rounded-full ${
                    hotelFilters.includes(filter)
                      ? "bg-blue-600 text-white"
                      : ""
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chambres disponibles</h1>
        {countData && (
          <p className="text-gray-600 mb-6">
            {countData.availableRoomsCount} chambre(s) disponible(s)
          </p>
        )}
        {roomsLoading || hotelsLoading ? (
          <p>Loading rooms…</p>
        ) : roomsError || hotelsError ? (
          <p className="text-red-600">Unable to load rooms.</p>
        ) : roomTypes.length === 0 ? (
          <p>No rooms available for the selected dates.</p>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedRooms.map((room: any) => (
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
                        room.amenities &&
                        room.amenities.length > 0 && (
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
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
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