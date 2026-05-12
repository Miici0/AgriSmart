"use client"

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login for demo purposes
    // In a real app, call /token endpoint
    login('fake-jwt-token')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-md border border-green-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">AgroManager</h1>
          <p className="text-gray-600">Access your farm's AI dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
