'use client'

import { useState } from 'react'
import Sidebar from '../../components/Sidebar'

interface BMIEntry {
  date: string
  weight: number
  height: number
  notes: string
}

export default function RiwayatBMIPage() {
  const [activeMenu, setActiveMenu] = useState('riwayat-bmi')
  const [bmiData] = useState<BMIEntry[]>([
    {
      date: '2024-04-27',
      weight: 68.5,
      height: 170,
      notes: 'Merasa lebih sehat dan bugar',
    },
    {
      date: '2024-03-15',
      weight: 70.2,
      height: 170,
      notes: 'Sedikit naik berat badan',
    },
    {
      date: '2024-02-10',
      weight: 69.0,
      height: 170,
      notes: '',
    },
  ])

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu)
  }

  // Calculate BMI and status
  const calculateBMI = (weight: number, heightCm: number): number => {
    const heightM = heightCm / 100
    return weight / (heightM * heightM)
  }

  const getStatus = (bmi: number): string => {
    if (bmi < 18.5) return 'Kurus'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Kelebihan Berat'
    return 'Obesitas'
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Normal': return 'text-green-600'
      case 'Kurus': return 'text-yellow-600'
      case 'Kelebihan Berat': return 'text-orange-600'
      case 'Obesitas': return 'text-red-600'
      default: return 'text-gray-700'
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
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
        <header className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-weight text-white text-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Riwayat BMI</h2>
          </div>
        </header>

        {/* Table Section */}
        <section className="mt-8 bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-900">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-3 px-4 font-semibold text-base">Tanggal</th>
                  <th className="py-3 px-4 font-semibold text-base">Berat (kg)</th>
                  <th className="py-3 px-4 font-semibold text-base">Tinggi (cm)</th>
                  <th className="py-3 px-4 font-semibold text-base">BMI</th>
                  <th className="py-3 px-4 font-semibold text-base">Status</th>
                  <th className="py-3 px-4 font-semibold text-base">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {bmiData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-600 py-8 text-lg">
                      Belum ada riwayat BMI.
                    </td>
                  </tr>
                ) : (
                  bmiData.map((entry, index) => {
                    const bmi = calculateBMI(entry.weight, entry.height)
                    const status = getStatus(bmi)
                    const statusColor = getStatusColor(status)

                    return (
                      <tr key={index} className="hover:bg-gray-100 cursor-default">
                        <td className="py-3 px-4">
                          {formatDate(entry.date)}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {entry.weight.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {entry.height.toFixed(1)}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-lg">
                          {bmi.toFixed(1)}
                        </td>
                        <td className={`py-3 px-4 font-semibold ${statusColor}`}>
                          {status}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate" title={entry.notes}>
                          {entry.notes || '-'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}