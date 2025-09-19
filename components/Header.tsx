'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Verificar si hay una sesión activa
    const checkSession = async () => {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          // Aquí podrías verificar específicamente la sesión
          setIsLoggedIn(true)
        }
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkSession()
  }, [])

  return (
    <header className="bg-white shadow-soft border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-text-primary">Pollin Pedidos</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-text-secondary hover:text-primary-500 transition-colors">
              Inicio
            </Link>
            <Link href="#productos" className="text-text-secondary hover:text-primary-500 transition-colors">
              Productos
            </Link>
            <Link href="#contacto" className="text-text-secondary hover:text-primary-500 transition-colors">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link href="/admin" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="btn-outline">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
