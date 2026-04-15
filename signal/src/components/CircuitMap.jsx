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

/** Explicit 2×2: Q1 TL, Q2 TR, Q3 BL, Q4 BR */
const GRID_PLACE = {
  Q1: 'col-start-1 row-start-1',
  Q2: 'col-start-2 row-start-1',
  Q3: 'col-start-1 row-start-2',
  Q4: 'col-start-2 row-start-2',
}

function scoreOf(diagnostic, id) {
  const s = diagnostic.entropy_profile?.[id]?.score
  return typeof s === 'number' && !Number.isNaN(s) ? s : 0
}

/**
 * Labels aligned to diagnostic: dominant_quadrant → "dominant signal";
 * dimmest among non-dominant by score → "low signal"; remaining two by score.
 */
function signalLabelsByQuadrant(diagnostic) {
  const ids = ['Q1', 'Q2', 'Q3', 'Q4']
  const dominant = diagnostic.dominant_quadrant
  if (!ids.includes(dominant)) {
    const ranked = [...ids].sort((a, b) => scoreOf(diagnostic, b) - scoreOf(diagnostic, a))
    const words = ['dominant signal', 'secondary', 'stable ground', 'low signal']
    return Object.fromEntries(ranked.map((id, i) => [id, words[i]]))
  }

  const scores = Object.fromEntries(ids.map((id) => [id, scoreOf(diagnostic, id)]))
  const wordById = {}
  wordById[dominant] = 'dominant signal'

  const nonDom = ids.filter((id) => id !== dominant).sort((a, b) => scores[a] - scores[b])
  const lowId = nonDom[0]
  wordById[lowId] = 'low signal'

  const rest = nonDom.slice(1).sort((a, b) => scores[b] - scores[a])
  if (rest[0]) wordById[rest[0]] = 'secondary'
  if (rest[1]) wordById[rest[1]] = 'stable ground'

  return wordById
}

/** Quadrant id with minimum entropy score (for dimmest cell). */
function lowestScoreQuadrant(diagnostic) {
  const ids = ['Q1', 'Q2', 'Q3', 'Q4']
  const scores = Object.fromEntries(ids.map((id) => [id, scoreOf(diagnostic, id)]))
  return ids.reduce((a, b) => (scores[a] <= scores[b] ? a : b))
}

export function CircuitMap({ diagnostic }) {
  const wordById = signalLabelsByQuadrant(diagnostic)
  const dominant = diagnostic.dominant_quadrant
  let dimId = lowestScoreQuadrant(diagnostic)
  if (dimId === dominant) {
    const ids = ['Q1', 'Q2', 'Q3', 'Q4'].filter((id) => id !== dominant)
    const scores = Object.fromEntries(ids.map((id) => [id, scoreOf(diagnostic, id)]))
    dimId = ids.reduce((a, b) => (scores[a] <= scores[b] ? a : b))
  }

  return (
    <div className="mt-6 grid grid-cols-2 grid-rows-2 gap-3 md:gap-4">
      {(['Q1', 'Q2', 'Q3', 'Q4']).map((id) => {
        const meta = QUADRANT_STYLES[id]
        const score = scoreOf(diagnostic, id)
        const isDom = id === dominant
        const isDim = id === dimId && id !== dominant
        const strength = `${Math.round(score * 100)}%`

        const cellOpacity = isDim ? 'opacity-30' : isDom ? 'opacity-100' : 'opacity-[0.72]'
        const bg = isDim
          ? 'bg-[#06060a]'
          : isDom
            ? `bg-gradient-to-br ${meta.cellTint} to-bg-secondary ring-1 ring-accent-gold/35 shadow-[0_0_24px_rgba(201,168,76,0.12)]`
            : 'bg-bg-secondary'

        return (
          <div
            key={id}
            className={`relative flex flex-col rounded-lg border border-white/10 p-4 transition ${GRID_PLACE[id]} ${bg} ${cellOpacity}`}
          >
            {isDom ? (
              <span
                className="animate-pulse-dot absolute right-3 top-3 h-2 w-2 rounded-full bg-accent-gold"
                aria-hidden
              />
            ) : null}
            <p
              className={`font-display text-lg ${meta.textClass} ${isDim ? '!text-text-dim' : ''}`}
            >
              {meta.name}
            </p>
            <p className={`mt-1 text-[11px] ${isDim ? 'text-text-dim/80' : 'text-text-dim'}`}>{meta.axis}</p>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full ${meta.barClass} ${isDim ? 'opacity-35' : isDom ? 'opacity-100' : 'opacity-70'}`}
                style={{ width: strength }}
              />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              {wordById[id] ?? ''}
            </p>
          </div>
        )
      })}
    </div>
  )
}
