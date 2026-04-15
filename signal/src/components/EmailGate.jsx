import { useState } from 'react'
import { saveLead } from '../services/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EmailGate({ diagnostic, responseVector, onContinue }) {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setErr(null)
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setErr('Enter a valid email.')
      return
    }
    setBusy(true)
    try {
      await saveLead({
        email: trimmed,
        dominant_quadrant: diagnostic.dominant_quadrant,
        texture: diagnostic.texture,
        archetype: diagnostic.archetype,
        response_vector: responseVector,
      })
      onContinue()
    } catch (e) {
      setErr(e?.message || 'Could not save. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-center font-display text-3xl text-text-primary md:text-4xl">
          Your reading is ready.
        </h1>
        <p className="mt-3 text-center text-sm text-text-secondary">Where should we send it?</p>
        <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-white/15 bg-bg-secondary px-4 py-3.5 text-sm text-text-primary outline-none ring-accent-gold/40 placeholder:text-text-dim focus:border-accent-gold focus:ring-2"
          />
          {err ? <p className="text-center text-xs text-accent-glow">{err}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full border border-accent-gold/50 bg-accent-gold/15 py-3.5 text-sm font-medium text-accent-gold transition hover:bg-accent-gold/25 disabled:opacity-50"
          >
            {busy ? 'Saving…' : 'Reveal my reading'}
          </button>
        </form>
        <p className="mt-6 text-center text-[11px] text-text-dim">
          No newsletters. No noise. Just this.
        </p>
      </div>
    </div>
  )
}
