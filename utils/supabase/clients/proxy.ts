import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseConfig } from '@/utils/supabase/config'

function createProxySupabaseClient(request: NextRequest) {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig()

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

        supabaseResponse = NextResponse.next({
          request,
        })

        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  return { supabase, supabaseResponse }
}

export async function updateSupabaseSession(request: NextRequest) {
  const { supabase, supabaseResponse } = createProxySupabaseClient(request)
  await supabase.auth.getUser()
  return supabaseResponse
}
