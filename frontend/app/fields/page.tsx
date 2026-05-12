"use client"

import { useState } from 'react'
import { Plus, Search, MapPin } from 'lucide-react'

export default function FieldsPage() {
  const [fields] = useState([
    { id: 1, name: 'North Field', location: 'Section A', crop_type: 'Corn', sensors: 3 },
    { id: 2, name: 'South Field', location: 'Section B', crop_type: 'Wheat', sensors: 5 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fields & Sensors</h1>
          <p className="text-gray-500">Manage your land and monitoring equipment</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors">
          <Plus className="mr-2" size={20} />
          Add Field
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Location</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Crop Type</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Sensors</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fields.map((field) => (
              <tr key={field.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{field.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-gray-400" />
                    {field.location}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{field.crop_type}</td>
                <td className="px-6 py-4 text-gray-600">{field.sensors} units</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
