import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { supabase } from './supabase'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export async function getSession(): Promise<string | null> {
  const cookieStore = cookies()
  return cookieStore.get('session')?.value || null
}

export async function requireAuth(): Promise<string> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

export async function verifySession(sessionId: string): Promise<boolean> {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', sessionId)
      .single()
    
    return !!user
  } catch {
    return false
  }
}
