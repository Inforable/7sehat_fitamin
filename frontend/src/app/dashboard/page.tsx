'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import ApiClient from '../../lib/api'

interface UserProfile {
  id: string
  name: string
  email: string
  age: number | null
  gender: string | null
  height: number | null
  currentWeight: number | null
  targetWeight: number | null
  fitnessGoal: string | null
  bmi: number | null
  bmi_status: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [currentTime, setCurrentTime] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Get current user from backend and time
  useEffect(() => {
    fetchUserProfile()
    
    // Update time
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      let greeting = ''
      
      if (hours < 12) {
        greeting = 'Selamat Pagi'
      } else if (hours < 15) {
        greeting = 'Selamat Siang'
      } else if (hours < 18) {
        greeting = 'Selamat Sore'
      } else {
        greeting = 'Selamat Malam'
      }
      
      setCurrentTime(`${greeting}, ${now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`)
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const fetchUserProfile = async () => {
    try {
      const result = await ApiClient.getUserProfile()
      
      if (result.success) {
        setCurrentUser(result.user)
        // Also save name to localStorage for offline usage
        localStorage.setItem('userName', result.user.name)
      } else {
        // If token invalid, redirect to login
        if (result.message?.includes('token') || result.message?.includes('authorization')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('userName')
          router.push('/login')
          return
        }
        // Fallback to localStorage if API fails
        const savedName = localStorage.getItem('userName') || 'Pengguna'
        setCurrentUser({ 
          id: '', 
          name: savedName, 
          email: '', 
          age: null, 
          gender: null, 
          height: null, 
          currentWeight: null, 
          targetWeight: null, 
          fitnessGoal: null,
          bmi: null,
          bmi_status: null
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Fallback to localStorage
      const savedName = localStorage.getItem('userName') || 'Pengguna'
      setCurrentUser({ 
        id: '', 
        name: savedName, 
        email: '', 
        age: null, 
        gender: null, 
        height: null, 
        currentWeight: null, 
        targetWeight: null, 
        fitnessGoal: null,
        bmi: null,
        bmi_status: null
      })
    } finally {
      setIsLoading(false)
    }
  }

  // User data for display
  const userData = {
    name: currentUser?.name || "Nama Pengguna",
    bmi: {
      value: currentUser?.bmi || 22.4,
      status: currentUser?.bmi_status || "Normal",
      lastUpdate: "27 April 2024"
    },
    calories: {
      current: 1850,
      target: 2500,
      percentage: 74
    },
    macronutrients: {
      protein: { current: 120, percentage: 70 },
      carbs: { current: 250, percentage: 90 },
      fat: { current: 60, percentage: 50 }
    }
  }

  const handleProfileClick = () => {
    router.push('/profil')
  }

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleBMIHistoryClick = () => {
    router.push('/riwayat-bmi')
  }

  const handleCalculateBMI = () => {
    router.push('/hitung-bmi')
  }

  const handleViewMealPlan = () => {
    router.push('/rencana-makan')
  }

  const handleViewRecommendations = () => {
    router.push('/rekomendasi-makanan')
  }

  if (isLoading) {
    return (
      <div 
        className="flex h-screen items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #8ED0FF 0%, #0B4E9B 60%, #0A3A6B 100%)",
        }}
      >
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl">
          <i className="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
          <span className="text-gray-600 font-medium">Memuat dashboard...</span>
        </div>
      </div>
    )
  }

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
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Enhanced Header Card */}
        <div 
          className="w-full max-w-7xl mx-auto bg-gradient-to-r from-white/90 to-blue-50/80 backdrop-blur-md rounded-2xl p-4 md:p-5 shadow-xl border border-white/20"
          style={{ marginTop: "0.75rem" }}
        >
          {/* Compact Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Compact Profile Avatar */}
              <div className="relative">
                <button 
                  onClick={handleProfileClick}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                  style={{ width: "48px", height: "48px" }}
                  title="Klik untuk ke halaman profil"
                  aria-label="Profil pengguna"
                >
                  <i className="fas fa-user text-white text-lg"></i>
                </button>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
              </div>
              
              {/* Compact Welcome Message */}
              <div className="flex-1">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  Halo,{' '}
                  <button 
                    onClick={handleProfileClick}
                    className="text-blue-700 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                    title="Klik untuk ke halaman profil"
                  >
                    {userData.name}
                  </button>
                  !
                </h1>
                <p className="text-gray-600 text-xs md:text-sm font-medium">
                  {currentTime}
                </p>
                {currentUser?.email && (
                  <p className="text-gray-500 text-xs">
                    {currentUser.email}
                  </p>
                )}
              </div>
            </div>

            {/* Compact Quick Stats */}
            <div className="flex gap-4 lg:gap-5">
              <div className="text-center">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center mx-auto mb-1 shadow-lg">
                  <i className="fas fa-heart text-white text-sm md:text-base"></i>
                </div>
                <span className="text-xs font-semibold text-gray-700">Kesehatan</span>
                <p className="text-xs text-gray-500">{userData.bmi.status}</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center mx-auto mb-1 shadow-lg">
                  <i className="fas fa-apple-alt text-white text-sm md:text-base"></i>
                </div>
                <span className="text-xs font-semibold text-gray-700">Nutrisi</span>
                <p className="text-xs text-gray-500">{userData.calories.percentage}%</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center mx-auto mb-1 shadow-lg">
                  <i className="fas fa-running text-white text-sm md:text-base"></i>
                </div>
                <span className="text-xs font-semibold text-gray-700">Aktivitas</span>
                <p className="text-xs text-gray-500">Aktif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Container untuk konten body */}
        <div className="max-w-7xl mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg mt-6">
          {/* Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* BMI Card */}
            <div
              className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col justify-between"
              style={{ boxShadow: "5px 5px 0 #1E40AF" }}
            >
              <div className="flex items-center gap-3 text-blue-700 font-semibold text-sm md:text-base">
                <i className="fas fa-weight"></i>
                <span>BMI Anda Saat Ini</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl md:text-4xl font-extrabold text-blue-900 leading-none">
                  {userData.bmi.value}
                </p>
                <p className="text-green-600 font-semibold text-base md:text-lg mt-2">
                  {userData.bmi.status}
                </p>
                <p className="text-gray-600 text-xs md:text-sm mt-1 leading-tight">
                  {currentUser?.height && currentUser?.currentWeight ? 
                    `Berdasarkan tinggi ${currentUser.height} cm dan berat ${currentUser.currentWeight} kg` :
                    `Terakhir diupdate: ${userData.bmi.lastUpdate}`
                  }
                </p>
              </div>
              <button
                onClick={handleBMIHistoryClick}
                className="mt-4 md:mt-6 bg-blue-700 hover:bg-blue-800 text-white text-sm md:text-base font-semibold rounded-md py-2 md:py-3 flex items-center justify-center gap-3 transition duration-200"
                type="button"
              >
                <i className="fas fa-sync-alt"></i>
                Riwayat BMI
              </button>
            </div>

            {/* Calories Card */}
            <div
              className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col justify-between"
              style={{ boxShadow: "5px 5px 0 #DC2626" }}
            >
              <div className="flex items-center gap-3 text-red-600 font-semibold text-sm md:text-base">
                <i className="fas fa-fire"></i>
                <span>Total Kalori Hari Ini</span>
              </div>
              <div className="mt-4">
                <p className="text-3xl md:text-4xl font-extrabold text-red-900 leading-none">
                  {userData.calories.current.toLocaleString()} kcal
                </p>
                <div
                  className="w-full h-3 md:h-4 rounded-full bg-red-200 mt-3 overflow-hidden"
                  aria-label="Progress menuju target kalori"
                >
                  <div
                    className="h-3 md:h-4 bg-red-600 rounded-full transition-all duration-300"
                    style={{ width: `${userData.calories.percentage}%` }}
                  ></div>
                </div>
                <p className="text-gray-600 text-xs md:text-sm mt-2 leading-tight">
                  Progres menuju target {userData.calories.target.toLocaleString()} kcal
                </p>
              </div>
              <button
                onClick={handleViewMealPlan}
                className="mt-4 md:mt-6 bg-red-600 hover:bg-red-700 text-white text-sm md:text-base font-semibold rounded-md py-2 md:py-3 flex items-center justify-center gap-3 transition duration-200"
                type="button"
              >
                <i className="fas fa-calendar-alt"></i>
                Rencana Makan
              </button>
            </div>

            {/* Macronutrients Card */}
            <div
              className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col justify-between"
              style={{ boxShadow: "5px 5px 0 #16A34A" }}
            >
              <div className="flex items-center gap-3 text-green-700 font-semibold text-sm md:text-base">
                <i className="fas fa-seedling"></i>
                <span>Makronutrien Hari Ini</span>
              </div>
              <div className="mt-4 md:mt-5 space-y-4 md:space-y-5">
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-semibold text-green-700">
                    <span>Protein</span>
                    <span>{userData.macronutrients.protein.current}g</span>
                  </div>
                  <div className="w-full h-3 md:h-4 rounded-full bg-green-200 mt-2 overflow-hidden">
                    <div 
                      className="h-3 md:h-4 bg-green-600 rounded-full transition-all duration-300" 
                      style={{ width: `${userData.macronutrients.protein.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-semibold text-green-700">
                    <span>Karbohidrat</span>
                    <span>{userData.macronutrients.carbs.current}g</span>
                  </div>
                  <div className="w-full h-3 md:h-4 rounded-full bg-green-200 mt-2 overflow-hidden">
                    <div 
                      className="h-3 md:h-4 bg-green-600 rounded-full transition-all duration-300" 
                      style={{ width: `${userData.macronutrients.carbs.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs md:text-sm font-semibold text-green-700">
                    <span>Lemak</span>
                    <span>{userData.macronutrients.fat.current}g</span>
                  </div>
                  <div className="w-full h-3 md:h-4 rounded-full bg-green-200 mt-2 overflow-hidden">
                    <div 
                      className="h-3 md:h-4 bg-green-600 rounded-full transition-all duration-300" 
                      style={{ width: `${userData.macronutrients.fat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6">
            <button
              onClick={handleCalculateBMI}
              className="bg-purple-700 hover:bg-purple-800 text-white text-sm md:text-base font-semibold rounded-md py-3 md:py-4 px-6 md:px-8 flex items-center justify-center gap-3 min-w-[160px] transition duration-200"
              type="button"
            >
              <i className="fas fa-calculator"></i>
              Hitung BMI Baru
            </button>
            <button
              onClick={handleViewRecommendations}
              className="bg-green-700 hover:bg-green-800 text-white text-sm md:text-base font-semibold rounded-md py-3 md:py-4 px-6 md:px-8 flex items-center justify-center gap-3 min-w-[160px] transition duration-200"
              type="button"
            >
              <i className="fas fa-lightbulb"></i>
              Cari Rekomendasi
            </button>
          </section>
        </div>
      </main>
    </div>
  )
}