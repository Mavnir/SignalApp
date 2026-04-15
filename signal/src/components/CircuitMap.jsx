const QUADRANT_STYLES = {
  Q1: {
    name: 'Secure Autonomy',
    axis: 'Self · Stability',
    textClass: 'text-q1',
    barClass: 'bg-q1',
    cellTint: 'from-q1/25',
  },
  Q2: {
    name: 'Sovereign Evolution',
    axis: 'Self · Growth',
    textClass: 'text-q2',
    barClass: 'bg-q2',
    cellTint: 'from-q2/25',
  },
  Q3: {
    name: 'Devotional Anchoring',
    axis: 'Other · Stability',
    textClass: 'text-q3',
    barClass: 'bg-q3',
    cellTint: 'from-q3/25',
  },
  Q4: {
    name: 'Co-Creative Unfolding',
    axis: 'Other · Growth',
    textClass: 'text-q4',
    barClass: 'bg-q4',
    cellTint: 'from-q4/25',
  },
}

function orderedLabels(diagnostic) {
  const ids = ['Q1', 'Q2', 'Q3', 'Q4']
  const ranked = [...ids].sort(
    (a, b) =>
      (diagnostic.entropy_profile[b]?.score ?? 0) -
      (diagnostic.entropy_profile[a]?.score ?? 0),
  )
  const wordById = {}
  wordById[ranked[0]] = 'dominant signal'
  wordById[ranked[1]] = 'secondary'
  wordById[ranked[2]] = 'stable ground'
  wordById[ranked[3]] = 'low signal'
  return wordById
}

export function CircuitMap({ diagnostic }) {
  const wordById = orderedLabels(diagnostic)
  const dominant = diagnostic.dominant_quadrant
  const low = diagnostic.low_signal_quadrant

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
      {['Q1', 'Q2', 'Q3', 'Q4'].map((id) => {
        const meta = QUADRANT_STYLES[id]
        const ep = diagnostic.entropy_profile?.[id] ?? { score: 0, label: '' }
        const score = typeof ep.score === 'number' ? ep.score : 0
        const isDom = id === dominant
        const isLow = id === low
        const strength = `${Math.round(score * 100)}%`
        const opacity = isLow ? 'opacity-25' : isDom ? 'opacity-100' : 'opacity-70'
        const bg = isLow
          ? 'bg-[#06060a]'
          : isDom
            ? `bg-gradient-to-br ${meta.cellTint} to-bg-secondary ring-1 ring-accent-gold/30`
            : 'bg-bg-secondary'

        return (
          <div
            key={id}
            className={`relative flex flex-col rounded-lg border border-white/10 p-4 transition ${bg} ${opacity}`}
          >
            {isDom ? (
              <span
                className="animate-pulse-dot absolute right-3 top-3 h-2 w-2 rounded-full bg-accent-gold"
                aria-hidden
              />
            ) : null}
            <p
              className={`font-display text-lg ${meta.textClass} ${isLow ? 'text-text-dim' : ''}`}
            >
              {meta.name}
            </p>
            <p className="mt-1 text-[11px] text-text-dim">{meta.axis}</p>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full ${meta.barClass} ${isLow ? 'opacity-30' : ''}`}
                style={{ width: strength }}
              />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              {wordById[id]}
            </p>
          </div>
        )
      })}
    </div>
  )
}
