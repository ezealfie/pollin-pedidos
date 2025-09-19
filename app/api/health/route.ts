import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { 
      status: 'ok',
      message: 'Gra-Hu Rotisería API is running',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}