'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ApiClient from '../../lib/api'
import Toast from '../../components/Toast'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

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

  const handleInputChange = (setter: any, value: string) => {
    setter(value)
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = () => {
    // Check full name
    if (!fullName.trim()) {
      showToast('Nama lengkap harus diisi!', 'warning')
      return false
    }

    if (fullName.trim().length < 2) {
      showToast('Nama lengkap minimal 2 karakter!', 'error')
      return false
    }

    // Check email
    if (!email) {
      showToast('Email harus diisi!', 'warning')
      return false
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      showToast('Format email tidak valid!', 'error')
      return false
    }

    // Check password
    if (!password) {
      showToast('Password harus diisi!', 'warning')
      return false
    }

    if (password.length < 6) {
      showToast('Password minimal 6 karakter!', 'error')
      return false
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      showToast('Password harus mengandung huruf besar dan kecil!', 'error')
      return false
    }

    // Check confirm password
    if (!confirmPassword) {
      showToast('Konfirmasi password harus diisi!', 'warning')
      return false
    }

    if (password !== confirmPassword) {
      showToast('Password dan konfirmasi password tidak sama!', 'error')
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
      console.log('Sending register request...') // debugging
      const result = await ApiClient.register({
        name: fullName.trim(),
        email: email.toLowerCase(),
        password: password
      })

      console.log('register result:', result) // debugging

      if (result.success) {
        showToast('Registrasi berhasil! Welcome to FitAaminn!', 'success')
        
        try {
          // save token and user data to localStorage
          localStorage.setItem('token', result.token)
          localStorage.setItem('user', JSON.stringify(result.user))
          
          console.log('Redirecting to dashboard...')
          
          // Delay redirect to show success message
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
          
        } catch (error) {
          console.error('Storage/redirect error:', error)
          showToast('Registrasi berhasil tapi terjadi kesalahan. Silakan refresh halaman.', 'error')
        }
      } else {
        // Handle different error types
        if (result.message?.includes('Email sudah terdaftar')) {
          showToast('Email sudah terdaftar! Silakan gunakan email lain atau login.', 'error')
        } else if (result.message?.includes('email')) {
          showToast(result.message, 'error')
        } else {
          showToast(result.message || 'Registrasi gagal! Silakan coba lagi.', 'error')
        }
      }
    } catch (error) {
      console.error('Registration failed:', error)
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
            <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-user-plus text-white text-xl"></i>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-black text-text-dark text-lg leading-tight mb-2" style={{ fontWeight: 900 }}>
            Daftar Akun Baru
          </h1>

          {/* Subtitle */}
          <p className="text-text-gray text-xs mb-8">
            Bergabung dan raih potensimu bersama FitAaminn!
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={fullName}
                onChange={(e) => handleInputChange(setFullName, e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors ${
                  error && error.includes('nama') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => handleInputChange(setEmail, e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors ${
                  error && error.includes('email') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => handleInputChange(setPassword, e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors ${
                  error && error.includes('password') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                required
                disabled={isLoading}
              />
              {password && password.length > 0 && (
                <div className="mt-2 text-xs">
                  <div className={`flex items-center gap-2 ${password.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                    <i className={`fas ${password.length >= 6 ? 'fa-check' : 'fa-times'}`}></i>
                    <span>Minimal 6 karakter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${/(?=.*[a-z])(?=.*[A-Z])/.test(password) ? 'text-green-600' : 'text-red-600'}`}>
                    <i className={`fas ${/(?=.*[a-z])(?=.*[A-Z])/.test(password) ? 'fa-check' : 'fa-times'}`}></i>
                    <span>Huruf besar dan kecil</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => handleInputChange(setConfirmPassword, e.target.value)}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400 transition-colors ${
                  error && error.includes('konfirmasi') ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
                required
                disabled={isLoading}
              />
              {confirmPassword && (
                <div className="mt-2 text-xs">
                  <div className={`flex items-center gap-2 ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    <i className={`fas ${password === confirmPassword ? 'fa-check' : 'fa-times'}`}></i>
                    <span>{password === confirmPassword ? 'Password cocok' : 'Password tidak cocok'}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-primary text-white text-sm font-semibold rounded-md w-full py-2 hover:bg-primary-hover transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Mendaftar...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket"></i>
                  Daftar
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-primary text-xs mt-4">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold underline hover:text-primary-hover">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}