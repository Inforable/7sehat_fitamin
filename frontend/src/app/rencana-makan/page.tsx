'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

interface MealItem {
  id: string
  name: string
  portion: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface MealPlan {
  date: string
  meals: MealItem[]
}

export default function RencanaMakanPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('rencana-makan')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Placeholder meal plans data
  const [mealPlans] = useState<MealPlan[]>([
    {
      date: new Date().toISOString().split('T')[0],
      meals: [
        {
          id: '1',
          name: 'Nasi Goreng',
          portion: 1,
          calories: 350,
          protein: 8,
          carbs: 45,
          fat: 12
        },
        {
          id: '2',
          name: 'Ayam Bakar',
          portion: 1,
          calories: 280,
          protein: 35,
          carbs: 5,
          fat: 12
        },
        {
          id: '3',
          name: 'Sayur Bayam',
          portion: 1,
          calories: 45,
          protein: 4,
          carbs: 8,
          fat: 1
        },
        {
          id: '4',
          name: 'Buah Pisang',
          portion: 2,
          calories: 180,
          protein: 2,
          carbs: 46,
          fat: 1
        }
      ]
    }
  ])

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleAddMeal = () => {
    router.push('/tambah-makanan')
  }

  const handleEditMeal = (mealId: string) => {
    alert(`Edit makanan dengan ID: ${mealId}`)
  }

  const handleDeleteMeal = (mealId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus makanan ini?')) {
      alert(`Hapus makanan dengan ID: ${mealId}`)
    }
  }

  const getCurrentMealPlan = (): MealItem[] => {
    const plan = mealPlans.find(p => p.date === selectedDate)
    return plan ? plan.meals : []
  }

  const calculateTotals = (meals: MealItem[]) => {
    return meals.reduce((totals, meal) => ({
      calories: totals.calories + (meal.calories * meal.portion),
      protein: totals.protein + (meal.protein * meal.portion),
      carbs: totals.carbs + (meal.carbs * meal.portion),
      fat: totals.fat + (meal.fat * meal.portion)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const currentMeals = getCurrentMealPlan()
  const totals = calculateTotals(currentMeals)

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
        {/* Header - Sama dengan page lain */}
        <header className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-utensils text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Rencana Makan</h2>
          </div>
        </header>

        {/* Date Selector & Summary */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Date Selector */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const prevDate = new Date(selectedDate)
                  prevDate.setDate(prevDate.getDate() - 1)
                  setSelectedDate(prevDate.toISOString().split('T')[0])
                }}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className="text-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-2 border-blue-300 rounded-lg px-4 py-2 text-lg font-semibold text-gray-900 focus:outline-none focus:border-blue-500"
                />
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(selectedDate)}
                </p>
              </div>
              
              <button 
                onClick={() => {
                  const nextDate = new Date(selectedDate)
                  nextDate.setDate(nextDate.getDate() + 1)
                  setSelectedDate(nextDate.toISOString().split('T')[0])
                }}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            {/* Daily Summary */}
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Total Kalori: <strong>{totals.calories} kcal</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Protein: <strong>{totals.protein.toFixed(1)}g</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Karbohidrat: <strong>{totals.carbs.toFixed(1)}g</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">Lemak: <strong>{totals.fat.toFixed(1)}g</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Meal List Section */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
          
          {/* Section Header */}
          <div className="bg-blue-100 p-4 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-list text-white text-sm"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Daftar Makanan Hari Ini</h3>
              </div>
              <button
                onClick={handleAddMeal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Tambah Makanan
              </button>
            </div>
          </div>

          {/* Meal Items */}
          <div className="p-6">
            {currentMeals.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <i className="fas fa-utensils text-6xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum ada rencana makanan</h3>
                <p className="text-gray-500 mb-6">Mulai tambahkan makanan untuk hari ini</p>
                <button
                  onClick={handleAddMeal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Tambah Makanan Pertama
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentMeals.map((meal, index) => (
                  <div key={meal.id} className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      
                      {/* Meal Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <h4 className="text-lg font-bold text-gray-900">{meal.name}</h4>
                        </div>
                        
                        <div className="ml-11 flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-700">
                            <strong>Porsi:</strong> {meal.portion}
                          </span>
                          <span className="text-red-600">
                            <strong>Kalori:</strong> {(meal.calories * meal.portion)} kcal
                          </span>
                          <span className="text-orange-600">
                            <strong>Protein:</strong> {(meal.protein * meal.portion).toFixed(1)}g
                          </span>
                          <span className="text-green-600">
                            <strong>Karbohidrat:</strong> {(meal.carbs * meal.portion).toFixed(1)}g
                          </span>
                          <span className="text-yellow-600">
                            <strong>Lemak:</strong> {(meal.fat * meal.portion).toFixed(1)}g
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditMeal(meal.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md font-semibold transition-colors flex items-center gap-1"
                          title="Edit makanan"
                        >
                          <i className="fas fa-edit text-sm"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md font-semibold transition-colors flex items-center gap-1"
                          title="Hapus makanan"
                        >
                          <i className="fas fa-trash text-sm"></i>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add More Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleAddMeal}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    Tambah Makanan Lainnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}