'use client'

import { useState, useEffect } from 'react'
import { updatePreciosMilanesa, getPreciosMilanesa, updateIngredientes, getIngredientes } from '@/lib/data'

// Tipos para TypeScript
interface PedidoItem {
  tipo: string
  nombre: string
  cantidad: number
  precio: number
  ingredientes?: string[]
}

interface Pedido {
  id: string
  cliente: string
  hora: string
  direccion: string
  metodoPago: string
  items: PedidoItem[]
  total: number
  entregado: boolean
  notas?: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [ingredientes, setIngredientes] = useState([
    { id: 1, nombre: 'Lechuga', precio: 0, emoji: '🥬' },
    { id: 2, nombre: 'Tomate', precio: 0, emoji: '🍅' },
    { id: 3, nombre: 'Cebolla', precio: 0, emoji: '🧅' },
    { id: 4, nombre: 'Huevo frito', precio: 0, emoji: '🍳' },
    { id: 5, nombre: 'Jamón', precio: 0, emoji: '🍖' },
    { id: 6, nombre: 'Queso', precio: 0, emoji: '🧀' },
    { id: 7, nombre: 'Mayonesa', precio: 0, emoji: '🥄' },
    { id: 8, nombre: 'Mostaza', precio: 0, emoji: '🟡' },
    { id: 9, nombre: 'Ketchup', precio: 0, emoji: '🍅' },
    { id: 10, nombre: 'Pepinillos', precio: 0, emoji: '🥒' }
  ])
  const [ingredientesTemporales, setIngredientesTemporales] = useState([
    { id: 1, nombre: 'Lechuga', precio: 0, emoji: '🥬' },
    { id: 2, nombre: 'Tomate', precio: 0, emoji: '🍅' },
    { id: 3, nombre: 'Cebolla', precio: 0, emoji: '🧅' },
    { id: 4, nombre: 'Huevo frito', precio: 0, emoji: '🍳' },
    { id: 5, nombre: 'Jamón', precio: 0, emoji: '🍖' },
    { id: 6, nombre: 'Queso', precio: 0, emoji: '🧀' },
    { id: 7, nombre: 'Mayonesa', precio: 0, emoji: '🥄' },
    { id: 8, nombre: 'Mostaza', precio: 0, emoji: '🟡' },
    { id: 9, nombre: 'Ketchup', precio: 0, emoji: '🍅' },
    { id: 10, nombre: 'Pepinillos', precio: 0, emoji: '🥒' }
  ])
  
  const [combos, setCombos] = useState([
    {
      id: 1,
      nombre: 'Sándwich Completo',
      descripcion: 'Milanesa + lechuga + tomate + cebolla + huevo + jamón + queso + mayonesa',
      precio: 0,
      ingredientes: [1, 2, 3, 4, 5, 6, 7]
    },
    {
      id: 2,
      nombre: 'Sándwich Clásico',
      descripcion: 'Milanesa + lechuga + tomate + cebolla + mayonesa',
      precio: 0,
      ingredientes: [1, 2, 3, 7]
    },
    {
      id: 3,
      nombre: 'Sándwich Especial',
      descripcion: 'Milanesa + lechuga + tomate + huevo + queso + mayonesa + mostaza',
      precio: 0,
      ingredientes: [1, 2, 4, 6, 7, 8]
    }
  ])

  const [preciosMilanesa, setPreciosMilanesa] = useState({
    pollo: 0,
    carne: 0
  })
  const [preciosTemporales, setPreciosTemporales] = useState({
    pollo: 0,
    carne: 0
  })
  const [papasFritas, setPapasFritas] = useState({ precio: 400 })
  const [papasFritasTemporal, setPapasFritasTemporal] = useState({ precio: 400 })

  const [nuevoIngrediente, setNuevoIngrediente] = useState({ nombre: '', precio: 0, emoji: '🥗' })
  const [nuevoCombo, setNuevoCombo] = useState({ nombre: '', descripcion: '', precio: 0, ingredientes: [] as number[] })
  const [cambioPassword, setCambioPassword] = useState({ actual: '', nueva: '', confirmar: '' })
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: '', tipo: 'success' })

  const mostrarNotificacion = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setNotificacion({ mostrar: true, mensaje, tipo })
    setTimeout(() => {
      setNotificacion({ mostrar: false, mensaje: '', tipo: 'success' })
    }, 3000)
  }

  // Cargar pedidos desde la API
  const cargarPedidos = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (response.ok) {
        // Convertir los datos de la API al formato esperado
        const pedidosFormateados = data.orders.map((pedido: any) => ({
          id: pedido.id,
          cliente: pedido.customer_name,
          direccion: 'Dirección no disponible', // Ya no se pide dirección
          hora: pedido.delivery_time,
          metodoPago: pedido.payment_method,
          total: pedido.total_amount,
          items: pedido.items.map((item: any) => ({
            tipo: item.tipo,
            nombre: item.nombre,
            cantidad: 1,
            precio: item.precio,
            ingredientes: item.ingredientes || []
          })),
          notas: pedido.notes || '',
          entregado: pedido.status === 'delivered'
        }))
        setPedidos(pedidosFormateados)
      } else {
        console.error('Error al cargar pedidos:', data.error)
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
    }
  }

  // Cargar datos desde la base de datos
  const cargarDatosAdmin = async () => {
    try {
      // Cargar ingredientes
      const ingredientesResponse = await fetch('/api/ingredientes')
      if (ingredientesResponse.ok) {
        const ingredientesData = await ingredientesResponse.json()
        setIngredientes(ingredientesData.ingredientes)
        setIngredientesTemporales(ingredientesData.ingredientes)
      }

      // Cargar precios de milanesas
      const preciosResponse = await fetch('/api/precios-milanesas')
      if (preciosResponse.ok) {
        const preciosData = await preciosResponse.json()
        setPreciosMilanesa(preciosData.precios)
        setPreciosTemporales(preciosData.precios)
      }
    } catch (error) {
      console.error('Error al cargar datos del admin:', error)
    }
  }

  // Cargar pedidos al montar el componente
  useEffect(() => {
    cargarPedidos()
    cargarDatosAdmin()
  }, [])

  const agregarIngrediente = async () => {
    if (!nuevoIngrediente.nombre || nuevoIngrediente.precio <= 0) {
      mostrarNotificacion('Completa todos los campos correctamente', 'error')
      return
    }
    
    try {
      const response = await fetch('/api/ingredientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoIngrediente),
      })

      if (response.ok) {
        mostrarNotificacion('Ingrediente agregado correctamente')
        setNuevoIngrediente({ nombre: '', precio: 0, emoji: '🥗' })
        cargarDatosAdmin() // Recargar datos
      } else {
        mostrarNotificacion('Error al agregar ingrediente', 'error')
      }
    } catch (error) {
      mostrarNotificacion('Error de conexión', 'error')
    }
  }

  const editarIngrediente = (id: number, campo: string, valor: any) => {
    setIngredientesTemporales(ingredientesTemporales.map(ing => 
      ing.id === id ? { ...ing, [campo]: valor } : ing
    ))
  }

  const eliminarIngrediente = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este ingrediente?')) {
      setIngredientesTemporales(ingredientesTemporales.filter(ing => ing.id !== id))
      mostrarNotificacion('Ingrediente eliminado (recuerda guardar los cambios)')
    }
  }

  const agregarCombo = () => {
    if (!nuevoCombo.nombre || nuevoCombo.precio <= 0 || nuevoCombo.ingredientes.length === 0) {
      mostrarNotificacion('Completa todos los campos correctamente', 'error')
      return
    }
    
    const id = Math.max(...combos.map(c => c.id)) + 1
    setCombos([...combos, { ...nuevoCombo, id }])
    setNuevoCombo({ nombre: '', descripcion: '', precio: 0, ingredientes: [] })
    mostrarNotificacion('Combo agregado correctamente')
  }

  const editarCombo = (id: number, campo: string, valor: any) => {
    setCombos(combos.map(combo => 
      combo.id === id ? { ...combo, [campo]: valor } : combo
    ))
  }

  const eliminarCombo = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este combo?')) {
      setCombos(combos.filter(combo => combo.id !== id))
      mostrarNotificacion('Combo eliminado')
    }
  }

  const toggleIngredienteCombo = (comboId: number, ingredienteId: number) => {
    const combo = combos.find(c => c.id === comboId)
    if (!combo) return
    const ingredientesActuales = combo.ingredientes
    
    if (ingredientesActuales.includes(ingredienteId)) {
      setCombos(combos.map(c => 
        c.id === comboId 
          ? { ...c, ingredientes: ingredientesActuales.filter(id => id !== ingredienteId) }
          : c
      ))
    } else {
      setCombos(combos.map(c => 
        c.id === comboId 
          ? { ...c, ingredientes: [...ingredientesActuales, ingredienteId] }
          : c
      ))
    }
  }

  const guardarPrecios = async () => {
    try {
      const response = await fetch('/api/precios-milanesas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ precios: preciosTemporales }),
      })

      if (response.ok) {
        setPreciosMilanesa(preciosTemporales)
        mostrarNotificacion('Precios actualizados correctamente')
        cargarDatosAdmin() // Recargar datos
      } else {
        mostrarNotificacion('Error al actualizar precios', 'error')
      }
    } catch (error) {
      mostrarNotificacion('Error de conexión', 'error')
    }
  }

  const cancelarCambiosPrecios = () => {
    setPreciosTemporales(preciosMilanesa)
    mostrarNotificacion('Cambios cancelados')
  }

  const guardarIngredientes = async () => {
    try {
      // Actualizar cada ingrediente que haya cambiado
      const updates = ingredientesTemporales.map(async (ingrediente) => {
        const original = ingredientes.find(ing => ing.id === ingrediente.id)
        if (original && (
          original.nombre !== ingrediente.nombre ||
          original.precio !== ingrediente.precio ||
          original.emoji !== ingrediente.emoji
        )) {
          const response = await fetch('/api/ingredientes', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ingrediente),
          })
          return response.ok
        }
        return true
      })

      const results = await Promise.all(updates)
      if (results.every(result => result)) {
        mostrarNotificacion('Ingredientes actualizados correctamente')
        cargarDatosAdmin() // Recargar datos
      } else {
        mostrarNotificacion('Error al actualizar algunos ingredientes', 'error')
      }
    } catch (error) {
      mostrarNotificacion('Error de conexión', 'error')
    }
  }

  const cancelarCambiosIngredientes = () => {
    setIngredientesTemporales(ingredientes)
    mostrarNotificacion('Cambios cancelados')
  }

  const guardarPapasFritas = () => {
    setPapasFritas(papasFritasTemporal)
    mostrarNotificacion('Precio de papas fritas actualizado correctamente')
  }

  const cancelarCambiosPapasFritas = () => {
    setPapasFritasTemporal(papasFritas)
    mostrarNotificacion('Cambios cancelados')
  }

  const cambiarPassword = async () => {
    if (cambioPassword.nueva !== cambioPassword.confirmar) {
      mostrarNotificacion('Las contraseñas no coinciden', 'error')
      return
    }
    
    if (cambioPassword.nueva.length < 6) {
      mostrarNotificacion('La contraseña debe tener al menos 6 caracteres', 'error')
      return
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cambioPassword)
      })

      if (response.ok) {
        mostrarNotificacion('Contraseña cambiada correctamente')
        setCambioPassword({ actual: '', nueva: '', confirmar: '' })
      } else {
        mostrarNotificacion('Error al cambiar la contraseña', 'error')
      }
    } catch (error) {
      mostrarNotificacion('Error de conexión', 'error')
    }
  }

  const marcarEntregado = async (pedidoId: string) => {
    try {
      const response = await fetch(`/api/orders/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'delivered' }),
      })

      const result = await response.json()

      if (response.ok) {
        mostrarNotificacion('Pedido marcado como entregado')
        cargarPedidos() // Recargar la lista de pedidos
      } else {
        mostrarNotificacion(`Error al actualizar el pedido: ${result.error}`, 'error')
      }
    } catch (error) {
      console.error('Error al marcar como entregado:', error)
      mostrarNotificacion('Error al actualizar el pedido', 'error')
    }
  }

  const eliminarPedido = async (pedidoId: string) => {
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        const response = await fetch(`/api/orders/${pedidoId}`, {
          method: 'DELETE',
        })

        const result = await response.json()

        if (response.ok) {
          mostrarNotificacion('Pedido eliminado')
          cargarPedidos() // Recargar la lista de pedidos
        } else {
          mostrarNotificacion(`Error al eliminar el pedido: ${result.error}`, 'error')
        }
      } catch (error) {
        console.error('Error al eliminar pedido:', error)
        mostrarNotificacion('Error al eliminar el pedido', 'error')
      }
    }
  }

  const pedidosPendientes = pedidos.filter(p => !p.entregado)
  const totalIngresos = pedidos.filter(p => p.entregado).reduce((sum, p) => sum + p.total, 0)
  
  const stats = [
    { title: 'Ingredientes', value: ingredientes.length, icon: '🥗' },
    { title: 'Combos', value: combos.length, icon: '🍽️' },
    { title: 'Pedidos Pendientes', value: pedidosPendientes.length, icon: '📋' },
    { title: 'Total Ingresos', value: `$${totalIngresos.toLocaleString()}`, icon: '💰' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-600 mt-2">Gestiona tu rotisería Gra-Hu</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: '📊' },
            { id: 'pedidos', name: 'Pedidos', icon: '📋' },
            { id: 'ingredientes', name: 'Ingredientes', icon: '🥗' },
            { id: 'combos', name: 'Combos', icon: '🍽️' },
            { id: 'precios', name: 'Precios Milanesas', icon: '💰' },
            { id: 'papas', name: 'Papas Fritas', icon: '🍟' },
            { id: 'password', name: 'Cambiar Contraseña', icon: '🔒' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pedidos Tab */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos Pendientes</h3>
            <div className="space-y-4">
              {pedidosPendientes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay pedidos pendientes</p>
              ) : (
                pedidosPendientes.map((pedido) => (
                  <div key={pedido.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{pedido.cliente}</h4>
                        <p className="text-sm text-gray-600">{pedido.direccion}</p>
                        <p className="text-sm text-gray-600">Hora: {pedido.hora}</p>
                        <p className="text-sm text-gray-600">Pago: {pedido.metodoPago}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">${pedido.total}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="font-medium text-gray-900 mb-2">Items:</h5>
                      {pedido.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.cantidad}x {item.nombre}
                            {item.ingredientes && (
                              <span className="text-gray-500"> ({item.ingredientes.join(', ')})</span>
                            )}
                          </span>
                          <span>${item.precio}</span>
                        </div>
                      ))}
                    </div>
                    
                    {pedido.notas && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notas:</span> {pedido.notas}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => marcarEntregado(pedido.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg text-sm"
                      >
                        ✓ Marcar Entregado
                      </button>
                      <button
                        onClick={() => eliminarPedido(pedido.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg text-sm"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ingredientes Tab */}
      {activeTab === 'ingredientes' && (
        <div className="space-y-6">
          {/* Agregar Ingrediente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Ingrediente</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nombre del ingrediente"
                value={nuevoIngrediente.nombre}
                onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, nombre: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Precio"
                value={nuevoIngrediente.precio}
                onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, precio: parseInt(e.target.value) || 0})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="Emoji"
                value={nuevoIngrediente.emoji}
                onChange={(e) => setNuevoIngrediente({...nuevoIngrediente, emoji: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={agregarIngrediente}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Agregar
              </button>
            </div>
          </div>

          {/* Lista de Ingredientes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredientes Actuales</h3>
            <div className="space-y-3">
              {ingredientesTemporales.map((ingrediente) => (
                <div key={ingrediente.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{ingrediente.emoji}</span>
                    <input
                      type="text"
                      value={ingrediente.nombre}
                      onChange={(e) => editarIngrediente(ingrediente.id, 'nombre', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      value={ingrediente.precio}
                      onChange={(e) => editarIngrediente(ingrediente.id, 'precio', parseInt(e.target.value) || 0)}
                      className="px-2 py-1 border border-gray-300 rounded w-20 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-gray-600">$</span>
                  </div>
                  <button
                    onClick={() => eliminarIngrediente(ingrediente.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            
            {/* Botones de confirmación para ingredientes */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={cancelarCambiosIngredientes}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={guardarIngredientes}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                💾 Guardar Ingredientes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Combos Tab */}
      {activeTab === 'combos' && (
        <div className="space-y-6">
          {/* Agregar Combo */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Combo</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre del combo"
                  value={nuevoCombo.nombre}
                  onChange={(e) => setNuevoCombo({...nuevoCombo, nombre: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={nuevoCombo.precio}
                  onChange={(e) => setNuevoCombo({...nuevoCombo, precio: parseInt(e.target.value) || 0})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <textarea
                placeholder="Descripción del combo"
                value={nuevoCombo.descripcion}
                onChange={(e) => setNuevoCombo({...nuevoCombo, descripcion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
              />
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Selecciona ingredientes:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ingredientes.map((ingrediente) => (
                    <label key={ingrediente.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={nuevoCombo.ingredientes.includes(ingrediente.id)}
                        onChange={() => {
                          if (nuevoCombo.ingredientes.includes(ingrediente.id)) {
                            setNuevoCombo({
                              ...nuevoCombo,
                              ingredientes: nuevoCombo.ingredientes.filter(id => id !== ingrediente.id)
                            })
                          } else {
                            setNuevoCombo({
                              ...nuevoCombo,
                              ingredientes: [...nuevoCombo.ingredientes, ingrediente.id]
                            })
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">{ingrediente.emoji} {ingrediente.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={agregarCombo}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Agregar Combo
              </button>
            </div>
          </div>

          {/* Lista de Combos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Combos Actuales</h3>
            <div className="space-y-4">
              {combos.map((combo) => (
                <div key={combo.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      value={combo.nombre}
                      onChange={(e) => editarCombo(combo.id, 'nombre', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="number"
                      value={combo.precio}
                      onChange={(e) => editarCombo(combo.id, 'precio', parseInt(e.target.value) || 0)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={() => eliminarCombo(combo.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
                    >
                      Eliminar
                    </button>
                  </div>
                  <textarea
                    value={combo.descripcion}
                    onChange={(e) => editarCombo(combo.id, 'descripcion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                    rows={2}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {ingredientes.map((ingrediente) => (
                        <label key={ingrediente.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={combo.ingredientes.includes(ingrediente.id)}
                            onChange={() => toggleIngredienteCombo(combo.id, ingrediente.id)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm">{ingrediente.emoji} {ingrediente.nombre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Precios Milanesas Tab */}
      {activeTab === 'precios' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Precios de Milanesas</h3>
          <div className="space-y-4">
            {Object.entries(preciosTemporales).map(([tipo, precio]) => (
              <div key={tipo} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">
                    {tipo === 'pollo' ? '🐔' : '🥩'}
                  </span>
                  <span className="font-medium capitalize">{tipo}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPreciosTemporales({
                      ...preciosTemporales,
                      [tipo]: parseInt(e.target.value) || 0
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Botones de confirmación */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={cancelarCambiosPrecios}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              onClick={guardarPrecios}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              💾 Guardar Precios
            </button>
          </div>
        </div>
      )}

      {/* Papas Fritas Tab */}
      {activeTab === 'papas' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Precio de Papas Fritas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">🍟</span>
                <span className="font-medium">Papas Fritas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">$</span>
                <input
                  type="number"
                  value={papasFritasTemporal.precio}
                  onChange={(e) => setPapasFritasTemporal({
                    ...papasFritasTemporal,
                    precio: parseInt(e.target.value) || 0
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
          
          {/* Botones de confirmación */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={cancelarCambiosPapasFritas}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              onClick={guardarPapasFritas}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              💾 Guardar Precio
            </button>
          </div>
        </div>
      )}

      {/* Cambiar Contraseña Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña Actual
              </label>
              <input
                type="password"
                value={cambioPassword.actual}
                onChange={(e) => setCambioPassword({...cambioPassword, actual: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                value={cambioPassword.nueva}
                onChange={(e) => setCambioPassword({...cambioPassword, nueva: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={cambioPassword.confirmar}
                onChange={(e) => setCambioPassword({...cambioPassword, confirmar: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              onClick={cambiarPassword}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      )}

      {/* Notificación */}
      {notificacion.mostrar && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notificacion.tipo === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {notificacion.tipo === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-medium">{notificacion.mensaje}</span>
          </div>
        </div>
      )}
    </div>
  )
}
