import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Obtener precios de milanesas
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('milanesa_prices')
      .select('*')
      .order('tipo', { ascending: true })

    if (error) {
      console.error('Error al obtener precios de milanesas:', error)
      return NextResponse.json(
        { error: 'Error al obtener los precios' },
        { status: 500 }
      )
    }

    // Convertir array a objeto
    const precios = data.reduce((acc, item) => {
      acc[item.tipo] = item.precio
      return acc
    }, {} as any)

    return NextResponse.json({ precios })

  } catch (error) {
    console.error('Error en API de precios de milanesas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar precios de milanesas
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.precios || typeof body.precios !== 'object') {
      return NextResponse.json(
        { error: 'Datos de precios requeridos' },
        { status: 400 }
      )
    }

    const updates = []
    
    // Actualizar cada tipo de milanesa
    for (const [tipo, precio] of Object.entries(body.precios)) {
      updates.push(
        supabase
          .from('milanesa_prices')
          .update({
            precio: precio,
            updated_at: new Date().toISOString()
          })
          .eq('tipo', tipo)
      )
    }

    // Ejecutar todas las actualizaciones
    const results = await Promise.all(updates)
    
    // Verificar si hubo errores
    for (const result of results) {
      if (result.error) {
        console.error('Error al actualizar precios:', result.error)
        return NextResponse.json(
          { error: 'Error al actualizar los precios' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Precios actualizados exitosamente'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en API de precios de milanesas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
