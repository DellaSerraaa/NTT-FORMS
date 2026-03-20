import { createServerSupabaseClient } from '@/utils/supabase/clients/server'
import { cookies } from 'next/headers'

export async function getTodos() {
  const cookieStore = await cookies()
  const supabase = createServerSupabaseClient(cookieStore)
  const { data: todos } = await supabase.from('todos').select()
  return todos ?? []
}
