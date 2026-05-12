"use client"

import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    fields: 0,
    sensors: 0,
    vehicles: 0,
    employees: 0,
    recommendations: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [fields, sensors, vehicles, employees, recommendations] = await Promise.all([
          api.getFields().catch(() => []),
          api.getSensors().catch(() => []),
          api.getVehicles().catch(() => []),
          api.getEmployees().catch(() => []),
          api.getRecommendations().catch(() => [])
        ])
        
        setStats({
          fields: fields?.length || 0,
          sensors: sensors?.length || 0,
          vehicles: vehicles?.length || 0,
          employees: employees?.length || 0,
          recommendations: Array.isArray(recommendations) ? recommendations : []
        })
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-full text-green-700">Loading Dashboard...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Farm Overview</h1>
        <p className="text-gray-500">Real-time agricultural insights & AI recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Fields" value={stats.fields} icon={<Activity className="text-blue-500" />} />
        <StatCard title="Active Sensors" value={stats.sensors} icon={<Activity className="text-green-500" />} />
        <StatCard title="Vehicles" value={stats.vehicles} icon={<Activity className="text-orange-500" />} />
        <StatCard title="Employees" value={stats.employees} icon={<Activity className="text-purple-500" />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" />
          Active AI Recommendations
        </h2>
        <div className="space-y-4">
          {stats.recommendations.map((rec: any) => (
            <div key={rec.id} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="mr-4 mt-1">
                {rec.type === 'treatment' ? <Activity className="text-green-600" /> : <AlertTriangle className="text-orange-600" />}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{rec.title}</h3>
                <p className="text-gray-600 text-sm">{rec.description}</p>
              </div>
              <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                Action
              </button>
            </div>
          ))}
          {stats.recommendations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
              <p>Everything is running smoothly!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}
