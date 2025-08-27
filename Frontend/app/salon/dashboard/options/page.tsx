"use client"

import { useState, useEffect, useMemo } from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
// Helpers to format prices according to the salon's selected currency
import { formatCurrency, currencySymbols } from "@/lib/currency"
import { Plus } from "lucide-react"

// Translation hook for multi‑language support
import useTranslation from "@/hooks/useTranslation"

interface ServiceOption {
  name: string
  price?: number
  durationImpact?: number
}

interface Service {
  id: string
  name: string
  options: ServiceOption[]
}

/**
 * Options management page.  Service options are embedded directly on
 * each service.  This page aggregates options across all services and
 * provides a simple form to add a new option to a chosen service, or
 * assign existing options to another service.  Editing or deleting
 * individual options is not currently supported.
 */
export default function SalonOptions() {
  // Translation helper
  const { t } = useTranslation()

  const [salonId, setSalonId] = useState<string | null>(null)
  const [businessType, setBusinessType] = useState<string | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  // Form state for creating a new option
  const [newOption, setNewOption] = useState<{ name: string; price: string; durationImpact: string }>({
    name: "",
    price: "",
    durationImpact: "",
  })
  const [selectedServiceForNew, setSelectedServiceForNew] = useState<string>("")

  // Form state for assigning options
  const [selectedServiceForAssign, setSelectedServiceForAssign] = useState<string>("")
  const [selectedOptionNames, setSelectedOptionNames] = useState<string[]>([])

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
          setBusinessType(data.businessType.toLowerCase())
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

  // GraphQL queries/mutations
  const GET_SERVICES = gql`
    query GetServices($businessId: ID!, $businessType: String!) {
      services(businessId: $businessId, businessType: $businessType) {
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
        options {
          name
          price
          durationImpact
        }
      }
    }
  `

  // Query to fetch only the salon's currency setting.  This is used to
  // dynamically format option prices and labels based on the selected
  // currency.
  const GET_SALON_SETTINGS = gql`
    query GetSalonSettings($id: ID!) {
      salon(id: $id) {
        settings {
          currency
        }
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

  const {
    data: servicesData,
    loading: servicesLoading,
    error: servicesError,
    refetch,
  } = useQuery(GET_SERVICES, {
    variables: { businessId: salonId, businessType },
    skip: !salonId || !businessType,
  })
  const [updateService] = useMutation(UPDATE_SERVICE, {
    onCompleted: () => refetch(),
  })

  const services: Service[] = servicesData?.services ?? []

  // Fetch the salon's currency setting.  Skip until salonId is available.
  const { data: settingsData } = useQuery(GET_SALON_SETTINGS, {
    variables: { id: salonId },
    skip: !salonId,
  })

  // Determine the currency and a friendly symbol.  Default to USD if
  // settings are unavailable.  Used when formatting prices and labels.
  const currency: string = settingsData?.salon?.settings?.currency || 'USD'
  const currencySymbol: string = currencySymbols[currency] ?? currency

  // Aggregate all unique options across services
  const allOptions: ServiceOption[] = useMemo(() => {
    const map: Record<string, ServiceOption> = {}
    services.forEach((svc) => {
      svc.options?.forEach((opt) => {
        if (!map[opt.name]) {
          map[opt.name] = opt
        }
      })
    })
    return Object.values(map)
  }, [services])

  const handleAddOption = async () => {
    if (!selectedServiceForNew || !newOption.name) {
      alert("Select a service and fill out the option name.")
      return
    }
    const svc = services.find((s) => s.id === selectedServiceForNew)
    if (!svc) return
    const options = svc.options ? [...svc.options] : []
    options.push({
      name: newOption.name,
      price: newOption.price ? parseFloat(newOption.price) : undefined,
      durationImpact: newOption.durationImpact ? parseInt(newOption.durationImpact) : undefined,
    })
    try {
      // Build a full input object by spreading existing service fields.  Many fields are required
      // by the ServiceInput GraphQL type (name, price, businessId, businessType, etc.), so we
      // ensure they are included.  Additional arrays like requirements are sent empty.
      const input: any = {
        businessId: salonId,
        businessType: businessType || "salon",
        name: svc.name,
        description: (svc as any).description || "",
        category: (svc as any).category || "other",
        duration: (svc as any).duration || 60,
        price: (svc as any).price || 0,
        available: (svc as any).available !== undefined ? (svc as any).available : true,
        popular: (svc as any).popular !== undefined ? (svc as any).popular : false,
        staffRequired: (svc as any).staffRequired || [],
        requirements: [],
        images: (svc as any).images || [],
        defaultEmployee: (svc as any).defaultEmployee || null,
        defaultRoom: (svc as any).defaultRoom || null,
        allowClientChoose: (svc as any).allowClientChoose ?? true,
        options,
      }
      await updateService({ variables: { id: svc.id, input } })
      setNewOption({ name: "", price: "", durationImpact: "" })
      setSelectedServiceForNew("")
    } catch (err) {
      console.error(err)
      alert("Failed to add option")
    }
  }

  const handleAssignOptions = async () => {
    if (!selectedServiceForAssign) {
      alert("Select a service to assign options to.")
      return
    }
    const svc = services.find((s) => s.id === selectedServiceForAssign)
    if (!svc) return
    // Build options from selected names.  Look up price/duration from allOptions.
    const options: ServiceOption[] = selectedOptionNames.map((name) => {
      const opt = allOptions.find((o) => o.name === name)
      return { name: name, price: opt?.price, durationImpact: opt?.durationImpact }
    })
    try {
      // Build full input similar to handleAddOption
      const input: any = {
        businessId: salonId,
        businessType: businessType || "salon",
        name: svc.name,
        description: (svc as any).description || "",
        category: (svc as any).category || "other",
        duration: (svc as any).duration || 60,
        price: (svc as any).price || 0,
        available: (svc as any).available !== undefined ? (svc as any).available : true,
        popular: (svc as any).popular !== undefined ? (svc as any).popular : false,
        staffRequired: (svc as any).staffRequired || [],
        requirements: [],
        images: (svc as any).images || [],
        defaultEmployee: (svc as any).defaultEmployee || null,
        defaultRoom: (svc as any).defaultRoom || null,
        allowClientChoose: (svc as any).allowClientChoose ?? true,
        options,
      }
      await updateService({ variables: { id: svc.id, input } })
      setSelectedOptionNames([])
      setSelectedServiceForAssign("")
    } catch (err) {
      console.error(err)
      alert("Failed to assign options")
    }
  }

  // Loading and error states
  if (sessionLoading || servicesLoading) {
    return <div className="p-6 text-gray-600">{t("loadingOptions")}</div>
  }
  if (sessionError) {
    return (
      <div className="text-red-500">
        {sessionError.includes('not associated') ? t('notAssociatedWithSalon') : t('failedToLoadSession')}
      </div>
    )
  }
  if (servicesError) {
    return <div className="text-red-500">{t("errorLoadingOptions")}</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("additionalOptions")}</h1>
      {/* Existing options table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t("existingOptions")}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("nameColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("priceColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("durationImpactColumn")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {allOptions.length === 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-500" colSpan={3}>
                    {t("noOptionsDefined")}
                  </td>
                </tr>
              )}
              {allOptions.map((opt) => (
                <tr key={opt.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{opt.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opt.price != null ? formatCurrency(opt.price, currency) : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {opt.durationImpact != null ? `+${opt.durationImpact} min` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add new option */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{t("addNewOption")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("optionName")}</label>
            <input
              type="text"
              value={newOption.name}
              onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{`${t("priceFieldLabel")} (${currencySymbol})`}</label>
            <input
              type="number"
              value={newOption.price}
              onChange={(e) => setNewOption({ ...newOption, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("durationImpactMinutes")}</label>
            <input
              type="number"
              value={newOption.durationImpact}
              onChange={(e) => setNewOption({ ...newOption, durationImpact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("addToService")}</label>
            <select
              value={selectedServiceForNew}
              onChange={(e) => setSelectedServiceForNew(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">{t("selectService")}</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddOption}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              <Plus className="h-4 w-4 mr-2" /> {t("addOptionButton")}
            </button>
          </div>
        </div>
      </div>

      {/* Assign options to a service */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{t("optionsToServices")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("serviceFieldLabel")}</label>
            <select
              value={selectedServiceForAssign}
              onChange={(e) => setSelectedServiceForAssign(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">{t("selectService")}</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("availableOptions")}</label>
            <select
              multiple
              value={selectedOptionNames}
              onChange={(e) => {
                const opts = Array.from(e.target.selectedOptions).map((o) => o.value)
                setSelectedOptionNames(opts)
              }}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {allOptions.map((opt) => (
                <option key={opt.name} value={opt.name}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAssignOptions}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            {t("associateOptions")}
          </button>
        </div>
      </div>
    </div>
  )
}