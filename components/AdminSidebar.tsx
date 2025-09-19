'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: '📊',
      active: pathname === '/admin'
    },
    {
      name: 'Pedidos',
      href: '/admin/pedidos',
      icon: '📋',
      active: pathname === '/admin/pedidos'
    },
    {
      name: 'Productos',
      href: '/admin/productos',
      icon: '🍕',
      active: pathname === '/admin/productos'
    },
    {
      name: 'Clientes',
      href: '/admin/clientes',
      icon: '👥',
      active: pathname === '/admin/clientes'
    },
    {
      name: 'Reportes',
      href: '/admin/reportes',
      icon: '📈',
      active: pathname === '/admin/reportes'
    },
    {
      name: 'Configuración',
      href: '/admin/configuracion',
      icon: '⚙️',
      active: pathname === '/admin/configuracion'
    }
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      })
      window.location.href = '/login'
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-text-primary">Admin</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                  ${item.active 
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' 
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                  }
                `}
                onClick={onClose}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
