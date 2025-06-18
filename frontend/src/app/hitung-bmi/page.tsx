'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

interface BMIResult {
  bmi: number
  status: string
  category: string
}

export default function HitungBMIPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('hitung-bmi')
  const [tinggi, setTinggi] = useState('')
  const [berat, setBerat] = useState('')
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null)
  const [showChart, setShowChart] = useState(false)

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  // Calculate BMI and determine status
  const calculateBMI = (weight: number, heightCm: number): BMIResult => {
    const heightM = heightCm / 100
    const bmi = weight / (heightM * heightM)
    
    let status = ''
    let category = ''
    
    if (bmi < 18.5) {
      status = 'Kurus'
      category = 'Underweight'
    } else if (bmi < 25) {
      status = 'Normal'
      category = 'Normal'
    } else if (bmi < 30) {
      status = 'Kelebihan Berat Badan'
      category = 'Overweight'
    } else {
      status = 'Obesitas'
      category = 'Obese'
    }
    
    return { bmi, status, category }
  }

  const handleHitungBMI = () => {
    if (!tinggi || !berat) {
      alert('Silakan masukkan tinggi dan berat badan Anda.')
      return
    }

    const tinggiNum = parseFloat(tinggi)
    const beratNum = parseFloat(berat)

    if (tinggiNum <= 0 || beratNum <= 0) {
      alert('Tinggi dan berat badan harus lebih dari 0.')
      return
    }

    if (tinggiNum < 50 || tinggiNum > 250) {
      alert('Tinggi badan harus antara 50-250 cm.')
      return
    }

    if (beratNum < 10 || beratNum > 300) {
      alert('Berat badan harus antara 10-300 kg.')
      return
    }

    const result = calculateBMI(beratNum, tinggiNum)
    setBmiResult(result)
  }

  const handleSimpanKeRiwayat = () => {
    if (!bmiResult) return

    alert('BMI berhasil disimpan ke riwayat!')
    router.push('/riwayat-bmi')
  }

  const resetForm = () => {
    setTinggi('')
    setBerat('')
    setBmiResult(null)
    setShowChart(false)
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
              <i className="fas fa-calculator text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Hitung BMI</h2>
          </div>
        </header>

        {/* Cards Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form Input BMI Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-edit text-blue-600"></i>
              <h3 className="text-lg font-semibold text-gray-800">Form Input BMI</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  value={tinggi}
                  onChange={(e) => setTinggi(e.target.value)}
                  placeholder="Masukkan tinggi badan"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="50"
                  max="250"
                />
                <span className="text-xs text-gray-500">cm</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  value={berat}
                  onChange={(e) => setBerat(e.target.value)}
                  placeholder="Masukkan berat badan"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="10"
                  max="300"
                  step="0.1"
                />
                <span className="text-xs text-gray-500">kg</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleHitungBMI}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-4 transition duration-200"
                >
                  Hitung BMI
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Hasil BMI Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-chart-line text-blue-600"></i>
              <h3 className="text-lg font-semibold text-gray-800">Hasil BMI Saat Ini</h3>
            </div>

            {!bmiResult ? (
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-gray-300 mb-2">-</div>
                <p className="text-gray-500 text-sm mb-4">
                  Masukkan tinggi dan berat badan untuk menghitung BMI Anda.
                </p>
                <div className="text-xs text-gray-400">
                  <p className="font-semibold mb-2">Contoh Kategori BMI:</p>
                  <p><span className="text-yellow-600">Kurus:</span> &lt; 18.5</p>
                  <p><span className="text-green-600">Normal:</span> 18.5 - 24.9</p>
                  <p><span className="text-orange-600">Kelebihan Berat Badan:</span> 25 - 29.9</p>
                  <p><span className="text-red-600">Obesitas:</span> ≥ 30</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {bmiResult.bmi.toFixed(1)}
                </div>
                <div className={`text-lg font-semibold mb-4 ${
                  bmiResult.status === 'Normal' ? 'text-green-600' :
                  bmiResult.status === 'Kurus' ? 'text-yellow-600' :
                  bmiResult.status === 'Kelebihan Berat Badan' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {bmiResult.status}
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Kategori: {bmiResult.category}
                </p>
                
                <div className="space-y-2">
                  <button
                    onClick={handleSimpanKeRiwayat}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg py-2 px-4 transition duration-200"
                  >
                    <i className="fas fa-save mr-2"></i>
                    Simpan ke Riwayat
                  </button>
                  <button
                    onClick={() => setShowChart(!showChart)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg py-2 px-4 transition duration-200"
                  >
                    <i className="fas fa-chart-bar mr-2"></i>
                    {showChart ? 'Sembunyikan' : 'Lihat'} Grafik
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Grafik Tren BMI Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <i className="fas fa-chart-area text-blue-600"></i>
              <h3 className="text-lg font-semibold text-gray-800">Grafik Tren BMI</h3>
            </div>

            {!showChart || !bmiResult ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <i className="fas fa-chart-line text-4xl"></i>
                </div>
                <p className="text-gray-500 text-sm">
                  {!bmiResult 
                    ? 'Hitung BMI terlebih dahulu untuk melihat grafik.'
                    : 'Klik "Lihat Grafik" untuk menampilkan tren BMI Anda.'
                  }
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">BMI Anda saat ini</p>
                  <div className="text-2xl font-bold text-blue-600">
                    {bmiResult.bmi.toFixed(1)}
                  </div>
                </div>
                
                {/* Simple BMI Scale Visualization */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span>Kurus</span>
                    <span>Normal</span>
                    <span>Berlebih</span>
                    <span>Obesitas</span>
                  </div>
                  
                  <div className="relative h-4 bg-gradient-to-r from-yellow-400 via-green-400 via-orange-400 to-red-400 rounded-full">
                    <div 
                      className="absolute top-0 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg transform -translate-y-0.5"
                      style={{ 
                        left: `${Math.min(Math.max((bmiResult.bmi - 15) / 20 * 100, 0), 100)}%`,
                        transform: 'translateX(-50%) translateY(-2px)'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>15</span>
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                    <span>35</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <i className="fas fa-info-circle mr-1"></i>
                    Posisi titik biru menunjukkan BMI Anda pada skala kategori kesehatan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}