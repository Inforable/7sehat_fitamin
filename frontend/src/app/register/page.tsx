'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validasi password match
    if (password !== confirmPassword) {
      alert('Password dan Konfirmasi Password tidak sama!')
      setIsLoading(false)
      return
    }

    try {
      // Handle register logic
      console.log('Register attempt:', { fullName, email, password })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to dashboard after successful registration
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Pendaftaran gagal! Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gradient-start to-gradient-end px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm py-10 px-8 text-center">
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
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
            aria-label="Nama Lengkap"
            disabled={isLoading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
            aria-label="Email"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
            aria-label="Password"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
            aria-label="Konfirmasi Password"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-primary text-white text-sm font-semibold rounded-md w-full py-2 hover:bg-primary-hover transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Loading...
              </>
            ) : (
              'Daftar'
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
  )
}