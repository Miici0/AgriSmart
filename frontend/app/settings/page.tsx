"use client"

import { useState } from 'react'
import { Settings as SettingsIcon, Globe, Lock, Bell, Shield } from 'lucide-react'

export default function SettingsPage() {
  const [language, setLanguage] = useState('it')
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and system configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <nav className="flex flex-col space-y-1">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg">
              <Globe className="mr-3" size={18} />
              General & Language
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <Lock className="mr-3" size={18} />
              Security
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <Bell className="mr-3" size={18} />
              Notifications
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              <Shield className="mr-3" size={18} />
              Privacy
            </button>
          </nav>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">General Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System Language</label>
                  <select 
                    className="block w-full max-w-xs border border-gray-300 rounded-md p-2 text-black"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="it">Italiano (Italian)</option>
                    <option value="en">English (English)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="fr">Français (French)</option>
                  </select>
                  <p className="mt-2 text-xs text-gray-400">Select the default language for the dashboard and reports.</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Measurement Units</h3>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="units" className="text-green-600 focus:ring-green-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-600">Metric (km/h, °C, hectares)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="units" className="text-green-600 focus:ring-green-500" />
                      <span className="ml-2 text-sm text-gray-600">Imperial (mph, °F, acres)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
