import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

export const tokenStore = {
  getAccess: () => localStorage.getItem('cc_access_token'),
  getRefresh: () => localStorage.getItem('cc_refresh_token'),
  set: ({ access, refresh }) => {
    if (access) localStorage.setItem('cc_access_token', access)
    if (refresh) localStorage.setItem('cc_refresh_token', refresh)
  },
  clear: () => {
    localStorage.removeItem('cc_access_token')
    localStorage.removeItem('cc_refresh_token')
  },
}

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing = null
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status !== 401 || original?._retry || !tokenStore.getRefresh()) {
      return Promise.reject(error)
    }

    original._retry = true
    refreshing ||= publicApi
      .post('/token/refresh/', { refresh: tokenStore.getRefresh() })
      .then(({ data }) => {
        tokenStore.set({ access: data.access })
        return data.access
      })
      .finally(() => {
        refreshing = null
      })

    try {
      const access = await refreshing
      original.headers.Authorization = `Bearer ${access}`
      return api(original)
    } catch (refreshError) {
      tokenStore.clear()
      localStorage.removeItem('cc_session_user')
      window.dispatchEvent(new Event('carpool:auth-expired'))
      return Promise.reject(refreshError)
    }
  },
)

export const authApi = {
  signIn: (credentials) => publicApi.post('/token/', credentials),
  signUp: (payload) => publicApi.post('/users/signup/', payload),
}

export const usersApi = {
  driverProfile: () => api.get('/users/driver-profile/me/'),
  createDriverProfile: (payload) => api.post('/users/driver-profile/', payload),
  emergencyContacts: () => api.get('/users/emergency-contact/list/'),
  createEmergencyContact: (payload) => api.post('/users/emergency-contact/', payload),
  createReport: (payload) => api.post('/users/reports/', payload),
  reportQueue: () => api.get('/users/admin/reports/queue/'),
  reportAction: (id, status, comment = '') =>
    api.post(`/users/admin/reports/${id}/action/`, { status, comment }),
  adminUsers: () => api.get('/users/admin/users/'),
  toggleVerification: (id, isVerified) =>
    api.post(`/users/admin/users/${id}/verify/`, { is_verified: isVerified }),
}

export const routesApi = {
  create: (payload) => api.post('/routes/', payload),
  mine: () => api.get('/routes/mine/'),
  detail: (id) => api.get(`/routes/${id}/`),
  update: (id, payload) => api.patch(`/routes/${id}/`, payload),
  remove: (id) => api.delete(`/routes/${id}/`),
  pause: (payload) => api.post('/routes/pause/', payload),
}

export const matchingApi = {
  find: (routeId) => api.get('/matching/find/', { params: routeId ? { route_id: routeId } : {} }),
  generate: (routeId) => api.post('/matching/generate/', routeId ? { route_id: routeId } : {}),
  requestRide: (payload) => api.post('/matching/request/', payload),
  mine: () => api.get('/matching/mine/'),
}

export const tripsApi = {
  mine: () => api.get('/trips/mine/'),
  actOnRequest: (matchId, action, date) =>
    api.post(`/trips/request/${matchId}/action/`, date ? { action, date } : { action }),
  onTheWay: (tripId) => api.post(`/trips/${tripId}/on-the-way/`),
  updateStatus: (tripId, status) => api.post(`/trips/${tripId}/status/`, { status }),
}

export const ratingsApi = {
  create: (payload) => api.post('/ratings/', payload),
  received: (userId) => api.get(`/ratings/user/${userId}/`),
}

export const notificationsApi = {
  list: (unreadOnly = false) => api.get('/notifications/', { params: unreadOnly ? { unread_only: true } : {} }),
  markRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllRead: () => api.post('/notifications/mark-all-read/'),
}

export function apiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const status = error?.response?.status
  const data = error?.response?.data

  if (!error?.response) return 'We could not connect right now. Please check your connection and try again.'
  if (status >= 500) return fallback
  if (status === 403) return 'You do not have permission to perform this action.'
  if (status === 404 && !data?.detail) return 'The requested information could not be found.'

  if (typeof data === 'string' && !data.trim().startsWith('<')) return data
  if (typeof data?.detail === 'string') return data.detail
  if (typeof data?.error === 'string') return data.error

  const firstKey = data && typeof data === 'object' ? Object.keys(data)[0] : null
  const firstValue = firstKey ? data[firstKey] : null
  if (Array.isArray(firstValue)) return firstValue.join(' ')
  if (typeof firstValue === 'string') return firstValue
  return fallback
}
