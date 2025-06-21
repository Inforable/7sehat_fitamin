'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ApiClient from '../../lib/api'
import Toast from '../../components/Toast'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'error' as 'success' | 'error' | 'warning'
  })

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    setToast({
      isVisible: true,
      message,
      type
    })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    if (!formData.email) {
      showToast('Email harus diisi!', 'warning')
      return false
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showToast('Format email tidak valid!', 'error')
      return false
    }

    if (!formData.password) {
      showToast('Password harus diisi!', 'warning')
      return false
    }

    if (formData.password.length < 3) {
      showToast('Password minimal 4 karakter!', 'error')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('Sending login request...') // debugging
      const result = await ApiClient.login(formData)

      console.log('login result:', result) // debugging

      if (result.success) {
        showToast('Login berhasil! Redirecting...', 'success')
        
        console.log('Login successful, saving token and user data...') 
        
        try {
          // Backend return structure: {success: true, token: "...", user: {...}}
          localStorage.setItem('token', result.token)
          localStorage.setItem('user', JSON.stringify(result.user))
          
          console.log('Redirecting to dashboard...') 
          
          // Delay redirect to show success message
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
          
        } catch (error) {
          console.error('Storage/redirect error:', error)
          showToast('Login berhasil tapi terjadi kesalahan. Silakan refresh halaman.', 'error')
        }
      } else {
        // Handle different error types
        if (result.message?.includes('Email')) {
          showToast(result.message, 'error')
        } else if (result.message?.includes('Password')) {
          showToast(result.message, 'error')
        } else {
          showToast(result.message || 'Login gagal! Periksa email dan password Anda.', 'error')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      showToast('Terjadi kesalahan jaringan. Silakan coba lagi.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gradient-start to-gradient-end px-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md py-10 px-10 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-heart text-white text-2xl"></i>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-black text-text-dark text-xl leading-tight mb-3" style={{ fontWeight: 900 }}>
            Selamat Datang!
          </h1>

          {/* Subtitle */}
          <p className="text-text-gray text-sm mb-8">
            Masuk untuk melanjutkan perjalanan sehatmu dengan FitAaminn
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors ${
                  error && error.includes('email') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors ${
                  error && error.includes('password') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-gray-600 mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Ingat saya
              </label>
              <Link href="#" className="text-primary hover:text-primary-hover">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white text-sm font-semibold rounded-md w-full py-3 hover:bg-primary-hover transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Masuk...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-xs">atau</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Register Link */}
          <p className="text-text-gray text-xs">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary font-semibold hover:text-primary-hover underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}