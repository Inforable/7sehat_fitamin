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
  joinDate: string
}

export default function ProfilPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('profil')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // placeholder
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Nama Pengguna',
    email: 'user@example.com',
    age: 25,
    gender: 'Pria',
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    fitnessGoal: 'Menjaga Kesehatan',
    joinDate: '2024-01-15'
  })

  // Form data untuk editing
  const [formData, setFormData] = useState<UserProfile>({ ...profile })

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleEdit = () => {
    setFormData({ ...profile })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({ ...profile })
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setProfile({ ...formData })
      setIsEditing(false)
      setIsSaving(false)
      alert('Profil berhasil diupdate!')
    }, 1000)
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const currentBMI = calculateBMI()
  const bmiStatus = getBMIStatus(currentBMI)

  return (
    <div 
      className="flex h-screen"
      style={{
        background: "linear-gradient(135deg, #8ED0FF 0%, #0B4E9B 60%, #0A3A6B 100%)",
      }}
    >
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />

      {/* Main Content */}
      <main className="flex-1 p-5 overflow-hidden max-w-7xl mx-auto">
        {/* Header - Sama dengan Dashboard tapi sedikit kecil */}
        <header className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-md">
                <i className="fas fa-user text-white text-lg"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Profil Pengguna</h2>
            </div>
            
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <i className="fas fa-edit"></i>
                Edit Profil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Simpan
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Profile Content */}
        <div className="space-y-4 h-[calc(100vh-140px)] overflow-y-auto">
          
          {/* Profile Info Card + BMI Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            
            {/* Profile Info Card - 3 kolom */}
            <div className="lg:col-span-3 bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-user text-white text-lg"></i>
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-lg font-bold text-gray-900 mb-1 w-full border border-gray-300 rounded px-3 py-1"
                      placeholder="Nama lengkap"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{profile.name}</h3>
                  )}
                  <p className="text-gray-600 text-sm mb-2">{profile.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-semibold text-gray-700">Usia</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      className="block w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      min="1"
                      max="100"
                    />
                  ) : (
                    <div className="text-sm font-bold text-gray-900">{profile.age} tahun</div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-semibold text-gray-700">Gender</span>
                  {isEditing ? (
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value as 'Pria' | 'Wanita')}
                      className="block w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                    </select>
                  ) : (
                    <div className="text-sm font-bold text-gray-900">{profile.gender}</div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-semibold text-gray-700">Tinggi</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                      className="block w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      min="100"
                      max="250"
                    />
                  ) : (
                    <div className="text-sm font-bold text-gray-900">{profile.height} cm</div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-semibold text-gray-700">Bergabung</span>
                  <div className="text-sm font-bold text-gray-900">{formatJoinDate(profile.joinDate)}</div>
                </div>
              </div>

              <div className="mt-3 bg-gray-50 rounded-lg p-3">
                <span className="text-xs font-semibold text-gray-700">Tujuan Fitness</span>
                {isEditing ? (
                  <select
                    value={formData.fitnessGoal}
                    onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
                    className="block w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="Menurunkan Berat">Menurunkan Berat</option>
                    <option value="Menambah Massa Otot">Menambah Massa Otot</option>
                    <option value="Menjaga Kesehatan">Menjaga Kesehatan</option>
                    <option value="Meningkatkan Stamina">Meningkatkan Stamina</option>
                  </select>
                ) : (
                  <div className="text-sm font-bold text-gray-900">{profile.fitnessGoal}</div>
                )}
              </div>
            </div>

            {/* BMI Card - 1 kolom */}
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-5 shadow-lg">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i className="fas fa-chart-line text-blue-600 text-sm"></i>
                BMI Status
              </h4>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-weight text-blue-600 text-lg"></i>
                </div>
                <div className="text-2xl font-bold text-blue-900 mb-2">{currentBMI.toFixed(1)}</div>
                <div className={`text-sm font-semibold ${bmiStatus.color} mb-3`}>{bmiStatus.status}</div>
                <div className="text-xs text-gray-600">
                  Berdasarkan tinggi {profile.height} cm<br />
                  dan berat {profile.currentWeight} kg
                </div>
              </div>
            </div>
          </div>

          {/* Weight Section */}
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <i className="fas fa-weight text-green-600 text-sm"></i>
              Informasi Berat Badan
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-balance-scale text-blue-600 text-lg"></i>
                </div>
                {isEditing ? (
                  <div>
                    <input
                      type="number"
                      value={formData.currentWeight}
                      onChange={(e) => handleInputChange('currentWeight', parseFloat(e.target.value))}
                      className="text-xl font-bold text-gray-900 text-center border border-gray-300 rounded px-2 py-1 w-20"
                      min="30"
                      max="200"
                      step="0.1"
                    />
                    <span className="text-xl font-bold text-gray-900 ml-1">kg</span>
                  </div>
                ) : (
                  <div className="text-xl font-bold text-gray-900">{profile.currentWeight} kg</div>
                )}
                <div className="text-xs text-gray-600">Berat Saat Ini</div>
              </div>
              
              <div className="text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-bullseye text-green-600 text-lg"></i>
                </div>
                {isEditing ? (
                  <div>
                    <input
                      type="number"
                      value={formData.targetWeight}
                      onChange={(e) => handleInputChange('targetWeight', parseFloat(e.target.value))}
                      className="text-xl font-bold text-gray-900 text-center border border-gray-300 rounded px-2 py-1 w-20"
                      min="30"
                      max="200"
                      step="0.1"
                    />
                    <span className="text-xl font-bold text-gray-900 ml-1">kg</span>
                  </div>
                ) : (
                  <div className="text-xl font-bold text-gray-900">{profile.targetWeight} kg</div>
                )}
                <div className="text-xs text-gray-600">Target Berat</div>
              </div>
              
              <div className="text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  profile.currentWeight > profile.targetWeight ? 'bg-orange-100' : 'bg-purple-100'
                }`}>
                  <i className={`fas text-lg ${
                    profile.currentWeight > profile.targetWeight 
                      ? 'fa-arrow-down text-orange-600' 
                      : 'fa-arrow-up text-purple-600'
                  }`}></i>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {Math.abs(profile.currentWeight - profile.targetWeight)} kg
                </div>
                <div className="text-xs text-gray-600">
                  {profile.currentWeight > profile.targetWeight ? 'Perlu Turun' : 'Perlu Naik'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}