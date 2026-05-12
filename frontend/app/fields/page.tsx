"use client"

import { useState, useEffect } from 'react'
import { Plus, MapPin, X } from 'lucide-react'
import { api } from '@/lib/api'

export default function FieldsPage() {
  const [fields, setFields] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newField, setNewField] = useState({ name: '', location: '', crop_type: '' })
  const [selectedField, setSelectedField] = useState<any>(null)

  useEffect(() => {
    loadFields()
  }, [])

  async function loadFields() {
    try {
      const data = await api.getFields()
      setFields(data)
    } catch (error) {
      console.error("Failed to load fields", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.createField({ ...newField, farm_id: 0 }) // farm_id is forced by backend
      setIsModalOpen(false)
      setNewField({ name: '', location: '', crop_type: '' })
      loadFields()
    } catch (error) {
      console.error("Failed to add field", error)
    }
  }

  if (loading) return <div className="text-green-700">Loading fields...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fields & Sensors</h1>
          <p className="text-gray-500">Manage your land and monitoring equipment</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
        >
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
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedField(field)}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No fields found. Add your first field!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Field</h2>
            <form onSubmit={handleAddField} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Field Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={newField.name}
                  onChange={(e) => setNewField({...newField, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={newField.location}
                  onChange={(e) => setNewField({...newField, location: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Crop Type</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={newField.crop_type}
                  onChange={(e) => setNewField({...newField, crop_type: e.target.value})}
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                Register Field
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative">
            <button onClick={() => setSelectedField(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedField.name}</h2>
            <p className="text-gray-500 mb-6">{selectedField.location} • {selectedField.crop_type}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Field Sensors</h3>
              <p className="text-sm text-gray-600">Detailed sensor data integration coming soon.</p>
            </div>
            
            <button 
              onClick={() => setSelectedField(null)}
              className="mt-6 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
