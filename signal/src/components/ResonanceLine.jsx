import { useState } from 'react'

export function ResonanceLine({ text }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-3xl border-t border-accent-gold/30 pt-12" />
      <p className="mt-10 max-w-3xl text-center font-display text-[clamp(1.5rem,4.5vw,2.25rem)] leading-snug text-accent-gold">
        {text}
      </p>
      <div className="mt-16 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="border border-white/15 px-5 py-2 text-xs text-text-secondary hover:border-accent-gold/40 hover:text-text-primary"
        >
          {copied ? 'Copied' : 'Copy my reading'}
        </button>
        <p className="text-[11px] text-text-dim">Share what you found.</p>
      </div>
    </section>
  )
}
