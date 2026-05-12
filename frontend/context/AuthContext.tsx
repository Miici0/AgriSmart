"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextType {
  user: any
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const isRedirecting = useRef(false)

  useEffect(() => {
    // Caricamento iniziale del token
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (loading) return

    const isLoginPage = pathname === '/login'

    if (!token && !isLoginPage) {
      if (!isRedirecting.current) {
        isRedirecting.current = true
        router.replace('/login')
      }
    } else if (token && isLoginPage) {
      if (!isRedirecting.current) {
        isRedirecting.current = true
        router.replace('/')
      }
    } else {
      isRedirecting.current = false
    }
  }, [token, pathname, loading, router])

  const login = (newToken: string) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
    isRedirecting.current = false
    router.push('/')
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    isRedirecting.current = false
    router.push('/login')
  }

  // Evita di renderizzare contenuti protetti se non siamo autenticati
  // Questo previene loop di chiamate API fallite
  if (loading) {
    return <div className="flex h-screen items-center justify-center text-green-700 font-bold">Inizializzazione...</div>
  }

  const isLoginPage = pathname === '/login'
  if (!token && !isLoginPage) {
    return null // Sarà reindirizzato dall'effetto
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
