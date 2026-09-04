import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi, tokenStore, usersApi } from '../lib/api.js'

const AuthContext = createContext(null)
const SESSION_KEY = 'cc_session_user'

function readSessionUser() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null') } catch { return null }
}

function writeSessionUser(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  else localStorage.removeItem(SESSION_KEY)
}

function jwtUserId() {
  try {
    const token = tokenStore.getAccess()
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.user_id || payload.userId || payload.sub || null
  } catch { return null }
}

async function discoverUser(username, seededUser) {
  if (seededUser?.role) return { ...seededUser, id: seededUser.id || jwtUserId() }

  try {
    const { data } = await usersApi.adminUsers()
    const list = Array.isArray(data) ? data : data?.results || []
    const found = list.find((item) => item.username === username) || list[0]
    if (found) return { ...found, role: found.role || 'admin' }
  } catch { /* not admin */ }

  try {
    const { data: profile } = await usersApi.driverProfile()
    return {
      id: profile.user || jwtUserId(),
      username,
      role: 'driver',
      is_verified: true,
      driver_profile: profile,
    }
  } catch { /* likely rider */ }

  return { id: jwtUserId(), username, role: 'rider', is_verified: true }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSessionUser())
  const [loading, setLoading] = useState(Boolean(tokenStore.getAccess()))

  const signOut = useCallback(() => {
    tokenStore.clear()
    writeSessionUser(null)
    setUser(null)
  }, [])

  const hydrate = useCallback(async () => {
    if (!tokenStore.getAccess()) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const cached = readSessionUser()
      const resolved = await discoverUser(cached?.username, cached)
      writeSessionUser(resolved)
      setUser(resolved)
    } catch {
      signOut()
    } finally {
      setLoading(false)
    }
  }, [signOut])

  useEffect(() => {
    hydrate()
    const onExpired = () => signOut()
    window.addEventListener('carpool:auth-expired', onExpired)
    return () => window.removeEventListener('carpool:auth-expired', onExpired)
  }, [hydrate, signOut])

  const signIn = async ({ username, password }) => {
    const { data } = await authApi.signIn({ username, password })
    tokenStore.set(data)
    const cached = readSessionUser()
    const resolved = await discoverUser(username, cached?.username === username ? cached : null)
    writeSessionUser(resolved)
    setUser(resolved)
    return resolved
  }

  const signUp = async ({ username, email, password, role }) => {
    const { data } = await authApi.signUp({ username, email, password, role })
    const seed = { id: data?.id, username, email, role, is_verified: data?.is_verified ?? true }
    writeSessionUser(seed)
    await signIn({ username, password })
    return seed
  }

  const updateSessionUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      writeSessionUser(next)
      return next
    })
  }

  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    hydrate,
    updateSessionUser,
    isAuthenticated: Boolean(user && tokenStore.getAccess()),
    isAdmin: user?.role === 'admin',
    isDriver: user?.role === 'driver',
    isRider: user?.role === 'rider',
  }), [user, loading, hydrate, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
