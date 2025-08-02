"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
// Use an alias for the Calendar icon to avoid confusion with our calendar input
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Sparkles } from "lucide-react";
import { gql, useQuery, useMutation } from "@apollo/client";

export default function SalonBookingPage() {
  // Local form state holds input fields for creating an appointment.
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    serviceId: "",
    staffId: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  // Track which add‑on options the user has selected for the chosen service.
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  // Determine which salon to use for the appointment.  We fetch the
  // list of active salons and choose the first one.  This removes
  // the need for a logged‑in session on the front end.
  const [salonId, setSalonId] = useState<string | null>(null);

  const GET_SALONS = gql`
    query GetSalons {
      salons {
        id
        name
      }
    }
  `;
  const { data: salonsData, loading: salonsLoading, error: salonsError } = useQuery(GET_SALONS);

  useEffect(() => {
    if (!salonsLoading && salonsData?.salons && salonsData.salons.length > 0 && !salonId) {
      setSalonId(salonsData.salons[0].id);
    }
  }, [salonsLoading, salonsData, salonId]);

  // GraphQL queries to retrieve available services and staff for the
  // current salon.  These lists populate the form dropdowns.
  const GET_SERVICES = gql`
    query GetServices($businessId: ID!, $businessType: String!) {
      services(businessId: $businessId, businessType: $businessType) {
        id
        name
        description
        duration
        price
        category
        defaultEmployee
        defaultRoom
        allowClientChoose
        options {
          name
          price
          durationImpact
        }
      }
    }
  `
  const GET_STAFF = gql`
    query GetStaff($businessId: ID!, $businessType: String!) {
      staff(businessId: $businessId, businessType: $businessType) {
        id
        name
        role
      }
    }
  `

  // Fetch reservations to determine which time slots are unavailable on a given date.  We request only
  // id, date and time to minimise payload.  This will be used to mark time slots as reserved in the UI.
  const GET_RESERVATIONS = gql`
    query GetReservations($businessId: ID!, $businessType: String!) {
      reservations(businessId: $businessId, businessType: $businessType) {
        id
        date
        time
        status
      }
    }
  `
  const CREATE_RESERVATION = gql`
    mutation CreateReservation($input: ReservationInput!) {
      createReservation(input: $input) {
        id
        status
      }
    }
  `

  const { data: servicesData } = useQuery(GET_SERVICES, {
    variables: { businessId: salonId, businessType: "salon" },
    skip: !salonId,
  });
  const { data: staffData } = useQuery(GET_STAFF, {
    variables: { businessId: salonId, businessType: "salon" },
    skip: !salonId,
  });
  const { data: reservationsData } = useQuery(GET_RESERVATIONS, {
    variables: { businessId: salonId, businessType: "salon" },
    skip: !salonId,
  });
  const [createReservation] = useMutation(CREATE_RESERVATION)

  // Extract services and staff lists from GraphQL results.  Fallback to
  // empty arrays if the queries haven't loaded yet.
  const services = servicesData?.services ?? []
  const stylists = staffData?.staff ?? []

  // Compute reserved times for the selected date.  We recalculate only when
  // reservations or the selected date changes.  We compare the ISO
  // formatted date strings (YYYY-MM-DD) to avoid time zone issues.
  const reservedTimes = useMemo(() => {
    if (!reservationsData?.reservations) return []
    return reservationsData.reservations
      .filter((r: any) => r.date.slice(0, 10) === bookingData.date)
      .map((r: any) => r.time)
  }, [reservationsData, bookingData.date])

  // Static list of 30‑minute time slots for demonstration.  In a real
  // application this could be derived from staff availability and
  // service duration.
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure a salon has been selected.  If none is available then we
    // cannot proceed with the booking.
    if (!salonId) {
      alert("Booking failed: no salon available.");
      return;
    }
    try {
      // Compose the notes field by appending selected options (if any) to
      // the user‑entered notes.  This allows staff to see what add‑ons
      // the client chose without modifying the GraphQL schema for
      // reservations.
      const optionNotes = selectedOptions.length > 0 ? `Options: ${selectedOptions.join(", ")}` : ""
      const combinedNotes = [bookingData.notes, optionNotes].filter(Boolean).join(" | ") || undefined
      const input: any = {
        businessId: salonId,
        businessType: "salon",
        customerInfo: {
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
        },
        date: bookingData.date,
        time: bookingData.time,
        serviceId: bookingData.serviceId || null,
        staffId: bookingData.staffId || null,
        status: "pending",
        notes: combinedNotes,
        source: "website",
      }
      await createReservation({ variables: { input } })
      setBookingData({
        date: "",
        time: "",
        serviceId: "",
        staffId: "",
        name: "",
        email: "",
        phone: "",
        notes: "",
      })
      setSelectedOptions([])
      alert("Appointment request submitted successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to submit appointment. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setBookingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // When the selected service changes, reset the selected options.  This
  // prevents options from a previous service being applied to a newly
  // selected service.
  useEffect(() => {
    setSelectedOptions([])
  }, [bookingData.serviceId])

  // Determine the selected service details for display under the form.
  const selectedService = services.find((s: any) => s.id === bookingData.serviceId)

  // Build a map of selected option objects based on the current service.
  const selectedOptionObjects = useMemo(() => {
    if (!selectedService?.options) return []
    return selectedService.options.filter((opt: any) => selectedOptions.includes(opt.name))
  }, [selectedService, selectedOptions])

  // Calculate total price including add‑ons.  If a selected option has no
  // price defined then it contributes zero to the total.
  const totalPrice = useMemo(() => {
    const base = selectedService?.price ?? 0
    const optionsTotal = selectedOptionObjects.reduce((sum: number, opt: any) => sum + (opt.price || 0), 0)
    return base + optionsTotal
  }, [selectedService, selectedOptionObjects])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Title */}
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planifiez votre rendez‑vous</h1>
        <p className="text-gray-600">Choisissez la date et l'heure, sélectionnez votre service et confirmez en un clic.</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Date & Time Selection */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Date picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={bookingData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          {/* Time slots table */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {timeSlots.map((slot) => {
                  const isReserved = reservedTimes.includes(slot)
                  const isSelected = bookingData.time === slot
                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isReserved}
                      onClick={() => {
                        if (!isReserved) {
                          setBookingData((prev) => ({ ...prev, time: slot }))
                        }
                      }}
                      className={`w-full flex justify-between items-center px-4 py-3 text-sm ${
                        isReserved
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-pink-50 text-pink-700"
                          : "bg-white hover:bg-pink-50"
                      }`}
                    >
                      <span>{slot}</span>
                      <span className={`text-xs font-medium ${isReserved ? "text-gray-400" : "text-green-600"}`}>
                        {isReserved ? "Réservé" : "Disponible"}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Details and Confirmation */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionnez un service</label>
            <select
              name="serviceId"
              value={bookingData.serviceId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            >
              <option value="">Choisissez un service</option>
              {services.map((service: any) => (
                <option key={service.id} value={service.id}>
                  {service.name} – ${service.price}
                </option>
              ))}
            </select>
          </div>

          {/* Stylist Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choisissez un styliste</label>
            <select
              name="staffId"
              value={bookingData.staffId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            >
              <option value="">Choisissez un styliste</option>
              {stylists.map((stylist: any) => (
                <option key={stylist.id} value={stylist.id}>
                  {stylist.name} {stylist.role ? `– ${stylist.role}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Service Options */}
          {selectedService?.options && selectedService.options.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <h3 className="text-md font-medium text-gray-900">Options supplémentaires</h3>
              {selectedService.options.map((opt: any) => {
                const checked = selectedOptions.includes(opt.name)
                return (
                  <label
                    key={opt.name}
                    className="flex items-center justify-between text-sm font-medium text-gray-700 py-1"
                  >
                    <span className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        checked={checked}
                        onChange={() => {
                          setSelectedOptions((prev) => {
                            if (prev.includes(opt.name)) {
                              return prev.filter((n) => n !== opt.name)
                            } else {
                              return [...prev, opt.name]
                            }
                          })
                        }}
                      />
                      <span>{opt.name}</span>
                    </span>
                    <span className="text-gray-500">
                      {opt.price ? `+${opt.price.toFixed(2)}$` : "Gratuit"}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Contact Information */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-md font-medium text-gray-900">Informations de contact</h3>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Nom complet"
                value={bookingData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={bookingData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Numéro de téléphone"
                value={bookingData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <textarea
                name="notes"
                value={bookingData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Notes ou demandes spéciales (facultatif)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Summary */}
          {selectedService && bookingData.time && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="text-md font-semibold text-gray-900">Récapitulatif</h4>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Service</span>
                <span>{selectedService.name}</span>
              </div>
              {/* Show options if any are selected */}
              {selectedOptionObjects.length > 0 && (
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Options</span>
                  <span>{selectedOptionObjects.map((o: any) => o.name).join(", ")}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-700">
                <span>Durée</span>
                <span>
                  {selectedService.duration || 0}
                  {selectedOptionObjects.reduce(
                    (sum: number, opt: any) => sum + (opt.durationImpact || 0),
                    0
                  ) > 0
                    ? ` + ${selectedOptionObjects.reduce((sum: number, opt: any) => sum + (opt.durationImpact || 0), 0)} min`
                    : ""}
                  min
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Prix total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Date</span>
                <span>{bookingData.date}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Heure</span>
                <span>{bookingData.time}</span>
              </div>
            </div>
          )}

          {/* Confirm Button */}
          <button
            type="button"
            onClick={async () => {
              if (!bookingData.date || !bookingData.time || !bookingData.serviceId || !bookingData.staffId) {
                alert("Veuillez sélectionner la date, l'heure, le service et le styliste.")
                return
              }
              await handleSubmit({ preventDefault: () => {} } as any)
            }}
            className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            Confirmer le rendez‑vous
          </button>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center mt-8">
        <Link href="/" className="text-pink-600 hover:text-pink-500 font-medium">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
