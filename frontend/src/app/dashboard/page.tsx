'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

export default function DashboardPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('dashboard')

  // Placeholder user data
  const userData = {
    name: "Nama Pengguna",
    bmi: {
      value: 22.4,
      status: "Normal",
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
    alert('Menuju halaman profil pengguna.')
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
        {/* Header Card */}
        <div 
          className="w-full max-w-7xl mx-auto bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
          style={{ marginTop: "0.75rem" }}
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={handleProfileClick}
              className="bg-white bg-opacity-90 rounded-full p-2 flex items-center justify-center hover:bg-opacity-100 transition"
              style={{ width: "48px", height: "48px" }}
              title="Profil pengguna"
              aria-label="Profil pengguna"
            >
              <i className="fas fa-user-circle text-gray-600 text-2xl"></i>
            </button>
            <p className="text-gray-900 font-semibold text-base leading-tight max-w-xs">
              Halo,{' '}
              <button 
                onClick={handleProfileClick}
                className="text-blue-700 font-semibold hover:underline"
              >
                {userData.name}
              </button>
              !<br />
              <span className="text-gray-700 text-sm font-normal leading-tight">
                Selamat datang kembali di dashboard kesehatan Anda.
              </span>
            </p>
          </div>
          <div className="flex gap-10 text-center text-sm font-semibold text-gray-900">
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-red-600 transition-colors">
              <i className="fas fa-heart text-red-600 text-2xl"></i>
              <span>Kesehatan</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-green-600 transition-colors">
              <i className="fas fa-apple-alt text-green-600 text-2xl"></i>
              <span>Nutrisi</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors">
              <i className="fas fa-running text-blue-600 text-2xl"></i>
              <span>Aktivitas</span>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <section className="w-full max-w-7xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
          
          {/* BMI Card */}
          <div
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between"
            style={{ boxShadow: "5px 5px 0 #1E40AF" }}
          >
            <div className="flex items-center gap-3 text-blue-700 font-semibold text-base">
              <i className="fas fa-weight"></i>
              <span>BMI Anda Saat Ini</span>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-extrabold text-blue-900 leading-none">
                {userData.bmi.value}
              </p>
              <p className="text-green-600 font-semibold text-lg mt-2">
                {userData.bmi.status}
              </p>
              <p className="text-gray-600 text-sm mt-1 leading-tight">
                Terakhir diupdate: {userData.bmi.lastUpdate}
              </p>
            </div>
            <button
              onClick={handleBMIHistoryClick}
              className="mt-6 bg-blue-700 hover:bg-blue-800 text-white text-base font-semibold rounded-md py-3 flex items-center justify-center gap-3 transition duration-200"
              type="button"
            >
              <i className="fas fa-sync-alt"></i>
              Riwayat BMI
            </button>
          </div>

          {/* Calories Card */}
          <div
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between"
            style={{ boxShadow: "5px 5px 0 #DC2626" }}
          >
            <div className="flex items-center gap-3 text-red-600 font-semibold text-base">
              <i className="fas fa-fire"></i>
              <span>Total Kalori Hari Ini</span>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-extrabold text-red-900 leading-none">
                {userData.calories.current.toLocaleString()} kcal
              </p>
              <div
                className="w-full h-4 rounded-full bg-red-200 mt-3 overflow-hidden"
                aria-label="Progress menuju target kalori"
              >
                <div
                  className="h-4 bg-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${userData.calories.percentage}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-sm mt-2 leading-tight">
                Progres menuju target {userData.calories.target.toLocaleString()} kcal
              </p>
            </div>
            <button
              onClick={handleViewMealPlan}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white text-base font-semibold rounded-md py-3 flex items-center justify-center gap-3 transition duration-200"
              type="button"
            >
              <i className="fas fa-calendar-alt"></i>
              Rencana Makan
            </button>
          </div>

          {/* Macronutrients Card */}
          <div
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between"
            style={{ boxShadow: "5px 5px 0 #16A34A" }}
          >
            <div className="flex items-center gap-3 text-green-700 font-semibold text-base">
              <i className="fas fa-seedling"></i>
              <span>Makronutrien Hari Ini</span>
            </div>
            <div className="mt-5 space-y-5">
              <div>
                <div className="flex justify-between text-sm font-semibold text-green-700">
                  <span>Protein</span>
                  <span>{userData.macronutrients.protein.current}g</span>
                </div>
                <div className="w-full h-4 rounded-full bg-green-200 mt-2 overflow-hidden">
                  <div 
                    className="h-4 bg-green-600 rounded-full transition-all duration-300" 
                    style={{ width: `${userData.macronutrients.protein.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-green-700">
                  <span>Karbohidrat</span>
                  <span>{userData.macronutrients.carbs.current}g</span>
                </div>
                <div className="w-full h-4 rounded-full bg-green-200 mt-2 overflow-hidden">
                  <div 
                    className="h-4 bg-green-600 rounded-full transition-all duration-300" 
                    style={{ width: `${userData.macronutrients.carbs.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold text-green-700">
                  <span>Lemak</span>
                  <span>{userData.macronutrients.fat.current}g</span>
                </div>
                <div className="w-full h-4 rounded-full bg-green-200 mt-2 overflow-hidden">
                  <div 
                    className="h-4 bg-green-600 rounded-full transition-all duration-300" 
                    style={{ width: `${userData.macronutrients.fat.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="w-full max-w-7xl mx-auto mt-10 flex flex-wrap justify-center gap-6">
          <button
            onClick={handleCalculateBMI}
            className="bg-purple-700 hover:bg-purple-800 text-white text-base font-semibold rounded-md py-4 px-8 flex items-center gap-3 min-w-[160px] transition duration-200"
            type="button"
          >
            <i className="fas fa-calculator"></i>
            Hitung BMI Baru
          </button>
          <button
            className="bg-green-700 hover:bg-green-800 text-white text-base font-semibold rounded-md py-4 px-8 flex items-center gap-3 min-w-[160px] transition duration-200"
            type="button"
          >
            <i className="fas fa-search"></i>
            Cari Rekomendasi
          </button>
        </section>
      </main>
    </div>
  )
}