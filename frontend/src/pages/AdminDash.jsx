import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getDrivers, updateDriverStatus,
  getAdminRoutes, updateRouteStatus,
  getActiveTrips, getTodayIncidents
} from '../services/api'
import { Activity, AlertTriangle, Users, XCircle,
         CheckCircle, X, Edit3, LogOut } from 'lucide-react'

const badge = s => {
  const m = {
    approved:'bg-green-100 text-green-700', pending:'bg-yellow-100 text-yellow-700',
    rejected:'bg-red-100 text-red-700',     active:'bg-blue-100 text-blue-700',
    delayed:'bg-orange-100 text-orange-700',cancelled:'bg-red-100 text-red-700',
  }
  return `badge ${m[s] || 'bg-gray-100 text-gray-600'}`
}

export default function AdminDash() {
  const { user, logout }      = useAuth()
  const [tab, setTab]         = useState('dashboard')
  const [drivers, setDrivers] = useState([])
  const [routes,  setRoutes]  = useState([])
  const [active,  setActive]  = useState([])
  const [incidents, setInc]   = useState([])
  const [editRoute, setEdit]  = useState(null)
  const [msg, setMsg]         = useState('')

  const load = useCallback(async () => {
    try {
      const [d,r,a,i] = await Promise.all([
        getDrivers(), getAdminRoutes(), getActiveTrips(), getTodayIncidents()
      ])
      setDrivers(d.data); setRoutes(r.data); setActive(a.data); setInc(i.data)
    } catch {}
  }, [])

  useEffect(() => { load() }, [load])

  const toast = m => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const driverAction = async (id, status) => {
    try { await updateDriverStatus(id, status); toast(`Driver ${status} ✅`); load() }
    catch { toast('Failed ❌') }
  }

  const routeAction = async (id, status, data = {}) => {
    try { await updateRouteStatus(id, { status, ...data }); toast(`Route ${status} ✅`); setEdit(null); load() }
    catch { toast('Failed ❌') }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">

      {/* Toast */}
      {msg && (
        <div className="fixed top-20 right-4 z-50 bg-navy text-white px-5 py-3 rounded-xl shadow-2xl font-body text-sm animate-slide-up">
          {msg}
        </div>
      )}

      {/* Sub nav */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex overflow-x-auto">
            {[['dashboard','📊 Dashboard'],['drivers','👨‍✈️ Drivers'],['routes','🗺️ Routes']].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-5 py-4 font-display font-semibold text-sm border-b-2 whitespace-nowrap transition-all
                  ${tab===k ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-navy'}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
            <span className="text-xs font-body text-gray-400 hidden sm:block">Admin: {user?.name}</span>
            <button onClick={logout}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold py-2">
              <LogOut size={14}/> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Dashboard ── */}
        {tab === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon:Activity,      label:'Active Trips',     val:active.filter(t=>t.status==='active').length,   color:'bg-blue-500' },
                { icon:AlertTriangle, label:'Delayed Today',    val:incidents.filter(t=>t.status==='delayed').length,color:'bg-orange-500' },
                { icon:XCircle,       label:'Cancelled Today',  val:incidents.filter(t=>t.status==='cancelled').length,color:'bg-red-500' },
                { icon:Users,         label:'Pending Approvals',val:drivers.filter(d=>d.status==='pending').length + routes.filter(r=>r.status==='pending').length, color:'bg-yellow-500' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                  <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <s.icon size={22} className="text-white"/>
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-2xl text-navy">{s.val}</div>
                    <div className="font-body text-gray-400 text-xs">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active trips */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-display font-bold text-navy mb-4">Active & Delayed Trips</h2>
              {active.length === 0
                ? <p className="text-gray-400 font-body text-sm">No active trips right now.</p>
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-body">
                      <thead>
                        <tr className="border-b border-gray-100">
                          {['Bus','Route','Driver','Status','Delay'].map(h => (
                            <th key={h} className="text-left py-3 px-3 text-gray-400 font-semibold text-xs uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {active.map(t => (
                          <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-3 px-3 font-display font-bold text-navy">{t.bus_number}</td>
                            <td className="py-3 px-3 text-gray-600">{t.origin} → {t.destination}</td>
                            <td className="py-3 px-3 text-gray-600">{t.driver_name}</td>
                            <td className="py-3 px-3"><span className={badge(t.status)}>{t.status}</span></td>
                            <td className="py-3 px-3 text-orange-600 text-xs">
                              {t.delay_reason ? `${t.delay_reason} (+${t.extra_minutes}min)` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>

            {/* Incidents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-display font-bold text-navy mb-4">Today's Incidents</h2>
              {incidents.length === 0
                ? <p className="text-gray-400 font-body text-sm">No incidents today 🎉</p>
                : (
                  <div className="space-y-3">
                    {incidents.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <span className="font-display font-semibold text-navy text-sm">{t.bus_number}</span>
                          <span className="text-gray-400 text-xs mx-2">|</span>
                          <span className="text-gray-500 text-sm">{t.origin} → {t.destination}</span>
                          {t.delay_reason && <p className="text-orange-600 text-xs mt-1">{t.delay_reason}</p>}
                        </div>
                        <span className={badge(t.status)}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </>
        )}

        {/* ── Drivers ── */}
        {tab === 'drivers' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-display font-bold text-navy mb-6">All Drivers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Name','Email','Phone','Status','Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-3 text-gray-400 font-semibold text-xs uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drivers.map(d => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-3 font-semibold text-navy">{d.name}</td>
                      <td className="py-3 px-3 text-gray-500">{d.email}</td>
                      <td className="py-3 px-3 text-gray-500">{d.phone || '—'}</td>
                      <td className="py-3 px-3"><span className={badge(d.status)}>{d.status}</span></td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          {d.status !== 'approved' && (
                            <button onClick={() => driverAction(d.id,'approved')}
                              className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors">
                              <CheckCircle size={12}/> Approve
                            </button>
                          )}
                          {d.status !== 'rejected' && (
                            <button onClick={() => driverAction(d.id,'rejected')}
                              className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors">
                              <X size={12}/> Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Routes ── */}
        {tab === 'routes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-display font-bold text-navy mb-6">Route Approvals</h2>
            <div className="space-y-4">
              {routes.map(r => (
                <div key={r.id} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-primary/20 transition-colors">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-navy">{r.route_name}</h3>
                      <p className="font-body text-gray-500 text-sm mt-1">{r.origin} → {r.destination}</p>
                      <p className="font-body text-gray-400 text-xs mt-1">Driver: {r.driver_name}</p>
                      {r.admin_note && (
                        <p className="text-orange-600 text-xs mt-1 font-semibold">Note: {r.admin_note}</p>
                      )}
                    </div>
                    <div className="flex items-start gap-2 flex-wrap">
                      <span className={badge(r.status)}>{r.status}</span>
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => setEdit(r)}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-200">
                            <Edit3 size={12}/> Edit & Approve
                          </button>
                          <button onClick={() => routeAction(r.id,'approved')}
                            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-200">
                            <CheckCircle size={12}/> Approve
                          </button>
                          <button onClick={() => routeAction(r.id,'rejected')}
                            className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-200">
                            <X size={12}/> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editRoute && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="font-display font-bold text-navy text-xl mb-6">Edit Route Before Approving</h3>
            {[['route_name','Route Name'],['origin','From'],['destination','To'],['admin_note','Admin Note (optional)']].map(([k,l]) => (
              <div key={k} className="mb-4">
                <label className="block font-display font-semibold text-navy text-sm mb-1.5">{l}</label>
                <input className="input-field" value={editRoute[k]||''}
                  onChange={e => setEdit(x => ({ ...x, [k]: e.target.value }))}/>
              </div>
            ))}
            <div className="flex gap-3 mt-6">
              <button onClick={() => routeAction(editRoute.id,'approved',{
                route_name:editRoute.route_name, origin:editRoute.origin,
                destination:editRoute.destination, admin_note:editRoute.admin_note
              })} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                <CheckCircle size={16}/> Approve
              </button>
              <button onClick={() => setEdit(null)}
                className="flex-1 border-2 border-gray-200 text-gray-500 font-display font-semibold py-3 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}