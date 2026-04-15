import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/**
 * @param {{
 *   email: string
 *   dominant_quadrant: string
 *   texture: string
 *   archetype: string
 *   response_vector: object
 * }} row
 */
export async function saveLead(row) {
  const sb = getSupabase()
  if (!sb) {
    console.warn('Supabase not configured; lead not saved.')
    return { skipped: true, data: null }
  }
  const { error } = await sb.from('signal_leads').insert(row)
  if (error) throw error
  return { saved: true }
}
