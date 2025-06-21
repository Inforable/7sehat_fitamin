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
          <div className="bg-primary w-12 h-12 rounded-full flex items-center justify-center shadow-md">
            <i className="fas fa-location-arrow text-white text-xl"></i>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-black text-text-dark text-lg leading-tight mb-2" style={{ fontWeight: 900 }}>
          Jaga <br />
          Kesehatanmu, <br />
          Raih <br />
          Potensimu!
        </h1>

        {/* Subtitle */}
        <p className="text-text-gray text-xs mb-8">Selamat Datang di FitAaminn!</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan email Anda"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}