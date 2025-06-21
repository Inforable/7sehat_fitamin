'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ApiClient from '../../lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('');

    try {
      console.log('Sending login request...') // debugging
      const result = await ApiClient.login(formData)

      console.log('login result:', result) // debugging

      if (result.success) {
        console.log('Login successful, saving token and user data...') 
        
        try {
          // Backend return structure: {success: true, token: "...", user: {...}}
          localStorage.setItem('token', result.token)
          localStorage.setItem('user', JSON.stringify(result.user))
          
          console.log('Redirecting to dashboard...') 
          router.push('/dashboard')
          
        } catch (error) {
          console.error('Storage/redirect error:', error)
          setError('Login berhasil tapi terjadi kesalahan. Silakan refresh halaman.')
        }
      }
    } catch (error) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          Selamat Datang Kembali!
        </h1>

        {/* Subtitle */}
        <p className="text-text-gray text-sm mb-8">
          Masuk untuk melanjutkan perjalanan sehatmu dengan FitAaminn
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
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
              className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
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
  )
}