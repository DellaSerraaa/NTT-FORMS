import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from '@/utils/supabase/config'

export function createServerSupabaseClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // setAll pode ser chamado em Server Components.
          // A sessao e atualizada no proxy.
        }
      },
    },
  })
}
