'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'

import 'leaflet/dist/leaflet.css'
import type * as LType from 'leaflet'

interface LocationPoint {
  id: string
  name: string
  address: string
  city: string
  lat: number
  lng: number
  accepted: string[]
  contact: string
  email: string
  hours: string
  distance: string
  transitTime: string
  co2SavedKg: number
}

const LOCATIONS: LocationPoint[] = [
  {
    id: 'hmr',
    name: 'HMR Pioneer E-Waste Hub',
    address: 'HMR Superstore, Pioneer St., Mandaluyong City',
    city: 'Mandaluyong',
    lat: 14.5739,
    lng: 121.0485,
    accepted: ['Computers', 'CRT Monitors', 'TV Screens', 'Batteries', 'Large Appliances'],
    contact: '+63286340556',
    email: 'info@hmr.com.ph',
    hours: '9:00 AM - 8:00 PM (Daily)',
    distance: '4.8 km',
    transitTime: '15 mins',
    co2SavedKg: 145
  },
  {
    id: 'globe',
    name: 'Globe Project 1-E-Waste',
    address: 'The Globe Tower, 32nd St., BGC, Taguig',
    city: 'Taguig',
    lat: 14.5524,
    lng: 121.0504,
    accepted: ['Mobile Phones', 'Tablets', 'Chargers', 'Headsets', 'Batteries'],
    contact: '+63277302000',
    email: 'globeofgood@globe.com.ph',
    hours: '9:00 AM - 6:00 PM (Mon-Fri)',
    distance: '6.2 km',
    transitTime: '22 mins',
    co2SavedKg: 58
  },
  {
    id: 'sm-mega',
    name: 'SM Cares E-Waste Bin',
    address: 'SM Megamall Cyberzone, EDSA, Mandaluyong City',
    city: 'Mandaluyong',
    lat: 14.5843,
    lng: 121.0568,
    accepted: ['Mobile Phones', 'Tablets', 'Chargers', 'Cables', 'Small Gadgets'],
    contact: '+63288332888',
    email: 'smcares@smsupermalls.com',
    hours: '10:00 AM - 9:00 PM (Daily)',
    distance: '5.1 km',
    transitTime: '18 mins',
    co2SavedKg: 35
  },
  {
    id: 'vireo',
    name: 'Vireo Life E-Waste Management',
    address: '15 G. Araneta Avenue, Quezon City',
    city: 'Quezon City',
    lat: 14.6142,
    lng: 121.0115,
    accepted: ['Computers', 'Laptops', 'Mobile Phones', 'Batteries', 'Power Cables'],
    contact: '+639178439588',
    email: 'contact@vireolife.com',
    hours: '8:00 AM - 5:00 PM (Mon-Sat)',
    distance: '3.5 km',
    transitTime: '12 mins',
    co2SavedKg: 110
  },
  {
    id: 'zenith',
    name: 'Zenith Allmart Recyclers',
    address: '42 Karuhatan St., Valenzuela City',
    city: 'Valenzuela',
    lat: 14.6853,
    lng: 120.9782,
    accepted: ['Lead-Acid Batteries', 'Circuit Boards', 'Industrial E-Waste'],
    contact: '+63282921234',
    email: 'recycle@zenithallmart.com',
    hours: '8:00 AM - 5:00 PM (Mon-Fri)',
    distance: '12.4 km',
    transitTime: '35 mins',
    co2SavedKg: 340
  },
  {
    id: 'envirocycle',
    name: 'Envirocycle Laguna Drop-Off',
    address: 'Block 2 Lot 3, Greenfield Park, Biñan, Laguna',
    city: 'Laguna (Servicing NCR)',
    lat: 14.3015,
    lng: 121.0873,
    accepted: ['IT Equipment', 'Computers', 'Printers', 'Servers', 'CRT Monitors'],
    contact: '+63495412188',
    email: 'service@envirocycle.com.ph',
    hours: '8:00 AM - 5:00 PM (Mon-Fri)',
    distance: '38.5 km',
    transitTime: '55 mins',
    co2SavedKg: 420
  }
]

const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const recyclerIcon = (L: typeof import('leaflet'), isSelected: boolean) =>
  L.divIcon({
    className: `custom-recycler-marker-${isSelected ? 'active' : 'inactive'}`,
    html: `
    <div class="relative w-8 h-8 flex items-center justify-center">
      <span class="absolute w-8 h-8 rounded-full bg-[#A78BFA] ${
        isSelected ? 'opacity-40 animate-ping' : 'opacity-0'
      }"></span>
      <span class="relative w-4.5 h-4.5 rounded-full bg-[#A78BFA] border-2 border-[#080C10] shadow-lg flex items-center justify-center">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#080C10" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </span>
    </div>
  `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })

const Locator: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<LType.Map | null>(null)
  const routeLineRef = useRef<LType.Polyline | null>(null)
  const markersRef = useRef<{ [id: string]: LType.Marker }>({})
  const userMarkerRef = useRef<LType.Marker | null>(null)
  const LRef = useRef<typeof import('leaflet') | null>(null)

  const [mounted, setMounted] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number]>([14.5995, 120.9842]) // Default Ermita, Manila Central
  const [selectedLoc, setSelectedLoc] = useState<LocationPoint | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([])
  const [realDistance, setRealDistance] = useState<string>('')
  const [realTransitTime, setRealTransitTime] = useState<string>('')

  // Calculate actual distances from userLocation dynamically
  const computedLocations = useMemo(() => {
    return LOCATIONS.map(loc => {
      const distKm = getHaversineDistance(userLocation[0], userLocation[1], loc.lat, loc.lng)
      // Estimate transit time: roughly 2.2 mins per km in Manila + 5 mins baseline
      const transitMin = Math.round(distKm * 2.2 + 5)

      return {
        ...loc,
        distance: `${distKm.toFixed(1)} km`,
        transitTime:
          transitMin > 60
            ? `${Math.floor(transitMin / 60)} hr ${transitMin % 60} mins`
            : `${transitMin} mins`
      }
    })
  }, [userLocation])

  const filteredLocations = useMemo(() => {
    return computedLocations.filter(loc => {
      const matchesSearch =
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false
      if (activeCategory === 'All') return true

      if (activeCategory === 'Mobile') {
        return loc.accepted.some(item =>
          ['Mobile Phones', 'Tablets', 'Chargers', 'Cables', 'Small Gadgets'].includes(item)
        )
      }
      if (activeCategory === 'Computers') {
        return loc.accepted.some(item =>
          ['Computers', 'Laptops', 'IT Equipment', 'Printers', 'Servers'].includes(item)
        )
      }
      if (activeCategory === 'Batteries') {
        return loc.accepted.some(item => ['Batteries', 'Lead-Acid Batteries'].includes(item))
      }
      if (activeCategory === 'Screens') {
        return loc.accepted.some(item => ['CRT Monitors', 'TV Screens'].includes(item))
      }
      return true
    })
  }, [computedLocations, searchQuery, activeCategory])

  // Get user geolocation on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        error => {
          console.warn('Geolocation blocked or not available:', error.message)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }
  }, [])

  // Set default selection if none is active or current is filtered out
  useEffect(() => {
    if (filteredLocations.length > 0) {
      if (!selectedLoc || !filteredLocations.some(l => l.id === selectedLoc.id)) {
        setSelectedLoc(filteredLocations[0])
      }
    } else {
      setSelectedLoc(null)
    }
  }, [filteredLocations, selectedLoc])

  // Fetch routing geometry from OSRM for dynamic directions
  useEffect(() => {
    if (!selectedLoc) {
      setRouteCoordinates([])
      setRealDistance('')
      setRealTransitTime('')
      return
    }

    const fetchRoute = async () => {
      const startLat = userLocation[0]
      const startLng = userLocation[1]
      const endLat = selectedLoc.lat
      const endLng = selectedLoc.lng

      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
        )
        const data = await res.json()

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          const coords = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng] as [number, number])
          setRouteCoordinates(coords)

          const distKm = route.legs[0].distance / 1000
          setRealDistance(`${distKm.toFixed(1)} km`)

          const durationMin = Math.round(route.legs[0].duration / 60)
          setRealTransitTime(
            durationMin > 60
              ? `${Math.floor(durationMin / 60)} hr ${durationMin % 60} mins`
              : `${durationMin} mins`
          )
        } else {
          throw new Error('OSRM route failed')
        }
      } catch (err) {
        console.warn('Using straight line fallback for routing:', err)
        setRouteCoordinates([userLocation, [endLat, endLng]])
        const distKm = getHaversineDistance(startLat, startLng, endLat, endLng)
        setRealDistance(`${distKm.toFixed(1)} km`)
        const transitMin = Math.round(distKm * 2.2 + 5)
        setRealTransitTime(
          transitMin > 60
            ? `${Math.floor(transitMin / 60)} hr ${transitMin % 60} mins`
            : `${transitMin} mins`
        )
      }
    }

    fetchRoute()
  }, [selectedLoc, userLocation])

  // Load Map (Vanilla Leaflet) only on client mount
  useEffect(() => {
    setMounted(true)

    const initMap = async () => {
      const L = await import('leaflet')
      LRef.current = L

      if (!mapRef.current || mapInstanceRef.current) return

      // Initialize map
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView(userLocation, 11)
      mapInstanceRef.current = map

      // Dark theme CartoDB layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20
      }).addTo(map)

      // Add User marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative w-6 h-6 flex items-center justify-center">
            <span class="absolute w-6 h-6 rounded-full bg-green-400 opacity-30 animate-ping"></span>
            <span class="relative w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white shadow-lg"></span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
      const userMarker = L.marker(userLocation, { icon: userIcon })
        .addTo(map)
      userMarkerRef.current = userMarker

      LOCATIONS.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: recyclerIcon(L, false)
        })
          .addTo(map)

        marker.on('click', () => {
          setSelectedLoc(loc)
        })

        markersRef.current[loc.id] = marker
      })

      setMapLoaded(true)

      // Force a resize trigger to ensure Leaflet renders container bounds correctly
      setTimeout(() => {
        map.invalidateSize()
      }, 500)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync state selection and user location with Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current
    const L = LRef.current
    if (!map || !L || !mapLoaded) return

    // Update user marker position
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLocation)
    }

    if (!selectedLoc || routeCoordinates.length === 0) {
      if (routeLineRef.current) {
        routeLineRef.current.remove()
        routeLineRef.current = null
      }
      return
    }

    // 1. Remove old route line
    if (routeLineRef.current) {
      routeLineRef.current.remove()
    }

    // 2. Draw new route line (detailed road routing)
    const route = L.polyline(routeCoordinates, {
      color: '#A78BFA',
      weight: 4,
      opacity: 0.8
    }).addTo(map)
    routeLineRef.current = route

    // 3. Fly map to fit the route bounds
    map.flyToBounds(routeCoordinates, {
      padding: [50, 50],
      duration: 1.5
    })

    // 4. Update marker icons
    Object.keys(markersRef.current).forEach(id => {
      const marker = markersRef.current[id]
      const isSelected = id === selectedLoc.id
      marker.setIcon(recyclerIcon(L, isSelected))
    })
  }, [selectedLoc, userLocation, routeCoordinates, mapLoaded])

  if (!mounted) {
    return (
      <section
        id="recycle"
        className="relative min-h-screen lg:h-screen snap-start flex items-center bg-[#080C10] py-16 lg:py-0"
      >
        <div className="max-w-7xl mx-auto px-8 w-full text-center opacity-40">
          <p className="font-body text-base text-white">Loading recycling center data...</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="recycle"
      className="relative min-h-screen lg:h-screen snap-start flex items-center bg-[#080C10] overflow-y-auto lg:overflow-hidden py-16 lg:py-0 border-t border-white/5"
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(167, 139, 250, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(167, 139, 250, 0.4);
        }
        
        /* Customize Leaflet elements to match dark tech theme */
        .leaflet-container {
          background: #080c10 !important;
          outline: none;
        }
        .leaflet-bar {
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: none !important;
          border-radius: 8px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background: rgba(8, 12, 16, 0.85) !important;
          color: rgba(255, 255, 255, 0.7) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          font-family: monospace;
          transition: all 0.2s;
        }
        .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: white !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(8, 12, 16, 0.95) !important;
          border: 1px solid rgba(167, 139, 250, 0.3) !important;
          backdrop-filter: blur(12px);
          color: white !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          font-family: var(--font-body), sans-serif !important;
        }
        .leaflet-popup-tip {
          background: rgba(8, 12, 16, 0.95) !important;
          border-left: 1px solid rgba(167, 139, 250, 0.3) !important;
          border-bottom: 1px solid rgba(167, 139, 250, 0.3) !important;
        }
        .leaflet-popup-content {
          margin: 12px 16px !important;
          font-size: 12px !important;
          line-height: 1.4 !important;
        }
        .leaflet-container .leaflet-control-attribution {
          background: rgba(8, 12, 16, 0.8) !important;
          color: rgba(255, 255, 255, 0.2) !important;
          font-size: 8px !important;
        }
        .leaflet-container .leaflet-control-attribution a {
          color: rgba(167, 139, 250, 0.5) !important;
        }
      `}</style>

      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A78BFA] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10 w-full my-auto flex flex-col gap-6 lg:gap-8">
        {/* Section Header */}
        <div className="flex flex-col gap-3">
          <p className="font-tech text-[10px] tracking-[0.3em] text-[#A78BFA] uppercase">
            Facilitation Pillar
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight leading-[0.95] uppercase">
            LOCATOR & <span className="text-[#A78BFA]">ACTION</span> CENTER
          </h2>
          <p className="font-body text-white/50 max-w-2xl text-base lg:text-lg font-light leading-relaxed">
            Find DENR-EMB accredited collection hubs on the map. Distances and routes are
            computed dynamically using your physical location.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid lg:grid-cols-[1.2fr_1.8fr] gap-6 lg:gap-8 h-[calc(100vh-260px)] min-h-[460px] items-stretch">
          {/* Left Panel: Search & Directory List */}
          <div className="flex flex-col h-full bg-white/[0.01] border border-white/[0.06] rounded-2xl p-5 overflow-hidden">
            {/* Search Input */}
            <div className="relative mb-4 shrink-0">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by center name, city..."
                className="w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#A78BFA]/40 focus:bg-white/[0.04] text-white rounded-xl pl-11 pr-4 py-3 text-sm font-body outline-none transition-all duration-200 placeholder-white/30"
              />
            </div>

            {/* Filter Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 pr-1 flex-nowrap shrink-0">
              {[
                { id: 'All', label: 'All' },
                { id: 'Mobile', label: 'Mobiles' },
                { id: 'Computers', label: 'IT & PC' },
                { id: 'Batteries', label: 'Batteries' },
                { id: 'Screens', label: 'Screens' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-lg border font-body text-xs font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#A78BFA]/10 border-[#A78BFA]/40 text-[#A78BFA]'
                      : 'bg-transparent border-white/5 text-white/40 hover:text-white/70 hover:border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Scrollable Recyclers List */}
            <div
              onWheel={e => e.stopPropagation()}
              onTouchStart={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
              onTouchEnd={e => e.stopPropagation()}
              className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 custom-scrollbar"
            >
              {filteredLocations.length > 0 ? (
                filteredLocations.map(loc => {
                  const isSelected = selectedLoc?.id === loc.id
                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setSelectedLoc(loc)
                      }}
                      className={`text-left w-full p-4 rounded-xl border transition-all duration-300 flex flex-col gap-2 group cursor-pointer ${
                        isSelected
                          ? 'bg-[#A78BFA]/5 border-[#A78BFA]/30 shadow-lg'
                          : 'bg-white/[0.01] border-white/[0.06] hover:border-white/10 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full gap-2">
                        <h4 className="font-body text-sm font-medium text-white group-hover:text-[#A78BFA] transition-colors duration-200 leading-tight">
                          {loc.name}
                        </h4>
                        <span className="font-tech text-[10px] text-white/40 px-2 py-0.5 rounded bg-white/5 whitespace-nowrap shrink-0">
                          {loc.distance}
                        </span>
                      </div>
                      <p className="font-body text-xs text-white/50 line-clamp-1">
                        {loc.address}
                      </p>

                    </button>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 py-12 text-center opacity-40">
                  <span className="text-white mb-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  </span>
                  <p className="font-body text-sm text-white/60">No accredited centers found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Interactive Leaflet Map */}
          <div className="flex flex-col h-full bg-white/[0.01] border border-white/[0.06] rounded-2xl overflow-hidden p-5 relative justify-between">

            {/* Map Container */}
            <div
              onWheel={e => e.stopPropagation()}
              onTouchStart={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
              onTouchEnd={e => e.stopPropagation()}
              className="flex-1 bg-[#0A0F14]/40 border border-white/[0.03] rounded-xl overflow-hidden relative mb-4 flex min-h-[220px] lg:min-h-[300px]"
            >
              <div
                ref={mapRef}
                className="w-full h-full z-10"
                style={{ minHeight: '100%', height: '100%' }}
              />
            </div>

            {/* Recycler Details & Actions Box */}
            {selectedLoc && (
              <div className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-4 shrink-0 flex flex-col gap-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h4 className="font-body text-base font-medium text-white">
                      {selectedLoc.name}
                    </h4>
                    <p className="font-body text-xs text-white/40">{selectedLoc.address}</p>
                  </div>
                  <div className="flex gap-4 text-xs font-tech text-white/40">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-white/30">
                        Distance
                      </span>
                      <span className="text-white font-medium">{realDistance || selectedLoc.distance}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-3">
                      <span className="text-[9px] uppercase tracking-wider text-white/30">
                        Transit
                      </span>
                      <span className="text-white font-medium">{realTransitTime || selectedLoc.transitTime}</span>
                    </div>
                  </div>
                </div>

                {/* Tag items list */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="font-tech text-[9px] text-white/30 uppercase mr-1">Accepts:</span>
                  {selectedLoc.accepted.map((item, idx) => (
                    <span
                      key={idx}
                      className="font-tech text-[9px] text-[#A78BFA] bg-[#A78BFA]/5 border border-[#A78BFA]/10 px-2 py-0.5 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-[1fr_auto] gap-3 mt-2 border-t border-white/[0.06] pt-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${selectedLoc.lat},${selectedLoc.lng}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#A78BFA] text-[#080C10] hover:bg-[#A78BFA]/85 rounded-lg font-body font-semibold text-xs transition-colors duration-200 text-center block cursor-pointer"
                  >
                    Directions in Google Maps ↗
                  </a>
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${selectedLoc.email}`}
                      className="p-2.5 bg-white/5 border border-white/15 hover:border-white/30 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                      title="Send Email Inquiry"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </a>
                    <a
                      href={`tel:${selectedLoc.contact}`}
                      className="p-2.5 bg-white/5 border border-white/15 hover:border-white/30 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                      title="Call Center"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Locator
