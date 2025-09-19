'use client'

import { useState, useEffect } from 'react'
import { ingredientes as ingredientesData, combos as combosData, preciosMilanesa as preciosData } from '@/lib/data'

// Tipos para TypeScript
interface CarritoItem {
  id: number
  tipo: string
  nombre: string
  descripcion: string
  precio: number
  ingredientes: number[]
}

interface DatosCliente {
  nombre: string
  hora: string
  metodoPago: string
  notas: string
}

export default function Home() {
  const [carrito, setCarrito] = useState<CarritoItem[]>([])
  const [tipoMilanesa, setTipoMilanesa] = useState<'pollo' | 'carne'>('pollo')
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<number[]>([])
  const [ingredientes, setIngredientes] = useState(ingredientesData)
  const [combos, setCombos] = useState(combosData)
  const [preciosMilanesa, setPreciosMilanesa] = useState(preciosData)
  const [datosCliente, setDatosCliente] = useState<DatosCliente>({
    nombre: '',
    hora: '',
    metodoPago: '',
    notas: ''
  })

  // Sincronizar datos con el admin (simulado)
  useEffect(() => {
    const interval = setInterval(() => {
      // En una implementación real, aquí harías una llamada a la API
      // para obtener los datos actualizados del admin
    }, 5000) // Verificar cada 5 segundos

    return () => clearInterval(interval)
  }, [])

  const agregarCombo = (combo: any) => {
    const nuevoItem: CarritoItem = {
      id: Date.now(),
      tipo: 'combo',
      nombre: combo.nombre,
      descripcion: combo.descripcion,
      precio: combo.precio,
      ingredientes: combo.ingredientes
    }
    setCarrito([...carrito, nuevoItem])
  }

  const agregarSandwichPersonalizado = () => {
    if (ingredientesSeleccionados.length === 0) {
      alert('Selecciona al menos un ingrediente')
      return
    }

    const precioBase = preciosMilanesa[tipoMilanesa]
    const precioIngredientes = ingredientesSeleccionados.reduce((total, id) => {
      const ingrediente = ingredientes.find(ing => ing.id === id)
      return total + (ingrediente ? ingrediente.precio : 0)
    }, 0)
    const precioTotal = precioBase + precioIngredientes

    const ingredientesNombres = ingredientesSeleccionados.map(id => {
      const ingrediente = ingredientes.find(ing => ing.id === id)
      return ingrediente ? ingrediente.nombre : ''
    }).join(', ')

    const nuevoItem: CarritoItem = {
      id: Date.now(),
      tipo: 'personalizado',
      nombre: `Sándwich de ${tipoMilanesa}`,
      descripcion: `Milanesa de ${tipoMilanesa} + ${ingredientesNombres}`,
      precio: precioTotal,
      ingredientes: ingredientesSeleccionados
    }
    setCarrito([...carrito, nuevoItem])
    setIngredientesSeleccionados([])
  }

  const quitarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.id !== id))
  }

  const total = carrito.reduce((sum, item) => sum + item.precio, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (carrito.length === 0) {
      alert('Agrega al menos un sándwich al carrito')
      return
    }
    if (!datosCliente.nombre || !datosCliente.hora || !datosCliente.metodoPago) {
      alert('Completa todos los campos obligatorios')
      return
    }
    
    alert('¡Pedido enviado correctamente! Te contactaremos pronto.')
    setCarrito([])
    setDatosCliente({
      nombre: '',
      hora: '',
      metodoPago: '',
      notas: ''
    })
  }

  const toggleIngrediente = (id: number) => {
    if (ingredientesSeleccionados.includes(id)) {
      setIngredientesSeleccionados(ingredientesSeleccionados.filter(ingId => ingId !== id))
    } else {
      setIngredientesSeleccionados([...ingredientesSeleccionados, id])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900 ml-2">Gra-Hu Rotisería</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/admin" className="text-gray-600 hover:text-orange-500 text-sm">
                Admin
              </a>
              <a href="/login" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg text-sm">
                Login Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🥪 Haz tu Pedido
          </h1>
          <p className="text-xl text-gray-600">
            Elige tu sándwich de milanesa y personalízalo a tu gusto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Productos */}
          <div>
            {/* Combos */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Combos</h2>
              <div className="space-y-3">
                {combos.map((combo) => (
                  <div key={combo.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{combo.nombre}</h3>
                        <p className="text-sm text-gray-600 mb-2">{combo.descripcion}</p>
                        <p className="text-orange-600 font-bold">${combo.precio}</p>
                      </div>
                      <button
                        onClick={() => agregarCombo(combo)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sándwich Personalizado */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Armá tu Sándwich</h2>
              
              {/* Tipo de Milanesa */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Tipo de Milanesa</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTipoMilanesa('pollo')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      tipoMilanesa === 'pollo'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🐔</div>
                      <div className="font-medium capitalize">Pollo</div>
                      <div className="text-sm text-gray-600">${preciosMilanesa.pollo}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTipoMilanesa('carne')}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      tipoMilanesa === 'carne'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🥩</div>
                      <div className="font-medium capitalize">Carne</div>
                      <div className="text-sm text-gray-600">${preciosMilanesa.carne}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Ingredientes */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Ingredientes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ingredientes.map((ingrediente) => (
                    <button
                      key={ingrediente.id}
                      onClick={() => toggleIngrediente(ingrediente.id)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        ingredientesSeleccionados.includes(ingrediente.id)
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{ingrediente.emoji}</span>
                          <span className="font-medium">{ingrediente.nombre}</span>
                        </div>
                        <span className="text-sm text-gray-600">+${ingrediente.precio}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={agregarSandwichPersonalizado}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                🥪 Agregar Sándwich Personalizado - ${preciosMilanesa[tipoMilanesa] + ingredientesSeleccionados.reduce((total, id) => {
                  const ingrediente = ingredientes.find(ing => ing.id === id)
                  return total + (ingrediente ? ingrediente.precio : 0)
                }, 0)}
              </button>
            </div>
          </div>

          {/* Carrito y Formulario */}
          <div>
            {/* Carrito */}
            {carrito.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tu Pedido</h3>
                <div className="space-y-3">
                  {carrito.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.nombre}</p>
                        <p className="text-sm text-gray-600">{item.descripcion}</p>
                        <p className="text-orange-600 font-bold">${item.precio}</p>
                      </div>
                      <button
                        onClick={() => quitarDelCarrito(item.id)}
                        className="text-red-500 hover:text-red-700 ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-orange-600">${total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de Pedido */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Datos del Pedido</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre * <span className="text-red-500">(Obligatorio)</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={datosCliente.nombre}
                    onChange={(e) => setDatosCliente({...datosCliente, nombre: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Tu nombre completo"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de entrega * <span className="text-red-500">(Obligatorio)</span>
                  </label>
                  <input
                    type="time"
                    name="hora"
                    value={datosCliente.hora}
                    onChange={(e) => setDatosCliente({...datosCliente, hora: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago * <span className="text-red-500">(Obligatorio)</span>
                  </label>
                  <select
                    name="metodoPago"
                    value={datosCliente.metodoPago}
                    onChange={(e) => setDatosCliente({...datosCliente, metodoPago: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Selecciona método de pago</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta de débito/crédito</option>
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="mercadopago">MercadoPago</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas adicionales
                  </label>
                  <textarea
                    name="notas"
                    value={datosCliente.notas}
                    onChange={(e) => setDatosCliente({...datosCliente, notas: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Instrucciones especiales, alergias, etc."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200"
                >
                  🚀 Enviar Pedido - ${total}
                </button>
              </div>
            </form>

            {/* Dirección del Local */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📍 Nuestra Ubicación</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">🏪</span>
                  <div>
                    <p className="font-semibold text-gray-900">Gra-Hu Rotisería</p>
                    <p className="text-gray-600">Av. Principal 123, Centro</p>
                    <p className="text-gray-600">Ciudad, Provincia</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">📞</span>
                  <div>
                    <p className="font-semibold text-gray-900">Teléfono</p>
                    <p className="text-gray-600">(011) 1234-5678</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">🕒</span>
                  <div>
                    <p className="font-semibold text-gray-900">Horarios</p>
                    <p className="text-gray-600">Lunes a Domingo: 10:00 - 22:00</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-xl">🚚</span>
                  <div>
                    <p className="font-semibold text-gray-900">Delivery</p>
                    <p className="text-gray-600">Radio de entrega: 5km</p>
                    <p className="text-gray-600">Costo de envío: $200</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}