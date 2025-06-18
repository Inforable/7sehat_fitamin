'use client'

import { useRouter } from 'next/navigation'

interface SidebarProps {
  activeMenu?: string
  onMenuClick?: (menu: string) => void
}

export default function Sidebar({ activeMenu = 'dashboard', onMenuClick }: SidebarProps) {
  const router = useRouter()
  
  const userData = {
    name: "Nama Pengguna"
  }

  const handleLogout = () => {
    router.push('/login')
  }

  const handleProfileClick = () => {
    alert('Menuju halaman profil pengguna.')
  }

  const handleMenuClick = (menu: string) => {
    if (onMenuClick) {
      onMenuClick(menu)
    }
    
    // Handle navigation
    switch (menu) {
      case 'dashboard':
        router.push('/dashboard')
        break
      case 'riwayat-bmi':
        router.push('/riwayat-bmi')
        break
      case 'hitung-bmi':
        router.push('/hitung-bmi')
        break
      default:
        console.log(`Navigate to ${menu}`)
    }
  }

  return (
    <aside 
      className="w-64 bg-white bg-opacity-20 backdrop-blur-md text-white flex flex-col"
      style={{ boxShadow: "4px 0 10px rgba(0,0,0,0.2)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white border-opacity-30">
        <h1 className="text-2xl font-bold tracking-wide">
          FitAaminn
        </h1>
        <button 
          onClick={handleLogout}
          className="text-white hover:text-red-400 transition-colors" 
          title="Logout"
          aria-label="Logout"
        >
          <i className="fas fa-sign-out-alt text-xl"></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-6 px-4 space-y-4">
        <button
          onClick={() => handleMenuClick('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeMenu === 'dashboard' 
              ? 'bg-white bg-opacity-30 font-semibold shadow-md' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
          <i className="fas fa-tachometer-alt text-lg"></i>
          <span>Dashboard</span>
        </button>
        
        <button
          onClick={() => handleMenuClick('kesehatan')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeMenu === 'kesehatan' 
              ? 'bg-white bg-opacity-30 font-semibold shadow-md' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
          <i className="fas fa-heartbeat text-lg"></i>
          <span>Kesehatan</span>
        </button>
        
        <button
          onClick={() => handleMenuClick('nutrisi')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeMenu === 'nutrisi' 
              ? 'bg-white bg-opacity-30 font-semibold shadow-md' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
          <i className="fas fa-apple-alt text-lg"></i>
          <span>Nutrisi</span>
        </button>
        
        <button
          onClick={() => handleMenuClick('aktivitas')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeMenu === 'aktivitas' 
              ? 'bg-white bg-opacity-30 font-semibold shadow-md' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
          <i className="fas fa-running text-lg"></i>
          <span>Aktivitas</span>
        </button>
        
        <button
          onClick={() => handleMenuClick('pengaturan')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeMenu === 'pengaturan' 
              ? 'bg-white bg-opacity-30 font-semibold shadow-md' 
              : 'hover:bg-white hover:bg-opacity-20'
          }`}
        >
          <i className="fas fa-cog text-lg"></i>
          <span>Pengaturan</span>
        </button>
      </nav>

      {/* Profile Section */}
      <div className="px-6 py-5 border-t border-white border-opacity-30">
        <button 
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-lg px-4 py-3 transition-colors"
          title="Profil pengguna"
          aria-label="Profil pengguna"
        >
          <img 
            /* Placeholder image URL, replace with actual user profile image */
            src="https://storage.googleapis.com/a1aa/image/a823d4e0-b99c-4ae4-e57d-531da562351c.jpg" 
            alt="Foto profil pengguna, lingkaran berwarna abu-abu dengan inisial" 
            className="rounded-full" 
            width="40" 
            height="40" 
          />
          <div className="text-left text-white">
            <p className="font-semibold text-sm leading-tight">
              {userData.name}
            </p>
            <p className="text-xs opacity-80 leading-tight">
              Lihat Profil
            </p>
          </div>
          <i className="fas fa-chevron-right ml-auto opacity-80"></i>
        </button>
      </div>
    </aside>
  )
}