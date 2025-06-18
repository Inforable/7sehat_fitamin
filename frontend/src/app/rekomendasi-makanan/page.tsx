'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

interface FoodRecommendation {
  id: string
  name: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  image: string
  description: string
  benefits: string[]
  difficulty: 'Mudah' | 'Sedang' | 'Sulit'
  cookingTime: number
  ingredients: string[]
  tags: string[]
}

export default function RekomendasiMakananPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('rekomendasi-makanan')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedGoal, setSelectedGoal] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  // Data dummy rekomendasi makanan
  const [recommendations] = useState<FoodRecommendation[]>([
    {
      id: '1',
      name: 'Salad Quinoa Protein',
      category: 'Salad',
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 12,
      image: '/api/placeholder/300/200',
      description: 'Salad bergizi tinggi dengan quinoa, ayam grilled, dan sayuran segar',
      benefits: ['Tinggi Protein', 'Rendah Kalori', 'Kaya Serat'],
      difficulty: 'Mudah',
      cookingTime: 20,
      ingredients: ['Quinoa', 'Ayam fillet', 'Selada', 'Tomat cherry', 'Mentimun'],
      tags: ['Sehat', 'Protein Tinggi', 'Diet']
    },
    {
      id: '2',
      name: 'Smoothie Bowl Pisang',
      category: 'Minuman',
      calories: 280,
      protein: 12,
      carbs: 45,
      fat: 8,
      image: '/api/placeholder/300/200',
      description: 'Smoothie bowl segar dengan pisang, yogurt, dan topping granola',
      benefits: ['Tinggi Vitamin', 'Energi Cepat', 'Antioksidan'],
      difficulty: 'Mudah',
      cookingTime: 10,
      ingredients: ['Pisang beku', 'Yogurt Greek', 'Granola', 'Madu', 'Blueberry'],
      tags: ['Sehat', 'Energi', 'Sarapan']
    },
    {
      id: '3',
      name: 'Salmon Panggang Sayuran',
      category: 'Protein',
      calories: 420,
      protein: 35,
      carbs: 25,
      fat: 22,
      image: '/api/placeholder/300/200',
      description: 'Salmon panggang dengan bumbu herbs dan sayuran panggang',
      benefits: ['Omega-3', 'Protein Tinggi', 'Anti Inflamasi'],
      difficulty: 'Sedang',
      cookingTime: 35,
      ingredients: ['Salmon fillet', 'Brokoli', 'Wortel', 'Kentang', 'Herbs'],
      tags: ['Protein', 'Omega-3', 'Makan Malam']
    },
    {
      id: '4',
      name: 'Oatmeal Protein Berries',
      category: 'Sarapan',
      calories: 290,
      protein: 15,
      carbs: 38,
      fat: 9,
      image: '/api/placeholder/300/200',
      description: 'Oatmeal creamy dengan protein powder dan mixed berries',
      benefits: ['Serat Tinggi', 'Protein', 'Antioksidan'],
      difficulty: 'Mudah',
      cookingTime: 15,
      ingredients: ['Oats', 'Protein powder', 'Mixed berries', 'Susu almond', 'Chia seeds'],
      tags: ['Sarapan', 'Protein', 'Serat']
    },
    {
      id: '5',
      name: 'Buddha Bowl Veggie',
      category: 'Vegetarian',
      calories: 380,
      protein: 16,
      carbs: 52,
      fat: 14,
      image: '/api/placeholder/300/200',
      description: 'Buddha bowl penuh warna dengan berbagai sayuran dan tahini dressing',
      benefits: ['Kaya Nutrisi', 'Vegetarian', 'Anti Inflamasi'],
      difficulty: 'Sedang',
      cookingTime: 30,
      ingredients: ['Chickpeas', 'Sweet potato', 'Avocado', 'Kale', 'Tahini'],
      tags: ['Vegetarian', 'Sehat', 'Colorful']
    },
    {
      id: '6',
      name: 'Protein Pancakes',
      category: 'Sarapan',
      calories: 340,
      protein: 25,
      carbs: 30,
      fat: 12,
      image: '/api/placeholder/300/200',
      description: 'Pancakes tinggi protein dengan topping buah dan madu',
      benefits: ['Protein Tinggi', 'Energi', 'Muscle Building'],
      difficulty: 'Mudah',
      cookingTime: 20,
      ingredients: ['Protein powder', 'Telur', 'Oat flour', 'Pisang', 'Madu'],
      tags: ['Protein', 'Sarapan', 'Fitness']
    }
  ])

  const categories = ['Semua', 'Sarapan', 'Salad', 'Protein', 'Vegetarian', 'Minuman']
  const goals = ['Semua', 'Menurunkan Berat', 'Menambah Massa Otot', 'Menjaga Kesehatan', 'Meningkatkan Energi']

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleAddToMealPlan = (food: FoodRecommendation) => {
    alert(`"${food.name}" berhasil ditambahkan ke rencana makan!`)
    // Nanti bisa redirect ke rencana makan atau update state
  }

  const handleViewRecipe = (food: FoodRecommendation) => {
    alert(`Melihat resep untuk "${food.name}"`)
    // Nanti bisa buka modal atau navigate ke detail page
  }

  const filteredRecommendations = recommendations.filter(food => {
    const matchesCategory = selectedCategory === 'Semua' || food.category === selectedCategory
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGoal = selectedGoal === 'Semua' || 
                       (selectedGoal === 'Menurunkan Berat' && food.calories < 350) ||
                       (selectedGoal === 'Menambah Massa Otot' && food.protein > 20) ||
                       (selectedGoal === 'Menjaga Kesehatan' && food.benefits.includes('Kaya Nutrisi')) ||
                       (selectedGoal === 'Meningkatkan Energi' && food.benefits.includes('Energi'))
    
    return matchesCategory && matchesSearch && matchesGoal
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800'
      case 'Sedang': return 'bg-yellow-100 text-yellow-800'
      case 'Sulit': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
      <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-lightbulb text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Rekomendasi Makanan</h2>
          </div>
        </header>

        {/* Filters Section */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Search Bar */}
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-search mr-2"></i>Cari Makanan
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan nama atau deskripsi..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-tags mr-2"></i>Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Goal Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-target mr-2"></i>Tujuan
              </label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {goals.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <i className="fas fa-info-circle mr-1"></i>
              Menampilkan <strong>{filteredRecommendations.length}</strong> rekomendasi makanan
            </p>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-search text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada hasil</h3>
              <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            filteredRecommendations.map((food) => (
              <div key={food.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                
                {/* Food Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-utensils text-white text-4xl opacity-50"></i>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(food.difficulty)}`}>
                      {food.difficulty}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                      <i className="fas fa-clock mr-1"></i>{food.cookingTime} min
                    </span>
                  </div>
                </div>

                {/* Food Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{food.name}</h3>
                      <span className="text-sm text-blue-600 font-semibold">{food.category}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{food.description}</p>

                  {/* Nutrition Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <div className="text-red-600 font-bold text-lg">{food.calories}</div>
                      <div className="text-red-600 text-xs font-semibold">kcal</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-orange-600">Protein:</span>
                        <span className="font-semibold">{food.protein}g</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-600">Karbo:</span>
                        <span className="font-semibold">{food.carbs}g</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-yellow-600">Lemak:</span>
                        <span className="font-semibold">{food.fat}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {food.benefits.slice(0, 3).map((benefit, index) => (
                      <span key={index} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                        {benefit}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewRecipe(food)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                    >
                      <i className="fas fa-book mr-2"></i>Resep
                    </button>
                    <button
                      onClick={() => handleAddToMealPlan(food)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                    >
                      <i className="fas fa-plus mr-2"></i>Tambah
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}