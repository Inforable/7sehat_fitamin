'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

interface UserProfile {
  name: string
  email: string
  age: number
  gender: 'Pria' | 'Wanita'
  height: number
  currentWeight: number
  targetWeight: number
  fitnessGoal: 'Menurunkan Berat' | 'Menambah Massa Otot' | 'Menjaga Kesehatan' | 'Meningkatkan Stamina'
  activityLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi'
  dietPreference: 'Omnivora' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Mediterranean'
  dailyCalorieTarget: number
  proteinTarget: number
  carbsTarget: number
  fatTarget: number
  joinDate: string
}

export default function ProfilPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('profil')
  
  // Data profil - nanti akan diambil dari API/localStorage
  const [profile] = useState<UserProfile>({
    name: 'Nama Pengguna',
    email: 'user@example.com',
    age: 25,
    gender: 'Pria',
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    fitnessGoal: 'Menjaga Kesehatan',
    activityLevel: 'Sedang',
    dietPreference: 'Omnivora',
    dailyCalorieTarget: 2000,
    proteinTarget: 150,
    carbsTarget: 250,
    fatTarget: 67,
    joinDate: '2024-01-15'
  })

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleEditProfile = () => {
    router.push('/pengaturan')
  }

  const calculateBMI = () => {
    const heightInMeters = profile.height / 100
    return profile.currentWeight / (heightInMeters * heightInMeters)
  }

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Kurang', color: 'text-blue-600' }
    if (bmi < 25) return { status: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { status: 'Berlebih', color: 'text-yellow-600' }
    return { status: 'Obesitas', color: 'text-red-600' }
  }

  const calculateBMR = () => {
    if (profile.gender === 'Pria') {
      return (10 * profile.currentWeight) + (6.25 * profile.height) - (5 * profile.age) + 5
    } else {
      return (10 * profile.currentWeight) + (6.25 * profile.height) - (5 * profile.age) - 161
    }
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const currentBMI = calculateBMI()
  const bmiStatus = getBMIStatus(currentBMI)
  const currentBMR = calculateBMR()

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-md">
                <i className="fas fa-user text-white text-lg"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Profil Pengguna</h2>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <i className="fas fa-edit"></i>
              Edit Profil
            </button>
          </div>
        </header>

        {/* Profile Content */}
        <div className="space-y-6">
          
          {/* Top Section - Profile Card + Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Profile Info Card */}
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user text-white text-2xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h3>
                  <p className="text-gray-600 mb-3">{profile.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Usia:</span>
                      <div className="font-semibold text-gray-900">{profile.age} tahun</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender:</span>
                      <div className="font-semibold text-gray-900">{profile.gender}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Tinggi:</span>
                      <div className="font-semibold text-gray-900">{profile.height} cm</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Bergabung:</span>
                      <div className="font-semibold text-gray-900">{formatJoinDate(profile.joinDate)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-chart-line text-blue-600"></i>
                Statistik Cepat
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-weight text-white"></i>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">{currentBMI.toFixed(1)}</div>
                  <div className={`text-sm font-semibold ${bmiStatus.color}`}>BMI - {bmiStatus.status}</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-fire text-white"></i>
                  </div>
                  <div className="text-2xl font-bold text-red-900">{Math.round(currentBMR)}</div>
                  <div className="text-sm font-semibold text-red-600">BMR (kcal/hari)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Weight Progress Section */}
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <i className="fas fa-weight text-green-600"></i>
              Progress Berat Badan
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-balance-scale text-blue-600 text-xl"></i>
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile.currentWeight} kg</div>
                <div className="text-sm text-gray-600">Berat Saat Ini</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-bullseye text-green-600 text-xl"></i>
                </div>
                <div className="text-2xl font-bold text-gray-900">{profile.targetWeight} kg</div>
                <div className="text-sm text-gray-600">Target Berat</div>
              </div>
              
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  profile.currentWeight > profile.targetWeight ? 'bg-orange-100' : 'bg-purple-100'
                }`}>
                  <i className={`fas text-xl ${
                    profile.currentWeight > profile.targetWeight 
                      ? 'fa-arrow-down text-orange-600' 
                      : 'fa-arrow-up text-purple-600'
                  }`}></i>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.abs(profile.currentWeight - profile.targetWeight)} kg
                </div>
                <div className="text-sm text-gray-600">
                  {profile.currentWeight > profile.targetWeight ? 'Perlu Turun' : 'Perlu Naik'}
                </div>
              </div>
            </div>
          </div>

          {/* Goals & Targets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Goals & Preferences */}
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-bullseye text-green-600"></i>
                Tujuan & Preferensi
              </h4>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-target text-green-600"></i>
                    <span className="text-sm font-semibold text-gray-700">Tujuan Fitness</span>
                  </div>
                  <div className="text-gray-900 font-medium">{profile.fitnessGoal}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-running text-blue-600"></i>
                    <span className="text-sm font-semibold text-gray-700">Level Aktivitas</span>
                  </div>
                  <div className="text-gray-900 font-medium">{profile.activityLevel}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <i className="fas fa-apple-alt text-purple-600"></i>
                    <span className="text-sm font-semibold text-gray-700">Preferensi Diet</span>
                  </div>
                  <div className="text-gray-900 font-medium">{profile.dietPreference}</div>
                </div>
              </div>
            </div>

            {/* Daily Targets */}
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-chart-bar text-purple-600"></i>
                Target Harian
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-fire text-red-600"></i>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{profile.dailyCalorieTarget}</div>
                  <div className="text-xs text-gray-600">Kalori</div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-drumstick-bite text-orange-600"></i>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{profile.proteinTarget}g</div>
                  <div className="text-xs text-gray-600">Protein</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-bread-slice text-green-600"></i>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{profile.carbsTarget}g</div>
                  <div className="text-xs text-gray-600">Karbo</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-cheese text-yellow-600"></i>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{profile.fatTarget}g</div>
                  <div className="text-xs text-gray-600">Lemak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}