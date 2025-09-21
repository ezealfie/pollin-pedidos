import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Obtener todos los ingredientes
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ingredientes')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true })

    if (error) {
      console.error('Error al obtener ingredientes:', error)
      return NextResponse.json(
        { error: 'Error al obtener los ingredientes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ingredientes: data })

  } catch (error) {
    console.error('Error en API de ingredientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear un nuevo ingrediente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.nombre || body.precio === undefined || !body.emoji) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Insertar el ingrediente en la base de datos
    const { data, error } = await supabase
      .from('ingredientes')
      .insert([
        {
          nombre: body.nombre,
          precio: body.precio,
          emoji: body.emoji,
          is_active: true
        }
      ])
      .select()

    if (error) {
      console.error('Error al crear ingrediente:', error)
      return NextResponse.json(
        { error: 'Error al guardar el ingrediente' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Ingrediente creado exitosamente',
        ingrediente: data[0]
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en API de ingredientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar un ingrediente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.id || !body.nombre || body.precio === undefined || !body.emoji) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Actualizar el ingrediente en la base de datos
    const { data, error } = await supabase
      .from('ingredientes')
      .update({
        nombre: body.nombre,
        precio: body.precio,
        emoji: body.emoji,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select()

    if (error) {
      console.error('Error al actualizar ingrediente:', error)
      return NextResponse.json(
        { error: 'Error al actualizar el ingrediente' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Ingrediente actualizado exitosamente',
        ingrediente: data[0]
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en API de ingredientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar un ingrediente
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID del ingrediente es requerido' },
        { status: 400 }
      )
    }

    // Marcar como inactivo en lugar de eliminar
    const { data, error } = await supabase
      .from('ingredientes')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error al eliminar ingrediente:', error)
      return NextResponse.json(
        { error: 'Error al eliminar el ingrediente' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Ingrediente eliminado exitosamente'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en API de ingredientes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
