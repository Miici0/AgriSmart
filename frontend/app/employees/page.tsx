"use client"

import { useState, useEffect } from 'react'
import { Plus, User, Award, ShieldCheck, X } from 'lucide-react'
import { api } from '@/lib/api'

export default function EmployeesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  
  const [formData, setFormData] = useState({ name: '', role: '', certifications: '', language: 'it' })

  useEffect(() => {
    loadEmployees()
  }, [])

  async function loadEmployees() {
    try {
      const data = await api.getEmployees()
      setEmployees(data)
    } catch (error) {
      console.error("Failed to load employees", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingEmployee(null)
    setFormData({ name: '', role: '', certifications: '', language: 'it' })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (emp: any) => {
    setEditingEmployee(emp)
    setFormData({ name: emp.name, role: emp.role, certifications: emp.certifications, language: emp.language || 'it' })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, { ...formData, farm_id: 0 })
      } else {
        await api.createEmployee({ ...formData, farm_id: 0 })
      }
      setIsModalOpen(false)
      loadEmployees()
    } catch (error) {
      console.error("Failed to save employee", error)
    }
  }

  if (loading) return <div className="text-green-700">Loading employees...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500">Personnel management and certifications</p>
        </div>
        <button 
          onClick={handleOpenAdd}
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
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded uppercase">{emp.language}</span>
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
                <button 
                  onClick={() => handleOpenEdit(emp)}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ))}
          {employees.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No employees registered.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                >
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Certifications (Patenti, Brevetti)</label>
                <textarea 
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black" 
                  rows={3}
                  value={formData.certifications}
                  onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                {editingEmployee ? 'Update Employee' : 'Save Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
