import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('lmt_user') || '{}')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// Auth
export const login           = (data)         => API.post('/auth/login', data)
export const register        = (data)         => API.post('/auth/register', data)
export const getProfile      = ()             => API.get('/auth/profile')

// Tracking
export const searchBuses     = (origin, dest) => API.get(`/tracking/search?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}`)
export const getTripLocation = (id)           => API.get(`/tracking/trip/${id}`)
export const subscribeBus    = (data)         => API.post('/tracking/subscribe', data)
export const unsubscribe     = (tripId)       => API.delete(`/tracking/subscribe/${tripId}`)
export const getRoutesData   = ()             => API.get('/tracking/routes-data')

// Driver
export const getMyBus        = ()             => API.get('/driver/bus')
export const registerBus     = (data)         => API.post('/driver/bus', data)
export const getMyRoutes     = ()             => API.get('/driver/routes')
export const createRoute     = (data)         => API.post('/driver/routes', data)
export const getMySchedules  = ()             => API.get('/driver/schedules')
export const createSchedule  = (data)         => API.post('/driver/schedules', data)
export const getActiveTrip   = ()             => API.get('/driver/trips/active')
export const startTrip       = (data)         => API.post('/driver/trips/start', data)
export const endTrip         = (id)           => API.patch(`/driver/trips/${id}/end`)
export const reportDelay     = (id, data)     => API.patch(`/driver/trips/${id}/delay`, data)
export const cancelTrip      = (id, data)     => API.patch(`/driver/trips/${id}/cancel`, data)
export const getMyTrips      = ()             => API.get('/driver/trips')
export const updateLocation  = (data)         => API.post('/tracking/update-location', data)

// Admin
export const getDrivers          = ()          => API.get('/admin/drivers')
export const updateDriverStatus  = (id, status)=> API.patch(`/admin/drivers/${id}/status`, { status })
export const getAdminRoutes      = ()          => API.get('/admin/routes')
export const updateRouteStatus   = (id, data)  => API.patch(`/admin/routes/${id}`, data)
export const getActiveTrips      = ()          => API.get('/admin/trips/active')
export const getTodayIncidents   = ()          => API.get('/admin/trips/today')