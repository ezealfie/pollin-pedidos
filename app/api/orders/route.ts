import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - Crear un nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos requeridos
    if (!body.customer_name || !body.delivery_time || !body.payment_method || !body.items || !body.total_amount) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Validar que haya items en el pedido
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe tener al menos un item' },
        { status: 400 }
      )
    }

    // Insertar el pedido en la base de datos
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: body.customer_name,
          delivery_time: body.delivery_time,
          payment_method: body.payment_method,
          total_amount: body.total_amount,
          notes: body.notes || null,
          items: body.items,
          status: 'pending'
        }
      ])
      .select()

    if (error) {
      console.error('Error al crear pedido:', error)
      return NextResponse.json(
        { error: 'Error al guardar el pedido' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Pedido creado exitosamente',
        order: data[0]
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error en API de pedidos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Obtener todos los pedidos
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al obtener pedidos:', error)
      return NextResponse.json(
        { error: 'Error al obtener los pedidos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders: data })

  } catch (error) {
    console.error('Error en API de pedidos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
