"use client"

import Link from 'next/link'
import { LayoutDashboard, Trees, Tractor, Users, Settings } from 'lucide-react'

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 h-screen bg-green-800 text-white shadow-xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">AgroManager</h1>
        <p className="text-green-200 text-sm">Smart Farm Management</p>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link href="/" className="flex items-center p-3 rounded-lg hover:bg-green-700 transition-colors">
          <LayoutDashboard className="mr-3" size={20} />
          Dashboard
        </Link>
        <Link href="/fields" className="flex items-center p-3 rounded-lg hover:bg-green-700 transition-colors">
          <Trees className="mr-3" size={20} />
          Fields & Sensors
        </Link>
        <Link href="/vehicles" className="flex items-center p-3 rounded-lg hover:bg-green-700 transition-colors">
          <Tractor className="mr-3" size={20} />
          Vehicles
        </Link>
        <Link href="/employees" className="flex items-center p-3 rounded-lg hover:bg-green-700 transition-colors">
          <Users className="mr-3" size={20} />
          Employees
        </Link>
      </nav>
      <div className="p-4 border-t border-green-700">
        <Link href="/settings" className="flex items-center p-3 rounded-lg hover:bg-green-700 transition-colors">
          <Settings className="mr-3" size={20} />
          Settings
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
