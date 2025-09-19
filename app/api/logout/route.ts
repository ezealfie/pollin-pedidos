import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    cookieStore.delete('session')

    return NextResponse.json(
      { message: 'Sesión cerrada correctamente' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}