import { NextRequest, NextResponse } from 'next/server'
import { getSession, verifySession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionId = await getSession()
    
    if (!sessionId) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const isValid = await verifySession(sessionId)
    
    if (!isValid) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error en verificación de sesión:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}
