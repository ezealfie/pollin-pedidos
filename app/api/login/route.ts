import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario en la base de datos
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('username', username)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Crear cookie de sesión
    const cookieStore = cookies()
    cookieStore.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    })

    return NextResponse.json(
      { 
        message: 'Sesión iniciada correctamente',
        user: {
          id: user.id,
          username: user.username
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}