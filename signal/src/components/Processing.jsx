import { useEffect, useState } from 'react'
import { scoreResponses } from '../services/scoring'

const SUBTEXTS = ['Mapping your circuit.', 'Locating the pattern.', 'Assembling your reading.']

export function Processing({ responseVector, onDone, onBack }) {
  const [subIndex, setSubIndex] = useState(0)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSubIndex((i) => (i + 1) % SUBTEXTS.length)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    const minMs = 3000

    async function run() {
      setError(null)
      try {
        const minWait = new Promise((r) => setTimeout(r, minMs))
        const diagnostic = await Promise.all([
          scoreResponses(responseVector),
          minWait,
        ]).then(([d]) => d)
        if (!cancelled) onDone(diagnostic)
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Unable to read your signal.')
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [responseVector, onDone, retryKey])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      {error ? (
        <div className="max-w-md text-center">
          <p className="text-sm text-text-secondary">{error}</p>
          <button
            type="button"
            className="mt-6 border border-accent-gold/40 px-6 py-2 text-sm text-accent-gold hover:bg-accent-gold/10"
            onClick={() => {
              setError(null)
              setRetryKey((k) => k + 1)
            }}
          >
            Try again
          </button>
          {onBack ? (
            <button
              type="button"
              className="mt-4 block w-full text-center text-xs text-text-dim hover:text-text-secondary"
              onClick={onBack}
            >
              Back to questions
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div
            className="animate-signal-breathe h-28 w-28 rounded-full bg-accent-gold/25 md:h-32 md:w-32"
            aria-hidden
          />
          <p className="mt-10 font-display text-xl text-text-primary md:text-2xl">Reading your signal.</p>
          <p
            key={subIndex}
            className="mt-4 min-h-[1.5rem] text-center text-sm text-text-secondary transition-opacity duration-500"
          >
            {SUBTEXTS[subIndex]}
          </p>
        </>
      )}
    </div>
  )
}
