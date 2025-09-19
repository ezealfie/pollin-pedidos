// Datos compartidos entre la página principal y el admin
export let ingredientes = [
  { id: 1, nombre: 'Lechuga', precio: 50, emoji: '🥬' },
  { id: 2, nombre: 'Tomate', precio: 50, emoji: '🍅' },
  { id: 3, nombre: 'Cebolla', precio: 50, emoji: '🧅' },
  { id: 4, nombre: 'Huevo frito', precio: 100, emoji: '🍳' },
  { id: 5, nombre: 'Jamón', precio: 150, emoji: '🍖' },
  { id: 6, nombre: 'Queso', precio: 100, emoji: '🧀' },
  { id: 7, nombre: 'Mayonesa', precio: 30, emoji: '🥄' },
  { id: 8, nombre: 'Mostaza', precio: 30, emoji: '🟡' },
  { id: 9, nombre: 'Ketchup', precio: 30, emoji: '🍅' },
  { id: 10, nombre: 'Pepinillos', precio: 80, emoji: '🥒' }
]

export let combos = [
  {
    id: 1,
    nombre: 'Sándwich Completo',
    descripcion: 'Milanesa + lechuga + tomate + cebolla + huevo + jamón + queso + mayonesa',
    precio: 1200,
    ingredientes: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: 2,
    nombre: 'Sándwich Clásico',
    descripcion: 'Milanesa + lechuga + tomate + cebolla + mayonesa',
    precio: 800,
    ingredientes: [1, 2, 3, 7]
  },
  {
    id: 3,
    nombre: 'Sándwich Especial',
    descripcion: 'Milanesa + lechuga + tomate + huevo + queso + mayonesa + mostaza',
    precio: 1000,
    ingredientes: [1, 2, 4, 6, 7, 8]
  }
]

export let preciosMilanesa = {
  pollo: 600,
  carne: 700
}

// Funciones para actualizar los datos
export const updateIngredientes = (newIngredientes: any[]) => {
  ingredientes = newIngredientes
}

export const updateCombos = (newCombos: any[]) => {
  combos = newCombos
}

export const updatePreciosMilanesa = (newPrecios: any) => {
  preciosMilanesa = newPrecios
}
