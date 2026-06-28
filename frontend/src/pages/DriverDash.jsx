import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getMyBus, registerBus, getMyRoutes, createRoute,
  getMySchedules, createSchedule, getActiveTrip,
  startTrip, endTrip, reportDelay, cancelTrip,
  getMyTrips, updateLocation
} from '../services/api'
import { Bus, Plus, Navigation, AlertTriangle,
         CheckCircle, XCircle, LogOut } from 'lucide-react'

export default function DriverDash() {
  const { user, logout }       = useAuth()
  const [tab, setTab]          = useState('trips')
  const [bus, setBus]          = useState(null)
  const [routes, setRoutes]    = useState([])
  const [schedules, setSched]  = useState([])
  const [trips, setTrips]      = useState([])
  const [activeTrip, setActive]= useState(null)
  const [msg, setMsg]          = useState({ text:'', type:'ok' })
  const [showDelay, setShowDelay] = useState(false)
  const [delayForm, setDelay]  = useState({ reason:'', extra_minutes:0 })
  const [busForm, setBusForm]  = useState({ bus_number:'', type:'', capacity:'' })
  const [routeForm, setRoute]  = useState({
    origin:'', destination:'', route_name:'',
    stops:[{ stop_name:'', estimated_time:0 }]
  })
  const gpsRef = useRef(null)

  const toast = (text, type='ok') => {
    setMsg({ text, type }); setTimeout(() => setMsg({ text:'', type:'ok' }), 3500)
  }

  const load = useCallback(async () => {
    try {
      const [b,r,sc,tr,at] = await Promise.all([
        getMyBus(), getMyRoutes(), getMySchedules(), getMyTrips(), getActiveTrip()
      ])
      setBus(b.data); setRoutes(r.data); setSched(sc.data); setTrips(tr.data); setActive(at.data)
    } catch {}
  }, [])

  useEffect(() => { load() }, [load])

  const startGPS = tripId => {
    gpsRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        pos => updateLocation({
          trip_id: tripId, lat: pos.coords.latitude,
          lng: pos.coords.longitude, speed: pos.coords.speed, is_gps_active: true
        }).catch(() => {}),
        () => updateLocation({ trip_id: tripId, is_gps_active: false }).catch(() => {})
      )
    }, 10000)
  }

  const stopGPS = () => { clearInterval(gpsRef.current); gpsRef.current = null }

  const handleStartTrip = async () => {
    const approved = routes.filter(r => r.status === 'approved')
    if (!bus)             return toast('Register your bus first', 'err')
    if (!approved.length) return toast('No approved routes available', 'err')
    try {
      const { data } = await startTrip({ route_id: approved[0].id, bus_id: bus.id })
      startGPS(data.tripId)
      toast('Trip started! GPS tracking active 🟢')
      load()
    } catch (err) { toast(err.response?.data?.message || 'Failed', 'err') }
  }

  const handleEndTrip = async () => {
    try { await endTrip(activeTrip.id); stopGPS(); toast('Trip ended ✅'); setActive(null); load() }
    catch { toast('Failed to end trip', 'err') }
  }

  const handleDelay = async e => {
    e.preventDefault()
    try { await reportDelay(activeTrip.id, delayForm); toast('Delay reported ⚠️'); setShowDelay(false); load() }
    catch { toast('Failed', 'err') }
  }

  const handleCancel = async () => {
    if (!window.confirm('Cancel this trip?')) return
    try {
      await cancelTrip(activeTrip.id, { reason:'Cancelled by driver' })
      stopGPS(); toast('Trip cancelled'); setActive(null); load()
    } catch { toast('Failed', 'err') }
  }

  const handleRegBus = async e => {
    e.preventDefault()
    try {
      await registerBus({ ...busForm, capacity: Number(busForm.capacity) })
      toast('Bus registered ✅'); load()
    } catch (err) { toast(err.response?.data?.message || 'Failed', 'err') }
  }

  const handleCreateRoute = async e => {
    e.preventDefault()
    try {
      await createRoute(routeForm)
      toast('Route submitted for approval 📋')
      setRoute({ origin:'', destination:'', route_name:'', stops:[{ stop_name:'', estimated_time:0 }] })
      load()
    } catch (err) { toast(err.response?.data?.message || 'Failed', 'err') }
  }

  const addStop = () => setRoute(f => ({ ...f, stops:[...f.stops, { stop_name:'', estimated_time:0 }] }))
  const setStop = (i,k,v) => setRoute(f => {
    const s = [...f.stops]; s[i] = { ...s[i], [k]:v }; return { ...f, stops:s }
  })

  const badgeColor = s => ({
    approved:'bg-green-100 text-green-700', pending:'bg-yellow-100 text-yellow-700',
    rejected:'bg-red-100 text-red-700',     active:'bg-blue-100 text-blue-700',
    delayed:'bg-orange-100 text-orange-700',completed:'bg-gray-100 text-gray-600'
  })[s] || 'bg-gray-100 text-gray-600'

  const tabs = [['trips','🚌 Trips'],['bus','🚐 My Bus'],['routes','🗺️ Routes'],['schedules','📅 Schedules']]

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      {msg.text && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl font-body text-sm text-white animate-slide-up
          ${msg.type==='err' ? 'bg-red-500' : 'bg-navy'}`}>
          {msg.text}
        </div>
      )}

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex overflow-x-auto">
            {tabs.map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-4 py-4 font-display font-semibold text-sm border-b-2 whitespace-nowrap transition-all
                  ${tab===k ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-navy'}`}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => { stopGPS(); logout() }}
            className="flex items-center gap-1 text-xs text-red-500 font-semibold py-2 flex-shrink-0 ml-4">
            <LogOut size={14}/> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Trips ── */}
        {tab === 'trips' && (
          <>
            {activeTrip ? (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-primary p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"/>
                  <h2 className="font-display font-bold text-navy text-lg">Active Trip</h2>
                </div>
                <p className="font-body text-gray-600 mb-1"><b>{activeTrip.route_name}</b></p>
                <p className="font-body text-gray-400 text-sm mb-4">
                  {activeTrip.origin} → {activeTrip.destination} | <b>{activeTrip.bus_number}</b>
                </p>
                {activeTrip.status === 'delayed' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm text-orange-700 font-body">
                    ⚠️ {activeTrip.delay_reason} (+{activeTrip.extra_minutes} min)
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setShowDelay(true)}
                    className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-200 transition-colors">
                    <AlertTriangle size={15}/> Report Delay
                  </button>
                  <button onClick={handleEndTrip}
                    className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-200 transition-colors">
                    <CheckCircle size={15}/> End Trip
                  </button>
                  <button onClick={handleCancel}
                    className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-200 transition-colors">
                    <XCircle size={15}/> Cancel Trip
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="font-display font-bold text-navy mb-2">Start a New Trip</h2>
                <p className="font-body text-gray-500 text-sm mb-4">GPS tracking will begin automatically.</p>
                <button onClick={handleStartTrip} className="btn-primary flex items-center gap-2">
                  <Navigation size={16}/> Start Trip
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-navy mb-4">Trip History</h2>
              {trips.length === 0
                ? <p className="text-gray-400 font-body text-sm">No trips yet.</p>
                : trips.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 border-b border-gray-50 last:border-0">
                    <div>
                      <b className="font-display text-navy text-sm">{t.route_name}</b>
                      <p className="font-body text-gray-400 text-xs mt-0.5">
                        {t.bus_number} | {t.origin} → {t.destination}
                      </p>
                    </div>
                    <span className={`badge text-xs ${badgeColor(t.status)}`}>{t.status}</span>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* ── Bus ── */}
        {tab === 'bus' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-display font-bold text-navy mb-6">My Bus</h2>
            {bus ? (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Bus size={24} className="text-white"/>
                  </div>
                  <div>
                    <div className="font-display font-bold text-navy text-xl">{bus.bus_number}</div>
                    <div className="font-body text-gray-500 text-sm">{bus.type}</div>
                  </div>
                </div>
                <p className="font-body text-gray-600 text-sm">
                  <b>Capacity:</b> {bus.capacity} passengers
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegBus} className="space-y-4 max-w-sm">
                {[
                  ['bus_number','Bus Number','NB-1234', true],
                  ['type',      'Bus Type',  'AC Express', false],
                  ['capacity',  'Capacity',  '45', false],
                ].map(([k,l,p,req]) => (
                  <div key={k}>
                    <label className="block font-display font-semibold text-navy text-sm mb-1.5">{l}</label>
                    <input className="input-field" placeholder={p}
                      value={busForm[k]} onChange={e => setBusForm(f=>({...f,[k]:e.target.value}))} required={req}/>
                  </div>
                ))}
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Plus size={16}/> Register Bus
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Routes ── */}
        {tab === 'routes' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-display font-bold text-navy mb-6">Submit New Route</h2>
              <form onSubmit={handleCreateRoute} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ['origin',     'From',                 'Kandy'],
                    ['destination','To',                   'Colombo'],
                    ['route_name', 'Route Name (optional)',''],
                  ].map(([k,l,p]) => (
                    <div key={k}>
                      <label className="block font-display font-semibold text-navy text-sm mb-1.5">{l}</label>
                      <input className="input-field" placeholder={p}
                        value={routeForm[k]} onChange={e => setRoute(f=>({...f,[k]:e.target.value}))}
                        required={k!=='route_name'}/>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-display font-semibold text-navy text-sm">Stops</label>
                    <button type="button" onClick={addStop}
                      className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                      <Plus size={12}/> Add Stop
                    </button>
                  </div>
                  <div className="space-y-2">
                    {routeForm.stops.map((s,i) => (
                      <div key={i} className="flex gap-3">
                        <input className="input-field flex-1 text-sm py-2.5" placeholder={`Stop ${i+1} name`}
                          value={s.stop_name} onChange={e=>setStop(i,'stop_name',e.target.value)} required/>
                        <input type="number" className="input-field w-28 text-sm py-2.5" placeholder="Minutes"
                          value={s.estimated_time} onChange={e=>setStop(i,'estimated_time',Number(e.target.value))}/>
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Plus size={16}/> Submit for Approval
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-navy mb-4">My Routes</h2>
              {routes.map(r => (
                <div key={r.id} className="flex justify-between items-start p-4 border-b border-gray-50 last:border-0">
                  <div>
                    <b className="font-display text-navy text-sm">{r.route_name}</b>
                    <p className="font-body text-gray-400 text-xs mt-0.5">{r.stop_list}</p>
                    {r.admin_note && <p className="text-orange-500 text-xs mt-1">Admin: {r.admin_note}</p>}
                  </div>
                  <span className={`badge text-xs ${badgeColor(r.status)}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Schedules ── */}
        {tab === 'schedules' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-display font-bold text-navy mb-4">Add Schedule</h2>
              <form onSubmit={async e => {
                e.preventDefault()
                const fd = new FormData(e.target)
                const obj = Object.fromEntries(fd)
                try { await createSchedule(obj); toast('Schedule created ✅'); load(); e.target.reset() }
                catch (err) { toast(err.response?.data?.message || 'Failed','err') }
              }} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-display font-semibold text-navy text-sm mb-1.5">Route</label>
                  <select name="route_id" className="input-field" required>
                    <option value="">Select approved route</option>
                    {routes.filter(r=>r.status==='approved').map(r => (
                      <option key={r.id} value={r.id}>{r.route_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-display font-semibold text-navy text-sm mb-1.5">Departure Time</label>
                  <input type="time" name="departure_time" className="input-field" required/>
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-display font-semibold text-navy text-sm mb-1.5">Days of Week</label>
                  <input name="days_of_week" className="input-field" placeholder="Mon,Tue,Wed,Thu,Fri" required/>
                </div>
                <input type="hidden" name="bus_id" value={bus?.id || ''}/>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Plus size={16}/> Create Schedule
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-navy mb-4">My Schedules</h2>
              {schedules.map(s => (
                <div key={s.id} className="p-4 border-b border-gray-50 last:border-0">
                  <b className="font-display text-navy text-sm">{s.route_name}</b>
                  <p className="font-body text-gray-400 text-xs mt-0.5">
                    {s.departure_time} | {s.days_of_week} | {s.bus_number}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delay modal */}
      {showDelay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
            <h3 className="font-display font-bold text-navy text-lg mb-5">⚠️ Report Delay</h3>
            <form onSubmit={handleDelay} className="space-y-4">
              <div>
                <label className="block font-display font-semibold text-navy text-sm mb-1.5">Reason</label>
                <input className="input-field" placeholder="e.g. Heavy traffic near Kegalle"
                  value={delayForm.reason} onChange={e=>setDelay(f=>({...f,reason:e.target.value}))} required/>
              </div>
              <div>
                <label className="block font-display font-semibold text-navy text-sm mb-1.5">Extra Minutes</label>
                <input type="number" min="0" className="input-field"
                  value={delayForm.extra_minutes} onChange={e=>setDelay(f=>({...f,extra_minutes:Number(e.target.value)}))}/>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 btn-primary py-3">Report</button>
                <button type="button" onClick={() => setShowDelay(false)}
                  className="flex-1 border-2 border-gray-200 text-gray-500 font-display font-semibold py-3 rounded-xl hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}