import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { searchBuses, subscribeBus, unsubscribe, getRoutesData } from '../services/api'
import { Search, MapPin, Clock, Bell, BellOff, AlertTriangle, X, Bus } from 'lucide-react'

const busIcon = L.divIcon({
  html: `<div style="background:#C8102E;width:36px;height:36px;border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
                box-shadow:0 4px 16px rgba(200,16,46,0.5);border:3px solid white">
           <span style="transform:rotate(45deg);font-size:16px">🚌</span>
         </div>`,
  className: '', iconSize: [36,36], iconAnchor: [18,36], popupAnchor: [0,-36]
})

const stopIcon = (active) => L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;
                background:${active?'#C8102E':'#1A1A2E'};
                border:3px solid white;
                box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  className: '', iconSize: [14,14], iconAnchor: [7,7]
})

function FlyTo({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 12, { duration: 1.2 })
  }, [lat, lng])
  return null
}

function AlertBanner({ alerts, onClose }) {
  if (!alerts.length) return null
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] space-y-2 w-full max-w-sm px-4">
      {alerts.map((a, i) => (
        <div key={i} className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl border text-sm font-body animate-slide-up
          ${a.type==='delay'   ? 'bg-orange-50 border-orange-200 text-orange-800'
          : a.type==='cancel'  ? 'bg-red-50 border-red-200 text-red-800'
          : a.type==='arrival' ? 'bg-blue-50 border-blue-200 text-blue-800'
          :                      'bg-green-50 border-green-200 text-green-800'}`}>
          <span className="text-lg flex-shrink-0">
            {a.type==='delay'?'⚠️':a.type==='cancel'?'❌':a.type==='arrival'?'🔔':'✅'}
          </span>
          <p className="flex-1 leading-relaxed">{a.message}</p>
          <button onClick={() => onClose(i)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X size={14}/>
          </button>
        </div>
      ))}
    </div>
  )
}

export default function LiveRoute() {
  const { user }                = useAuth()
  const [origin, setOrigin]     = useState('')
  const [dest, setDest]         = useState('')
  const [buses, setBuses]       = useState([])
  const [searching, setSearch]  = useState(false)
  const [selected, setSelected] = useState(null)
  const [boardStop, setBoard]   = useState('')
  const [subscribed, setSub]    = useState(false)
  const [liveData, setLive]     = useState(null)
  const [alerts, setAlerts]     = useState([])
  const [allRoutes, setAll]     = useState({ routes:[], stops:[] })
  const socketRef               = useRef(null)

  useEffect(() => {
    getRoutesData().then(r => setAll(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    socketRef.current = io('http://localhost:5000')
    socketRef.current.on('location_update',    d => setLive(prev => ({ ...prev, ...d })))
    socketRef.current.on('delay_alert',        d => addAlert('delay',   d.message))
    socketRef.current.on('arrival_alert',      d => addAlert('arrival', d.message))
    socketRef.current.on('cancellation_alert', d => addAlert('cancel',  d.message))
    socketRef.current.on('trip_completed',     d => addAlert('success', d.message))
    return () => socketRef.current?.disconnect()
  }, [])

  const addAlert = (type, message) => {
    setAlerts(a => [...a, { type, message }])
    setTimeout(() => setAlerts(a => a.slice(1)), 8000)
  }

  const handleSearch = async e => {
    e.preventDefault()
    if (!origin.trim() || !dest.trim()) return
    setSearch(true); setBuses([]); setSelected(null); setSub(false); setLive(null)
    try {
      const { data } = await searchBuses(origin.trim(), dest.trim())
      setBuses(data)
      if (!data.length) addAlert('cancel', `No buses found for ${origin} → ${dest}`)
    } catch { addAlert('cancel', 'Search failed. Please try again.') }
    finally { setSearch(false) }
  }

  const handleSelect = (bus) => {
    if (selected) socketRef.current?.emit('leave_trip', selected.trip_id)
    setSelected(bus); setBoard(''); setSub(false); setLive(null)
    if (bus.current_lat) {
      setLive({ lat: bus.current_lat, lng: bus.current_lng, eta: bus.eta, status: bus.status })
    }
  }

  const handleSubscribe = async () => {
    if (!boardStop) return addAlert('delay', 'Please select your boarding stop first')
    try {
      if (user) await subscribeBus({ trip_id: selected.trip_id, boarding_stop: boardStop })
      socketRef.current?.emit('join_trip', selected.trip_id)
      setSub(true)
      addAlert('success', `🔔 Tracking ${selected.bus_number} from ${boardStop}`)
    } catch { addAlert('cancel', 'Failed to subscribe. Please login first.') }
  }

  const handleUnsubscribe = async () => {
    try {
      if (user) await unsubscribe(selected.trip_id)
      socketRef.current?.emit('leave_trip', selected.trip_id)
      setSub(false); setLive(null)
      addAlert('success', 'Tracking stopped')
    } catch {}
  }

  const routeStops = selected
    ? allRoutes.stops
        .filter(s => s.route_id === selected.route_id && s.latitude)
        .sort((a, b) => a.stop_order - b.stop_order)
        .map(s => [parseFloat(s.latitude), parseFloat(s.longitude)])
    : []

  const busLat  = liveData?.lat  || selected?.current_lat
  const busLng  = liveData?.lng  || selected?.current_lng
  const etaData = liveData?.eta  || selected?.eta || []
  const myEta   = etaData.find(e => e.stop_name?.toLowerCase() === boardStop?.toLowerCase())

  const badgeCls = s => ({
    active:    'bg-green-100 text-green-700',
    delayed:   'bg-orange-100 text-orange-700',
    scheduled: 'bg-blue-100 text-blue-700',
  })[s] || 'bg-gray-100 text-gray-600'

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        <div className="mb-6">
          <h1 className="font-display font-bold text-3xl text-navy">Live Bus Tracking</h1>
          <p className="font-body text-gray-500 mt-1">Search your route and track buses in real time across Sri Lanka</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left Panel ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
              <h2 className="font-display font-bold text-navy mb-4 flex items-center gap-2">
                <Search size={18} className="text-primary"/> Search Route
              </h2>
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"/>
                  <input className="input-field pl-9 py-2.5 text-sm" placeholder="From (e.g. Kandy)"
                    value={origin} onChange={e => setOrigin(e.target.value)} required/>
                </div>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input className="input-field pl-9 py-2.5 text-sm" placeholder="To (e.g. Colombo)"
                    value={dest} onChange={e => setDest(e.target.value)} required/>
                </div>
                <button type="submit" disabled={searching}
                  className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                  {searching
                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Searching...</>
                    : 'Search Buses'}
                </button>
              </form>

              {/* Quick routes */}
              <div className="mt-4">
                <p className="text-xs text-gray-400 font-body mb-2">Popular routes:</p>
                <div className="flex flex-wrap gap-2">
                  {[['Kandy','Colombo'],['Colombo','Galle'],['Kandy','Nuwara Eliya']].map(([o,d]) => (
                    <button key={o+d} onClick={() => { setOrigin(o); setDest(d) }}
                      className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                      {o} → {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            {buses.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                <h2 className="font-display font-bold text-navy mb-3 text-sm">
                  {buses.length} Bus{buses.length > 1 ? 'es' : ''} Found
                </h2>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {buses.map(b => (
                    <button key={b.trip_id} onClick={() => handleSelect(b)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                        ${selected?.trip_id === b.trip_id
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-100 hover:border-primary/40 hover:bg-gray-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bus size={16} className="text-white"/>
                          </div>
                          <div>
                            <span className="font-display font-bold text-navy text-sm">{b.bus_number}</span>
                            <span className="text-xs text-gray-400 ml-1">{b.bus_type}</span>
                          </div>
                        </div>
                        <span className={`badge text-[10px] ${badgeCls(b.status)}`}>{b.status}</span>
                      </div>
                      {b.departure_time && (
                        <p className="text-xs text-gray-400 font-body flex items-center gap-1">
                          <Clock size={10}/> {b.departure_time} | {b.days_of_week}
                        </p>
                      )}
                      {b.status === 'delayed' && (
                        <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                          <AlertTriangle size={10}/> +{b.extra_minutes} min delay
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subscribe panel */}
            {selected && !subscribed && (
              <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
                <h2 className="font-display font-bold text-navy mb-1 text-sm">📍 Select Boarding Stop</h2>
                <p className="text-xs text-gray-400 font-body mb-3">We'll alert you 10 min before arrival</p>
                <select className="input-field text-sm mb-3" value={boardStop} onChange={e => setBoard(e.target.value)}>
                  <option value="">-- Choose your stop --</option>
                  {etaData.map(e => (
                    <option key={e.stop_order} value={e.stop_name}>
                      {e.stop_name}{e.eta_minutes != null ? ` (~${e.eta_minutes} min)` : ''}
                    </option>
                  ))}
                </select>
                <button onClick={handleSubscribe}
                  className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2">
                  <Bell size={15}/> Track This Bus
                </button>
              </div>
            )}

            {/* Live ETA panel */}
            {subscribed && selected && (
              <div className="bg-white rounded-2xl shadow-lg p-5 border-2 border-primary">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-bold text-navy text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                    Live Tracking — {selected.bus_number}
                  </h2>
                  <button onClick={handleUnsubscribe}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold">
                    <BellOff size={12}/> Stop
                  </button>
                </div>

                {myEta && (
                  <div className="bg-primary text-white rounded-xl p-4 mb-4">
                    <p className="text-white/70 text-xs mb-1">
                      Your stop: <b className="text-white">{boardStop}</b>
                    </p>
                    <p className="font-display font-extrabold text-2xl">{myEta.eta_time}</p>
                    <p className="text-white/80 text-sm">~{myEta.eta_minutes} minutes away</p>
                    {(liveData?.extra_minutes || selected.extra_minutes) > 0 && (
                      <p className="text-white/60 text-xs mt-1">
                        +{liveData?.extra_minutes || selected.extra_minutes} min delay included
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-1 max-h-52 overflow-y-auto">
                  {etaData.map((e, i) => {
                    const isMine = e.stop_name?.toLowerCase() === boardStop?.toLowerCase()
                    const isPast = e.eta_minutes === 0
                    return (
                      <div key={i} className={`flex justify-between items-center text-xs py-2.5 px-3 rounded-lg
                        ${isMine ? 'bg-primary text-white font-semibold'
                        : isPast ? 'opacity-40 bg-gray-50'
                        : 'hover:bg-gray-50'}`}>
                        <span className="font-body flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0
                            ${isMine?'bg-white':isPast?'bg-green-400':'bg-gray-300'}`}/>
                          {e.stop_name} {isMine && '📍'}
                        </span>
                        <span className={`font-display font-semibold ${isMine?'text-white':'text-navy'}`}>
                          {isPast ? '✓ Passed' : e.eta_time}
                          {!isPast && e.eta_minutes != null &&
                            <span className={`ml-1 font-body ${isMine?'text-white/70':'text-gray-400'}`}>
                              ~{e.eta_minutes}m
                            </span>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Map ── */}
          <div className="lg:col-span-2 relative">
            <AlertBanner alerts={alerts} onClose={i => setAlerts(a => a.filter((_,j) => j !== i))}/>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100" style={{height:'640px'}}>
              <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{height:'100%', width:'100%'}}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />

                {busLat && busLng && (
                  <>
                    <FlyTo lat={parseFloat(busLat)} lng={parseFloat(busLng)}/>
                    <Marker position={[parseFloat(busLat), parseFloat(busLng)]} icon={busIcon}>
                      <Popup>
                        <div className="font-body text-sm p-1">
                          <b className="text-primary text-base">{selected?.bus_number}</b><br/>
                          <span className="text-gray-500">{selected?.route_name}</span><br/>
                          <span className={`font-semibold ${selected?.status==='delayed'?'text-orange-600':'text-green-600'}`}>
                            ● {selected?.status}
                          </span>
                          {selected?.delay_reason &&
                            <p className="text-orange-500 text-xs mt-1">{selected.delay_reason}</p>}
                        </div>
                      </Popup>
                    </Marker>
                  </>
                )}

                {/* Route polyline */}
                {routeStops.length > 1 && (
                  <Polyline positions={routeStops} color="#C8102E" weight={4} opacity={0.7} dashArray="10,6"/>
                )}

                {/* Stop markers */}
                {selected && etaData.filter(e => e.latitude).map((e, i) => (
                  <Marker key={i}
                    position={[parseFloat(e.latitude), parseFloat(e.longitude)]}
                    icon={stopIcon(e.stop_name?.toLowerCase() === boardStop?.toLowerCase())}>
                    <Popup>
                      <div className="font-body text-xs p-1">
                        <b className="text-navy">{e.stop_name}</b><br/>
                        {e.eta_time
                          ? <span className="text-primary font-semibold">ETA: {e.eta_time} (~{e.eta_minutes} min)</span>
                          : <span className="text-gray-400">Not started yet</span>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 border border-gray-100 z-[500]">
              <p className="text-xs font-display font-bold text-navy mb-2">Legend</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-body text-gray-600">
                  <span className="text-base">🚌</span> Live Bus
                </div>
                <div className="flex items-center gap-2 text-xs font-body text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-primary inline-block"/>Your Stop
                </div>
                <div className="flex items-center gap-2 text-xs font-body text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-navy inline-block"/>Other Stops
                </div>
                <div className="flex items-center gap-2 text-xs font-body text-gray-600">
                  <span className="w-8 border-t-2 border-dashed border-primary inline-block"/>Route
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}