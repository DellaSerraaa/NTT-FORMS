import type { FormSubmissionInput } from '@/utils/supabase/types'
import { createBrowserSupabaseClient } from '@/utils/supabase/clients/browser'

export async function insertFormSubmission(payload: FormSubmissionInput) {
  const supabase = createBrowserSupabaseClient()
  return supabase.from('form_submissions').insert(payload)
}
