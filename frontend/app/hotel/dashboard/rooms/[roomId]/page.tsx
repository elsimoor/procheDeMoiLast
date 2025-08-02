"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { gql, useQuery, useMutation } from "@apollo/client";
// Import Firebase helpers for image upload and deletion
import { uploadImage, deleteImage } from "../../../../lib/firebase";
import { ArrowLeft, X } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";

/**
 * Detailed room management page.  This page fetches a single room by
 * filtering the list of rooms for the current hotel.  It displays
 * editable fields such as type, capacity, status and amenities, and
 * allows the operator to update the room via the updateRoom mutation.
 */

const GET_ROOMS = gql`
  query GetRooms($hotelId: ID!) {
    rooms(hotelId: $hotelId) {
      id
      number
      type
      floor
      capacity
      price
      status
      amenities
      images
      bedType
      numberOfBeds
      numberOfBathrooms
      description
    }
  }
`;

const UPDATE_ROOM = gql`
  mutation UpdateRoom($id: ID!, $input: RoomInput!) {
    updateRoom(id: $id, input: $input) {
      id
    }
  }
`;

export default function HotelRoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  // Session derived hotelId
  const [hotelId, setHotelId] = useState<string | null>(null);
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
        if (data.businessType && data.businessType.toLowerCase() === "hotel" && data.businessId) {
          setHotelId(data.businessId);
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

  // Query all rooms and filter out the one we want.  We skip the query
  // if the hotelId is not available.  In a real backend we would
  // ideally have a dedicated room(id) query.
  const { data: roomsData, loading: roomsLoading, error: roomsError } = useQuery(GET_ROOMS, {
    variables: { hotelId },
    skip: !hotelId,
  });

  const [updateRoom] = useMutation(UPDATE_ROOM);

  // Upload all selected files to Firebase and append their URLs to the
  // images array in the form state.  Clears the selected files once
  // complete.  Errors are logged to the console.
  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const url = await uploadImage(file);
        urls.push(url);
      }
      setFormState((prev) => ({ ...prev, images: [...(prev.images as string[]), ...urls] }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Delete an image both from Firebase and the local form state.  We
  // confirm with the user before deletion.
  const handleDeleteImage = async (url: string) => {
    if (!confirm("Remove this image?")) return;
    try {
      await deleteImage(url);
      setFormState((prev) => ({
        ...prev,
        images: (prev.images as string[]).filter((img) => img !== url),
      }));
    } catch (err) {
      console.error(err);
    }
  };
  // Local state for file uploads
  const [uploading, setUploading] = useState(false);

  // Local state for the room form.  We populate this once we find the
  // room in roomsData.  It includes additional descriptive fields and
  // stores images as an array of strings rather than a comma‑separated
  // string.  This makes it easier to manage image uploads.
  const [formState, setFormState] = useState({
    id: "",
    number: "",
    type: "Standard",
    floor: "" as string | number,
    capacity: "" as string | number,
    price: "" as string | number,
    status: "available",
    amenities: [] as string[],
    images: [] as string[],
    bedType: [] as string[],
    numberOfBeds: "" as string | number,
    numberOfBathrooms: "" as string | number,
    description: "",
  });

  useEffect(() => {
    if (roomsData && roomsData.rooms) {
      const room = roomsData.rooms.find((r: any) => r.id === roomId);
      if (room) {
        setFormState({
          id: room.id,
          number: room.number || "",
          type: room.type || "Standard",
          floor: room.floor ?? "",
          capacity: room.capacity ?? "",
          price: room.price ?? "",
          status: room.status || "available",
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          images: Array.isArray(room.images) ? room.images : [],
          bedType: Array.isArray(room.bedType) ? room.bedType : [],
          numberOfBeds: room.numberOfBeds ?? "",
          numberOfBathrooms: room.numberOfBathrooms ?? "",
          description: room.description || "",
        });
      }
    }
  }, [roomsData, roomId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.id) return;
    const input: any = {
      hotelId,
      number: formState.number,
      type: formState.type,
      floor: formState.floor !== "" ? Number(formState.floor) : undefined,
      capacity: formState.capacity !== "" ? Number(formState.capacity) : undefined,
      // Price is required by the backend; default to 0 when empty
      price: formState.price !== "" ? Number(formState.price) : 0,
      status: formState.status,
      images: formState.images,
      numberOfBeds: formState.numberOfBeds !== "" ? Number(formState.numberOfBeds) : undefined,
      numberOfBathrooms: formState.numberOfBathrooms !== "" ? Number(formState.numberOfBathrooms) : undefined,
      description: formState.description || undefined,
    };
    try {
      await updateRoom({ variables: { id: formState.id, input } });
      alert("Room updated successfully!");
      router.push("/hotel/dashboard/rooms");
    } catch (err) {
      console.error(err);
      alert("Failed to update room.");
    }
  };

  if (sessionLoading || roomsLoading) {
    return <div className="p-6">Loading...</div>;
  }
  if (sessionError) {
    return <div className="p-6 text-red-600">{sessionError}</div>;
  }
  if (roomsError) {
    return <div className="p-6 text-red-600">Failed to load room data.</div>;
  }
  // If the room could not be found, show a message
  if (!formState.id) {
    return <div className="p-6 text-red-600">Room not found.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Room {formState.number}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column for room details form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  value={formState.number}
                  onChange={(e) => setFormState({ ...formState, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  value={formState.type}
                  onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                <input
                  type="number"
                  value={formState.floor}
                  onChange={(e) => setFormState({ ...formState, floor: e.target.value === "" ? "" : Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formState.capacity}
                  onChange={(e) => setFormState({ ...formState, capacity: e.target.value === "" ? "" : Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={formState.price}
                  onChange={(e) => setFormState({ ...formState, price: e.target.value === "" ? "" : Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Beds</label>
                <input
                  type="number"
                  value={formState.numberOfBeds}
                  onChange={(e) => setFormState({ ...formState, numberOfBeds: e.target.value === "" ? "" : Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Bathrooms</label>
                <input
                  type="number"
                  value={formState.numberOfBathrooms}
                  onChange={(e) => setFormState({ ...formState, numberOfBathrooms: e.target.value === "" ? "" : Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formState.description}
                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Right column for photos and other info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Room Photos</h3>
            {Array.isArray(formState.images) && formState.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {(formState.images as string[]).map((img) => (
                  <div key={img} className="relative group">
                    <img
                      src={img}
                      alt="Room"
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img)}
                      className="absolute top-1 right-1 bg-white bg-opacity-75 rounded-full p-1 hover:bg-opacity-100"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <ImageUpload onUpload={handleUpload} uploading={uploading} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {(formState.amenities as string[]).map((amenity) => (
                <span key={amenity} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bed Types</h3>
            <div className="flex flex-wrap gap-2">
              {(formState.bedType as string[]).map((bt) => (
                <span key={bt} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                  {bt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}