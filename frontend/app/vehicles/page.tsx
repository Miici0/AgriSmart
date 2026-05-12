"use client"

import { useState } from 'react'
import { Plus, Tractor, Settings, X, Activity, Thermometer, Gauge } from 'lucide-react'

export default function VehiclesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vehicles, setVehicles] = useState([
    { id: 1, name: 'John Deere 5075E', model: '2022 Utility', license_plate: 'AG-123-XY', device_id: 'TRACTOR_001', status: 'Active', rpm: 1850, temp: 82, speed: 14.5 },
    { id: 2, name: 'New Holland T6', model: '2021 Performance', license_plate: 'AG-456-ZZ', device_id: 'TRACTOR_002', status: 'Active', rpm: 0, temp: 25, speed: 0 },
  ])

  const [newVehicle, setNewVehicle] = useState({ name: '', model: '', license_plate: '', device_id: '' })

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    setVehicles([...vehicles, { ...newVehicle, id: Date.now(), status: 'Active', rpm: 0, temp: 0, speed: 0 }])
    setIsModalOpen(false)
    setNewVehicle({ name: '', model: '', license_plate: '', device_id: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-500">Fleet monitoring and diagnostic management</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
        >
          <Plus className="mr-2" size={20} />
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-black">
            <div className="p-6 flex items-center border-b border-gray-50">
              <div className="bg-green-100 p-4 rounded-lg mr-6">
                <Tractor className="text-green-700" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{vehicle.name}</h3>
                <p className="text-gray-500 text-sm">{vehicle.model} • {vehicle.license_plate}</p>
                <p className="text-xs text-gray-400 mt-1">Device ID: {vehicle.device_id}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  vehicle.rpm > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {vehicle.rpm > 0 ? 'Online' : 'Idle'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50 p-4">
              <div className="flex flex-col items-center">
                <Activity size={16} className="text-blue-500 mb-1" />
                <span className="text-xs text-gray-500 uppercase font-semibold">RPM</span>
                <span className="font-bold text-gray-900">{vehicle.rpm}</span>
              </div>
              <div className="flex flex-col items-center">
                <Thermometer size={16} className="text-orange-500 mb-1" />
                <span className="text-xs text-gray-500 uppercase font-semibold">Temp</span>
                <span className="font-bold text-gray-900">{vehicle.temp}°C</span>
              </div>
              <div className="flex flex-col items-center">
                <Gauge size={16} className="text-purple-500 mb-1" />
                <span className="text-xs text-gray-500 uppercase font-semibold">Speed</span>
                <span className="font-bold text-gray-900">{vehicle.speed} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Plate</label>
                  <input 
                    type="text" 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                    value={newVehicle.license_plate}
                    onChange={(e) => setNewVehicle({...newVehicle, license_plate: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Device ID</label>
                  <input 
                    type="text" 
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                    value={newVehicle.device_id}
                    onChange={(e) => setNewVehicle({...newVehicle, device_id: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                Register Vehicle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
