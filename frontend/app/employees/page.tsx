"use client"

import { useState } from 'react'
import { Plus, User, Award, ShieldCheck, X } from 'lucide-react'

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Mario Rossi', role: 'Operator', certifications: 'Patente B, C, Patentino Fitosanitario' },
    { id: 2, name: 'Luigi Bianchi', role: 'Agronomist', certifications: 'Albo Agronomi, Brevetto Drone' },
  ])

  const [newEmployee, setNewEmployee] = useState({ name: '', role: '', certifications: '' })

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    setEmployees([...employees, { ...newEmployee, id: Date.now() }])
    setIsModalOpen(false)
    setNewEmployee({ name: '', role: '', certifications: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500">Personnel management and certifications</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
        >
          <Plus className="mr-2" size={20} />
          Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {employees.map((emp) => (
            <div key={emp.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start text-black">
              <div className="bg-green-100 p-3 rounded-full mr-6">
                <User className="text-green-700" size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="font-bold text-gray-900 text-lg mr-3">{emp.name}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{emp.role}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Award size={16} className="mr-2 text-yellow-600" />
                  <span className="font-medium mr-2">Certifications:</span>
                  {emp.certifications}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-green-600" title="Manage Permissions">
                  <ShieldCheck size={20} />
                </button>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm">Edit Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Certifications (Patenti, Brevetti)</label>
                <textarea 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  rows={3}
                  value={newEmployee.certifications}
                  onChange={(e) => setNewEmployee({...newEmployee, certifications: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                Save Employee
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
