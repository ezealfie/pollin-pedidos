'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si hay una sesión válida
        const response = await fetch('/api/verify-session', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          router.push('/login')
          return
        }
        
        setUserName('Admin')
        setIsLoading(false)
      } catch (error) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <p className="text-gray-900 text-lg">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-gray-900">Gra-Hu Rotisería</h1>
              <p className="text-gray-600">Panel de Administración</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {userName ? userName.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{userName || 'Admin'}</p>
                <p className="text-xs text-gray-600">Administrador</p>
              </div>
            </div>
            
            <button
              onClick={async () => {
                try {
                  await fetch('/api/logout', { method: 'POST' })
                  window.location.href = '/login'
                } catch (error) {
                  console.error('Error al cerrar sesión:', error)
                }
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}