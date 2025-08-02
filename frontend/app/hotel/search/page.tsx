"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

/*
 * Hotel reservation search page
 *
 * This page allows the user to pick a check‑in and check‑out date
 * as well as the number of adults and children before searching
 * for available rooms.  The UI loosely follows the provided
 * mockups with a large hero image and simple inputs.  Once the
 * search criteria are selected the data is persisted into
 * localStorage and the user is redirected to the rooms listing
 * page where they can choose a specific room type.
 */
export default function HotelSearchPage() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // When the component mounts, attempt to prefill the form from
  // existing booking data if present.  This makes it easy to
  // navigate back and forth between steps without losing state.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("booking");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.checkIn) setCheckIn(parsed.checkIn);
          if (parsed.checkOut) setCheckOut(parsed.checkOut);
          if (parsed.adults) setAdults(parsed.adults);
          if (parsed.children !== undefined) setChildren(parsed.children);
        } catch (e) {
          // ignore invalid storage
        }
      }
    }
  }, []);

  // Persist the current search data and navigate to the rooms list
  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check‑in and check‑out dates");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check‑out date must be after check‑in date");
      return;
    }
    const booking = {
      checkIn,
      checkOut,
      adults,
      children,
      guests: adults + children,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("booking", JSON.stringify(booking));
    }
    router.push("/hotel/rooms");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-gray-900">StayEase</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-blue-600">
            Explore
          </a>
          <a href="#" className="hover:text-blue-600">
            Wishlists
          </a>
          <a href="#" className="hover:text-blue-600">
            Trips
          </a>
          <a href="#" className="hover:text-blue-600">
            Messages
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Log in
          </a>
        </div>
      </header>

      {/* Hero image */}
      <div className="relative w-full h-96 overflow-hidden">
        {/* Hero image as background */}
        <img
          src="/searchHotelImage.png"
          alt="Hotel room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
        {/* Centered content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold text-center drop-shadow-lg">
        Find Your Perfect Stay
          </h1>
          <p className="text-white text-lg md:text-xl text-center mt-4 drop-shadow-md">
        Book your next hotel stay with ease
          </p>
        </div>
      </div>

      {/* Search panel */}
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            type="button"
            className="flex-1 border border-gray-300 rounded-full py-3 px-4 text-gray-700 text-center hover:bg-gray-50"
            onClick={() => {
              // Focus the adults select when clicked
              const el = document.getElementById("adults-select");
              if (el) el.focus();
            }}
          >
            Adults: {adults}
          </button>
          <button
            type="button"
            className="flex-1 border border-gray-300 rounded-full py-3 px-4 text-gray-700 text-center hover:bg-gray-50"
            onClick={() => {
              const el = document.getElementById("children-select");
              if (el) el.focus();
            }}
          >
            Children: {children}
          </button>
        </div>
        {/* Hidden selects for adults/children */}
        <select
          id="adults-select"
          value={adults}
          onChange={(e) => setAdults(parseInt(e.target.value))}
          className="hidden"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          id="children-select"
          value={children}
          onChange={(e) => setChildren(parseInt(e.target.value))}
          className="hidden"
        >
          {Array.from({ length: 6 }, (_, i) => i).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check‑in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check‑out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSearch}
            className="bg-blue-600 text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}