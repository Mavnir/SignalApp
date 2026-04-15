import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/** Table name in Supabase (default matches spec). Set `VITE_SUPABASE_LEADS_TABLE=leads` if your table is `leads`. */
export function leadsTableName() {
  const t = import.meta.env.VITE_SUPABASE_LEADS_TABLE
  return (typeof t === 'string' && t.trim()) || 'signal_leads'
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
async function saveLeadViaAnonClient(row) {
  const sb = getSupabase()
  if (!sb) {
    console.warn('Supabase not configured; lead not saved.')
    return { ok: false, skipped: true, reason: 'missing_env' }
  }
  const table = leadsTableName()
  const { error } = await sb.from(table).insert(row)
  if (error) {
    const detail = [error.message, error.details, error.hint].filter(Boolean).join(' — ')
    throw new Error(detail || 'Supabase insert failed')
  }
  return { ok: true, saved: true }
}

/**
 * Production (Vercel): POST /api/save-lead uses the service role on the server so rows
 * reliably reach the table (bypasses RLS). Local `vite`: anon client insert.
 */
export async function saveLead(row) {
  if (import.meta.env.DEV) {
    return saveLeadViaAnonClient(row)
  }

  let res
  try {
    res = await fetch('/api/save-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })
  } catch (e) {
    throw new Error(e?.message || 'Network error saving lead')
  }

  if (res.ok) {
    return { ok: true, saved: true }
  }

  const text = await res.text()
  let message = text
  try {
    const j = JSON.parse(text)
    if (j?.error) message = j.error
  } catch {
    /* use raw text */
  }

  if (res.status === 404) {
    return saveLeadViaAnonClient(row)
  }

  throw new Error(message || `Could not save lead (${res.status})`)
}
