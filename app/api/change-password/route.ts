import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { verifyPassword, hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { actual, nueva } = await request.json()

    if (!actual || !nueva) {
      return NextResponse.json(
        { error: 'Contraseña actual y nueva son requeridas' },
        { status: 400 }
      )
    }

    // Obtener sesión actual
    const cookieStore = cookies()
    const sessionId = cookieStore.get('session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No hay sesión activa' },
        { status: 401 }
      )
    }

    // Buscar usuario actual
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, password_hash')
      .eq('id', sessionId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    // Verificar contraseña actual
    const isValidPassword = await verifyPassword(actual, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta' },
        { status: 401 }
      )
    }

    // Hash de la nueva contraseña
    const newPasswordHash = await hashPassword(nueva)

    // Actualizar contraseña en la base de datos
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: newPasswordHash })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Error al actualizar la contraseña' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en change-password:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}