import { useEffect, useRef, useState } from 'react'
import { matchReportTemplate } from '../data/reportTemplates'
import { CircuitMap } from './CircuitMap'
import { ResonanceLine } from './ResonanceLine'

function Section({ label, children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={`mx-auto max-w-2xl px-6 py-14 transition duration-700 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {label ? (
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-gold">{label}</p>
      ) : null}
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-secondary">{children}</div>
    </section>
  )
}

function splitParagraphs(text) {
  return text.split(/\n\n+/).map((p, i) => (
    <p key={i} className="text-text-secondary">
      {p}
    </p>
  ))
}

function ArchetypeTag({ label }) {
  if (!label?.trim()) return null
  return (
    <div className="mx-auto max-w-2xl px-6 pt-6">
      <span className="inline-block rounded border border-accent-gold/45 bg-bg-primary px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-accent-gold/75">
        {label.trim()}
      </span>
    </div>
  )
}

export function Report({ diagnostic }) {
  const template = matchReportTemplate(diagnostic.texture, diagnostic.dominant_quadrant)
  const archetypeLabel = (template.archetype || '').trim()

  return (
    <div className="pb-24 pt-10">
      <Section label="YOUR CIRCUIT">
        <p className="text-sm italic text-text-dim">
          You carry all four dimensions. This is which one is running loudest right now.
        </p>
        <CircuitMap diagnostic={diagnostic} />
      </Section>

      <ArchetypeTag label={archetypeLabel} />

      <Section label="WHAT'S WORKING">{splitParagraphs(template.whatsWorking)}</Section>

      <Section label="WHAT'S RUNNING UNDERNEATH">{splitParagraphs(template.whatsUnderneath)}</Section>

      <Section label="UNDER PRESSURE, YOU BECOME">{splitParagraphs(template.underPressure)}</Section>

      <Section label="WHERE THE SIGNAL POINTS">{splitParagraphs(template.whereSignalPoints)}</Section>

      <ResonanceLine text={template.resonanceLine} />
    </div>
  )
}
