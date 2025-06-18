'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

interface UserSettings {
  // Profile
  name: string
  email: string
  age: number
  gender: 'Pria' | 'Wanita'
  height: number
  currentWeight: number
  targetWeight: number
  
  // Goals & Preferences
  fitnessGoal: 'Menurunkan Berat' | 'Menambah Massa Otot' | 'Menjaga Kesehatan' | 'Meningkatkan Stamina'
  activityLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi'
  dietPreference: 'Omnivora' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Mediterranean'
  
  // Daily Targets
  dailyCalorieTarget: number
  proteinTarget: number
  carbsTarget: number
  fatTarget: number
}

export default function PengaturanPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('pengaturan')
  const [activeTab, setActiveTab] = useState('profile')

  // User settings state
  const [settings, setSettings] = useState<UserSettings>({
    // Profile
    name: 'Nama Pengguna',
    email: 'user@example.com',
    age: 25,
    gender: 'Pria',
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    
    // Goals
    fitnessGoal: 'Menjaga Kesehatan',
    activityLevel: 'Sedang',
    dietPreference: 'Omnivora',
    
    // Targets
    dailyCalorieTarget: 2000,
    proteinTarget: 150,
    carbsTarget: 250,
    fatTarget: 67
  })

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleSaveSettings = () => {
    // Simulate API call
    alert('Pengaturan berhasil disimpan!')
    console.log('Saving settings:', settings)
  }

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua pengaturan ke default?')) {
      // Reset logic here
      alert('Pengaturan berhasil direset ke default!')
    }
  }

  const calculateBMR = () => {
    // Mifflin-St Jeor Equation
    if (settings.gender === 'Pria') {
      return (10 * settings.currentWeight) + (6.25 * settings.height) - (5 * settings.age) + 5
    } else {
      return (10 * settings.currentWeight) + (6.25 * settings.height) - (5 * settings.age) - 161
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: 'fas fa-user' },
    { id: 'goals', label: 'Tujuan & Target', icon: 'fas fa-bullseye' }
  ]

  return (
    <div 
      className="flex min-h-screen"
      style={{
        background: "linear-gradient(135deg, #8ED0FF 0%, #0B4E9B 60%, #0A3A6B 100%)",
        minHeight: "100vh"
      }}
    >
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-cog text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
          </div>
        </header>

        {/* Horizontal Tabs Navigation */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <i className={`${tab.icon} text-lg`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Informasi Profil</h3>
                  <p className="text-gray-600">Kelola informasi dasar akun Anda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({...settings, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Usia</label>
                  <input
                    type="number"
                    value={settings.age}
                    onChange={(e) => setSettings({...settings, age: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="10" max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
                  <select
                    value={settings.gender}
                    onChange={(e) => setSettings({...settings, gender: e.target.value as 'Pria' | 'Wanita'})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={settings.height}
                    onChange={(e) => setSettings({...settings, height: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="100" max="250"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Berat Badan Saat Ini (kg)</label>
                  <input
                    type="number"
                    value={settings.currentWeight}
                    onChange={(e) => setSettings({...settings, currentWeight: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="30" max="300" step="0.1"
                  />
                </div>
              </div>

              {/* BMR Display */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  <i className="fas fa-fire mr-2"></i>Basal Metabolic Rate (BMR)
                </h4>
                <p className="text-blue-700">
                  BMR Anda: <strong>{Math.round(calculateBMR())} kalori/hari</strong>
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Ini adalah kalori yang dibutuhkan tubuh untuk fungsi dasar saat istirahat
                </p>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-bullseye text-white text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Tujuan & Target</h3>
                  <p className="text-gray-600">Atur target kesehatan dan fitness Anda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tujuan Fitness</label>
                  <select
                    value={settings.fitnessGoal}
                    onChange={(e) => setSettings({...settings, fitnessGoal: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Menurunkan Berat">Menurunkan Berat Badan</option>
                    <option value="Menambah Massa Otot">Menambah Massa Otot</option>
                    <option value="Menjaga Kesehatan">Menjaga Kesehatan</option>
                    <option value="Meningkatkan Stamina">Meningkatkan Stamina</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Level Aktivitas</label>
                  <select
                    value={settings.activityLevel}
                    onChange={(e) => setSettings({...settings, activityLevel: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Rendah">Rendah (Jarang olahraga)</option>
                    <option value="Sedang">Sedang (1-3x seminggu)</option>
                    <option value="Tinggi">Tinggi (4-6x seminggu)</option>
                    <option value="Sangat Tinggi">Sangat Tinggi (Setiap hari)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferensi Diet</label>
                  <select
                    value={settings.dietPreference}
                    onChange={(e) => setSettings({...settings, dietPreference: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Omnivora">Omnivora</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Keto">Keto</option>
                    <option value="Mediterranean">Mediterranean</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Target Berat Badan (kg)</label>
                  <input
                    type="number"
                    value={settings.targetWeight}
                    onChange={(e) => setSettings({...settings, targetWeight: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="30" max="300" step="0.1"
                  />
                </div>
              </div>

              {/* Daily Targets */}
              <div className="bg-green-50 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-4">Target Harian</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2">Kalori (kcal)</label>
                    <input
                      type="number"
                      value={settings.dailyCalorieTarget}
                      onChange={(e) => setSettings({...settings, dailyCalorieTarget: parseInt(e.target.value)})}
                      className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="1000" max="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2">Protein (g)</label>
                    <input
                      type="number"
                      value={settings.proteinTarget}
                      onChange={(e) => setSettings({...settings, proteinTarget: parseInt(e.target.value)})}
                      className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="50" max="300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2">Karbohidrat (g)</label>
                    <input
                      type="number"
                      value={settings.carbsTarget}
                      onChange={(e) => setSettings({...settings, carbsTarget: parseInt(e.target.value)})}
                      className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="50" max="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-green-700 mb-2">Lemak (g)</label>
                    <input
                      type="number"
                      value={settings.fatTarget}
                      onChange={(e) => setSettings({...settings, fatTarget: parseInt(e.target.value)})}
                      className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="20" max="200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save/Reset Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <i className="fas fa-save"></i>
              Simpan Pengaturan
            </button>
            <button
              onClick={handleResetToDefault}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center gap-2"
            >
              <i className="fas fa-undo"></i>
              Reset ke Default
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}