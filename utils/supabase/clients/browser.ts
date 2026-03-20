import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig } from '@/utils/supabase/config'

let browserSupabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createBrowserSupabaseClient() {
  if (browserSupabaseClient) {
    return browserSupabaseClient
  }

  const { supabaseUrl, supabaseKey } = getSupabaseConfig()
  browserSupabaseClient = createBrowserClient(supabaseUrl, supabaseKey)
  return browserSupabaseClient
}
