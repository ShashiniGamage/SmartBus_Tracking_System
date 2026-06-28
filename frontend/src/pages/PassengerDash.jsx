import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { searchBuses, subscribeBus, unsubscribe } from '../services/api'
import { io } from 'socket.io-client'
import { Search, MapPin, Bell, BellOff, Clock, AlertTriangle, X, LogOut, Bus } from 'lucide-react'

export default function PassengerDash() {
  const { user, logout }        = useAuth()
  const [origin, setOrigin]     = useState('')
  const [dest, setDest]         = useState('')
  const [buses, setBuses]       = useState([])
  const [searching, setSearch]  = useState(false)
  const [selected, setSelected] = useState(null)
  const [boardStop, setBoard]   = useState('')
  const [subscribed, setSub]    = useState(false)
  const [liveData, setLive]     = useState(null)
  const [alerts, setAlerts]     = useState([])
  const socketRef               = useRef(null)

  useEffect(() => {
    socketRef.current = io('http://localhost:5000')
    socketRef.current.on('location_update',    d => setLive(d))
    socketRef.current.on('delay_alert',        d => addAlert('delay',   d.message))
    socketRef.current.on('arrival_alert',      d => addAlert('arrival', d.message))
    socketRef.current.on('cancellation_alert', d => addAlert('cancel',  d.message))
    socketRef.current.on('trip_completed',     d => addAlert('success', d.message))
    return () => socketRef.current?.disconnect()
  }, [])

  const addAlert = (type, message) => {
    setAlerts(a => [{ type, message, id: Date.now() }, ...a].slice(0, 5))
  }

  const handleSearch = async e => {
    e.preventDefault()
    setSearch(true); setBuses([]); setSelected(null); setSub(false); setLive(null)
    try {
      const { data } = await searchBuses(origin.trim(), dest.trim())
      setBuses(data)
      if (!data.length) addAlert('cancel', `No buses found for ${origin} → ${dest}`)
    } catch { addAlert('cancel', 'Search failed. Try again.') }
    finally { setSearch(false) }
  }

  const handleSelect = bus => {
    if (selected) socketRef.current?.emit('leave_trip', selected.trip_id)
    setSelected(bus); setBoard(''); setSub(false)
    if (bus.current_lat) setLive({ lat:bus.current_lat, lng:bus.current_lng, eta:bus.eta, status:bus.status })
  }

  const handleSubscribe = async () => {
    if (!boardStop) return addAlert('delay', 'Select your boarding stop first')
    try {
      await subscribeBus({ trip_id: selected.trip_id, boarding_stop: boardStop })
      socketRef.current?.emit('join_trip', selected.trip_id)
      setSub(true)
      addAlert('success', `Tracking ${selected.bus_number} from ${boardStop} 🔔`)
    } catch { addAlert('cancel', 'Login required to track buses') }
  }

  const handleUnsub = async () => {
    try {
      await unsubscribe(selected.trip_id)
      socketRef.current?.emit('leave_trip', selected.trip_id)
      setSub(false); setLive(null)
      addAlert('success', 'Tracking stopped')
    } catch {}
  }

  const etaData = liveData?.eta || selected?.eta || []
  const myEta   = etaData.find(e => e.stop_name?.toLowerCase() === boardStop?.toLowerCase())

  const badgeCls = s => ({
    active:   'bg-green-100 text-green-700',
    delayed:  'bg-orange-100 text-orange-700',
    scheduled:'bg-blue-100 text-blue-700',
  })[s] || 'bg-gray-100 text-gray-600'

  return (
    <div className="min-h-screen bg-cream pt-20 pb-10">

      {/* Toast alerts */}
      <div className="fixed top-20 right-4 z-50 space-y-2 w-80">
        {alerts.map(a => (
          <div key={a.id} className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border text-sm font-body animate-slide-up
            ${a.type==='delay'   ? 'bg-orange-50 border-orange-200 text-orange-800'
            : a.type==='cancel'  ? 'bg-red-50 border-red-200 text-red-800'
            : a.type==='arrival' ? 'bg-blue-50 border-blue-200 text-blue-800'
            :                      'bg-green-50 border-green-200 text-green-800'}`}>
            <span className="text-base flex-shrink-0">
              {a.type==='delay'?'⚠️':a.type==='cancel'?'❌':a.type==='arrival'?'🔔':'✅'}
            </span>
            <p className="flex-1 leading-relaxed text-xs">{a.message}</p>
            <button onClick={() => setAlerts(x => x.filter(i => i.id !== a.id))}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <X size={12}/>
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-navy">
              Welcome, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="font-body text-gray-400 text-sm mt-1">Search and track your bus in real time</p>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 text-sm text-red-500 font-semibold hover:text-red-700">
            <LogOut size={15}/> Logout
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="font-display font-bold text-navy mb-4 flex items-center gap-2">
            <Search size={18} className="text-primary"/> Find Your Bus
          </h2>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-40 relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"/>
              <input className="input-field pl-9 py-2.5 text-sm" placeholder="From (e.g. Kandy)"
                value={origin} onChange={e => setOrigin(e.target.value)} required/>
            </div>
            <div className="flex-1 min-w-40 relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
              <input className="input-field pl-9 py-2.5 text-sm" placeholder="To (e.g. Colombo)"
                value={dest} onChange={e => setDest(e.target.value)} required/>
            </div>
            <button type="submit" disabled={searching}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-70">
              {searching
                ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Searching...</>
                : 'Search'}
            </button>
          </form>
          <div className="flex flex-wrap gap-2 mt-4">
            {[['Kandy','Colombo'],['Colombo','Galle'],['Kandy','Nuwara Eliya'],['Colombo','Kurunegala']].map(([o,d]) => (
              <button key={o+d} onClick={() => { setOrigin(o); setDest(d) }}
                className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                {o} → {d}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {buses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h2 className="font-display font-bold text-navy mb-4">
              {buses.length} Bus{buses.length>1?'es':''} Available
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {buses.map(b => (
                <button key={b.trip_id} onClick={() => handleSelect(b)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 w-full
                    ${selected?.trip_id===b.trip_id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-100 hover:border-primary/40 hover:bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Bus size={18} className="text-white"/>
                      </div>
                      <div>
                        <div className="font-display font-bold text-navy text-sm">{b.bus_number}</div>
                        <div className="font-body text-gray-400 text-xs">{b.bus_type}</div>
                      </div>
                    </div>
                    <span className={`badge text-[10px] ${badgeCls(b.status)}`}>{b.status}</span>
                  </div>
                  {b.departure_time && (
                    <p className="text-xs text-gray-400 font-body flex items-center gap-1 mb-2">
                      <Clock size={10}/> {b.departure_time} | {b.days_of_week}
                    </p>
                  )}
                  {b.status==='delayed' && (
                    <p className="text-xs text-orange-600 flex items-center gap-1 mb-2">
                      <AlertTriangle size={10}/> +{b.extra_minutes} min — {b.delay_reason}
                    </p>
                  )}
                  {b.eta?.slice(0,3).map(e => (
                    <div key={e.stop_order} className="flex justify-between text-xs font-body text-gray-500 py-1 border-t border-gray-50">
                      <span>{e.stop_name}</span>
                      <span className="font-semibold text-navy">{e.eta_time || '—'}</span>
                    </div>
                  ))}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe */}
        {selected && !subscribed && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h2 className="font-display font-bold text-navy mb-1">📍 Select Your Boarding Stop</h2>
            <p className="font-body text-gray-400 text-sm mb-4">We'll alert you 10 minutes before the bus arrives.</p>
            <select className="input-field mb-4" value={boardStop} onChange={e => setBoard(e.target.value)}>
              <option value="">-- Choose stop --</option>
              {etaData.map(e => (
                <option key={e.stop_order} value={e.stop_name}>
                  {e.stop_name}{e.eta_minutes!=null ? ` (~${e.eta_minutes} min)` : ''}
                </option>
              ))}
            </select>
            <button onClick={handleSubscribe} className="btn-primary flex items-center gap-2">
              <Bell size={16}/> Track This Bus
            </button>
          </div>
        )}

        {/* Live tracking */}
        {subscribed && selected && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-primary p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"/>
                <h2 className="font-display font-bold text-navy">Live — {selected.bus_number}</h2>
              </div>
              <button onClick={handleUnsub}
                className="flex items-center gap-1 text-sm text-red-500 font-semibold hover:text-red-700">
                <BellOff size={14}/> Stop
              </button>
            </div>

            {myEta && (
              <div className="bg-primary text-white rounded-2xl p-5 mb-5">
                <p className="text-white/70 text-xs mb-1">Your stop: <b className="text-white">{boardStop}</b></p>
                <p className="font-display font-extrabold text-3xl">{myEta.eta_time}</p>
                <p className="text-white/80 text-sm mt-1">
                  ~{myEta.eta_minutes} minutes away
                  {(liveData?.extra_minutes || selected.extra_minutes) > 0 && (
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      +{liveData?.extra_minutes || selected.extra_minutes} min delay
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className="space-y-1">
              {etaData.map((e, i) => {
                const isMine = e.stop_name?.toLowerCase() === boardStop?.toLowerCase()
                const isPast = e.eta_minutes === 0
                return (
                  <div key={i} className={`flex justify-between items-center text-sm py-2.5 px-4 rounded-xl
                    ${isMine ? 'bg-primary/10 border border-primary/20'
                    : isPast ? 'opacity-40'
                    : 'hover:bg-gray-50'}`}>
                    <span className={`font-body flex items-center gap-2 ${isMine?'text-primary font-semibold':'text-gray-600'}`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0
                        ${isMine?'bg-primary':isPast?'bg-green-400':'bg-gray-200'}`}/>
                      {e.stop_name} {isMine && '📍'}
                    </span>
                    <span className={`font-display font-semibold text-sm ${isMine?'text-primary':'text-navy'}`}>
                      {isPast ? '✓ Passed' : e.eta_time || '—'}
                      {!isPast && e.eta_minutes != null &&
                        <span className="text-gray-400 font-body text-xs ml-1">~{e.eta_minutes}m</span>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}