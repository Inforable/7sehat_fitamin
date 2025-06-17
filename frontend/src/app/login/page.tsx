'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt:', { email, password })
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
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
            aria-label="Email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
            aria-label="Password"
          />
          <button
            type="submit"
            className="bg-primary text-white text-sm font-semibold rounded-md w-full py-2 hover:bg-primary-hover transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-primary text-xs mt-4">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold underline hover:text-primary-hover">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}