'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import ApiClient from '../../lib/api'

interface UserProfile {
  name: string
  email: string
  age: number | null
  gender: 'Pria' | 'Wanita' | null
  height: number | null
  currentWeight: number | null
  targetWeight: number | null
  fitnessGoal: 'Menurunkan Berat' | 'Menambah Massa Otot' | 'Menjaga Kesehatan' | 'Meningkatkan Stamina' | null
  joinDate: string | null
  bmi?: number | null
  bmiStatus?: string | null
}

export default function ProfilPage() {
  const router = useRouter()
  const [activeMenu, setActiveMenu] = useState('profil')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // default profile data
  const [profile, setProfile] = useState<UserProfile>({
    name:  '',
    email: '',
    age: null,
    gender: null,
    height: null,
    currentWeight: null,
    targetWeight: null,
    fitnessGoal: null,
    joinDate: null
  })

  // Form data untuk editing
  const [formData, setFormData] = useState<UserProfile>({ ...profile })

  // Load profile data from backend
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    setError('')
    try {
      const result = await ApiClient.getUserProfile()

      if (result.success) {
        setProfile(result.user)
        setFormData(result.user)
      } else {
        setError(result.message || 'Gagal memuat profil pengguna')
        // If token invalid, redirect to login
        if (result.message?.includes('token') || result.message?.includes('authorization')) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/login')
          return
        }
      }
    } catch (error) {
      setError('Terjadi kesalahan saat memuat profil pengguna')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  const handleEdit = () => {
    setFormData({ ...profile })
    setIsEditing(true)
    setError('')
  }

  const handleCancel = () => {
    setFormData({ ...profile })
    setIsEditing(false)
    setError('')
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    
    try {
      // Prepare data for update
      const updateData: any = {}
      
      if (formData.name !== profile.name) updateData.name = formData.name
      if (formData.age !== profile.age) updateData.age = formData.age
      if (formData.gender !== profile.gender) updateData.gender = formData.gender
      if (formData.height !== profile.height) updateData.height = formData.height
      if (formData.currentWeight !== profile.currentWeight) updateData.currentWeight = formData.currentWeight
      if (formData.targetWeight !== profile.targetWeight) updateData.targetWeight = formData.targetWeight
      if (formData.fitnessGoal !== profile.fitnessGoal) updateData.fitnessGoal = formData.fitnessGoal
      
      // If no changes, just exit edit mode
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false)
        setIsSaving(false)
        return
      }
      
      const result = await ApiClient.updateUserProfile(updateData)
      
      if (result.success) {
        setProfile(result.user)
        setFormData(result.user)
        setIsEditing(false)
        // Show success message
        alert('Profil berhasil diupdate!')
      } else {
        setError(result.message || 'Gagal mengupdate profil')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      setError('Terjadi kesalahan saat menyimpan')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calculateBMI = () => {
    if (!profile.height || !profile.currentWeight) return 0
    const heightInMeters = profile.height / 100
    return profile.currentWeight / (heightInMeters * heightInMeters)
  }

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: 'Kurang', color: 'text-blue-600' }
    if (bmi < 25) return { status: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { status: 'Berlebih', color: 'text-yellow-600' }
    return { status: 'Obesitas', color: 'text-red-600' }
  }

  const formatJoinDate = (dateString: string | null) => {
  if (!dateString) return 'N/A'
    try {
      // Add better date parsing
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  // Use backend BMI if available, otherwise calculate it
  const currentBMI = profile.bmi || calculateBMI()
  const bmiStatus = profile.bmiStatus ?
    { status: profile.bmiStatus, color: getBMIStatus(currentBMI).color } : 
    getBMIStatus(currentBMI)
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <i className="fas fa-spinner fa-spin text-blue-600 text-2xl"></i>
          <span className="text-gray-600">Memuat profil...</span>
        </div>
      </div>
    )
  }

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

          {/* Error message */}
          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          )}
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
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{profile.name || 'Name belum diisi'}</h3>
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
                      value={formData.age || ''}
                      onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
                      className="block w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      min="1"
                      max="100"
                      placeholder="Usia"
                    />
                  ) : (
                    <div className="text-sm font-bold text-gray-900">{profile.age} tahun</div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs font-semibold text-gray-700">Gender</span>
                  {isEditing ? (
                    <select
                      value={formData.gender || ''}
                      onChange={(e) => handleInputChange('gender', e.target.value || null)}
                      className="block w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">Pilih Gender</option>
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
                      value={formData.height || ''}
                      onChange={(e) => handleInputChange('height', e.target.value ? parseInt(e.target.value) : null)}
                      className="block w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                      min="100"
                      max="250"
                      placeholder="Tinggi (cm)"
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
                    value={formData.fitnessGoal || ''}
                    onChange={(e) => handleInputChange('fitnessGoal', e.target.value || null)}
                    className="block w-full mt-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">Pilih Tujuan</option>
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
                {currentBMI > 0 ? (
                  <>
                    <div className="text-2xl font-bold text-blue-900 mb-2">{currentBMI.toFixed(1)}</div>
                    <div className={`text-sm font-semibold ${bmiStatus.color} mb-3`}>{bmiStatus.status}</div>
                    <div className="text-xs text-gray-600">
                      Berdasarkan tinggi {profile.height || '-'} cm<br />
                      dan berat {profile.currentWeight || '-'} kg
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-gray-500">
                    Isi tinggi dan berat badan<br />
                    untuk melihat BMI
                  </div>
                )}
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
                      value={formData.currentWeight || ''}
                      onChange={(e) => handleInputChange('currentWeight', e.target.value ? parseFloat(e.target.value) : null)}
                      className="text-xl font-bold text-gray-900 text-center border border-gray-300 rounded px-2 py-1 w-20"
                      min="30"
                      max="200"
                      step="0.1"
                      placeholder="berat (kg)"
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
                      value={formData.targetWeight || ''}
                      onChange={(e) => handleInputChange('targetWeight', e.target.value ? parseFloat(e.target.value) : null)}
                      className="text-xl font-bold text-gray-900 text-center border border-gray-300 rounded px-2 py-1 w-20"
                      min="30"
                      max="200"
                      step="0.1"
                      placeholder='target (kg)'
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
                  profile.currentWeight && profile.targetWeight ? 
                    (profile.currentWeight > profile.targetWeight ? 'bg-orange-100' : 'bg-purple-100') : 
                    'bg-gray-100'
                }`}>
                  <i className={`fas text-lg ${
                    profile.currentWeight && profile.targetWeight ?
                      (profile.currentWeight > profile.targetWeight 
                        ? 'fa-arrow-down text-orange-600' 
                        : 'fa-arrow-up text-purple-600') :
                      'fa-question text-gray-400'
                  }`}></i>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {profile.currentWeight && profile.targetWeight ? 
                    `${Math.abs(profile.currentWeight - profile.targetWeight)} kg` : 
                    'Belum diisi'
                  }
                </div>
                <div className="text-xs text-gray-600">
                  {profile.currentWeight && profile.targetWeight ?
                    (profile.currentWeight > profile.targetWeight ? 'Perlu Turun' : 'Perlu Naik') :
                    'Selisih Target'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}