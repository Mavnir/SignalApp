import { getSupabase } from './supabase.js'

function completionsTable() {
  const t = import.meta.env.VITE_SUPABASE_COMPLETIONS_TABLE
  return (typeof t === 'string' && t.trim()) || 'signal_completions'
}

/** @param {{ dominant_quadrant?: string | null, texture?: string | null }} payload */
async function recordViaAnonClient(row) {
  const sb = getSupabase()
  if (!sb) return
  const { error } = await sb.from(completionsTable()).insert(row)
  if (error) throw error
}

/**
 * Drop-off funnel: one row per scored assessment (no PII). Production uses /api/record-completion (service role).
 * Never throws — logs on failure so the email gate still appears.
 */
export async function recordCompletion(payload) {
  const row = {
    dominant_quadrant: payload?.dominant_quadrant ?? null,
    texture: payload?.texture ?? null,
  }
  try {
    if (import.meta.env.DEV) {
      await recordViaAnonClient(row)
      return
    }
    const res = await fetch('/api/record-completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })
    if (res.ok) return
    if (res.status === 404) {
      await recordViaAnonClient(row)
      return
    }
    const text = await res.text()
    throw new Error(text || `record-completion failed (${res.status})`)
  } catch (e) {
    console.warn('[signal_completions]', e?.message || e)
  }
}
