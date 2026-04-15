import { useState, useCallback } from 'react'
import { assessmentSteps, stepDisplayIndex, TOTAL_STEPS } from '../data/questions'
import { ProgressBar } from './ProgressBar'
import { Question } from './Question'

const PAUSE_MS = 400

function AssessmentSlide({ step, onCommit }) {
  const [uiPhase, setUiPhase] = useState('choice')
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [rankOrder, setRankOrder] = useState([])
  const [arrivedChoice, setArrivedChoice] = useState(null)

  const onPickArrived = (arrivedAt) => {
    setArrivedChoice(arrivedAt)
    setUiPhase('relevance')
  }

  const onSelectLetter = (letter) => {
    setSelectedLetter(letter)
    setTimeout(() => {
      if (letter === 'A') {
        setUiPhase('arrived')
      } else {
        setUiPhase('relevance')
      }
    }, PAUSE_MS)
  }

  const onRankTap = (letter) => {
    if (rankOrder.includes(letter)) return
    const next = [...rankOrder, letter]
    setRankOrder(next)
    if (next.length === 4) {
      setTimeout(() => setUiPhase('relevance'), PAUSE_MS)
    }
  }

  const landedLabel = step.relevanceLabels?.landed ?? 'This landed'
  const notLabel = step.relevanceLabels?.not_my_situation ?? 'Not really my situation'

  const showArrived = step.mode === 'choice' && uiPhase === 'arrived' && selectedLetter === 'A'

  const showRelevanceChoice =
    uiPhase === 'relevance' &&
    (step.mode === 'rank'
      ? rankOrder.length === 4
      : selectedLetter && (selectedLetter !== 'A' || arrivedChoice !== null))

  return (
    <div className="mx-auto mt-10 flex w-full max-w-xl flex-1 flex-col transition-opacity duration-300">
      <Question text={step.text} />

      {step.mode === 'rank' && (
        <p className="mt-4 text-center text-sm text-text-secondary">{step.rankPrompt}</p>
      )}

      <div className="mt-10 flex flex-col gap-3">
        {step.mode === 'choice' &&
          step.options.map((o) => {
            const selected = selectedLetter === o.letter
            const locked = selectedLetter !== null
            const dim = locked && selectedLetter !== o.letter
            return (
              <button
                key={o.letter}
                type="button"
                disabled={locked}
                onClick={() => onSelectLetter(o.letter)}
                className={`flex w-full items-stretch gap-4 rounded-lg border px-4 py-4 text-left transition md:px-5 ${
                  selected
                    ? 'border-accent-glow/50 bg-accent-blue/15'
                    : 'border-white/10 bg-bg-secondary hover:border-accent-gold/35'
                } ${dim ? 'opacity-35' : ''}`}
              >
                <span className="font-mono text-sm text-accent-gold">{o.letter}</span>
                <span className="font-sans text-sm leading-relaxed text-text-primary">{o.text}</span>
                {selected ? (
                  <span className="ml-auto self-center text-accent-gold" aria-hidden>
                    ✓
                  </span>
                ) : null}
              </button>
            )
          })}

        {step.mode === 'rank' && (
          <div className="flex flex-col gap-3">
            {step.options.map((o) => {
              const pos = rankOrder.indexOf(o.letter)
              const taken = pos >= 0
              return (
                <button
                  key={o.letter}
                  type="button"
                  disabled={taken || uiPhase === 'relevance'}
                  onClick={() => onRankTap(o.letter)}
                  className={`flex w-full items-center gap-4 rounded-lg border px-4 py-4 text-left transition md:px-5 ${
                    taken
                      ? 'border-accent-gold/40 bg-accent-gold/10'
                      : 'border-white/10 bg-bg-secondary hover:border-accent-gold/35'
                  }`}
                >
                  <span className="font-mono text-sm text-accent-gold">{o.letter}</span>
                  <span className="flex-1 font-sans text-sm text-text-primary">{o.text}</span>
                  {taken ? (
                    <span className="font-mono text-xs text-accent-gold">{pos + 1}</span>
                  ) : null}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {showArrived && (
        <div className="mt-8">
          <p className="text-center text-xs text-text-secondary">
            This comes naturally to me / I&apos;ve had to learn this
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="rounded border border-white/15 px-4 py-2 text-xs text-text-primary hover:border-accent-gold/40"
              onClick={() => onPickArrived('naturally')}
            >
              This comes naturally to me
            </button>
            <button
              type="button"
              className="rounded border border-white/15 px-4 py-2 text-xs text-text-primary hover:border-accent-gold/40"
              onClick={() => onPickArrived('learned')}
            >
              I&apos;ve had to learn this
            </button>
          </div>
        </div>
      )}

      {showRelevanceChoice && (
        <RelevanceBlock
          landedLabel={landedLabel}
          notLabel={notLabel}
          onPick={(rel) => {
            if (step.mode === 'rank') {
              onCommit({ rankOrder: [...rankOrder], relevance: rel })
              return
            }
            if (selectedLetter === 'A') {
              onCommit({
                answer: 'A',
                arrivedAt: arrivedChoice,
                relevance: rel,
              })
              return
            }
            onCommit({ answer: selectedLetter, relevance: rel })
          }}
        />
      )}
    </div>
  )
}

export function Assessment({ setResponses, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0)

  const step = assessmentSteps[stepIndex]
  const { current: dispCur, total: dispTot } = stepDisplayIndex(stepIndex)

  const goNext = useCallback(() => {
    setTimeout(() => {
      setStepIndex((i) => {
        if (i + 1 >= TOTAL_STEPS) {
          onComplete()
          return i
        }
        return i + 1
      })
    }, PAUSE_MS)
  }, [onComplete])

  const handleCommit = useCallback(
    (payload) => {
      const id = step.id
      setResponses((prev) => ({
        ...prev,
        responses: { ...prev.responses, [id]: payload },
      }))
      goNext()
    },
    [goNext, setResponses, step],
  )

  if (!step) return null

  return (
    <div className="flex min-h-svh flex-col px-4 pb-10 pt-4 md:px-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-3 flex items-center justify-between text-xs text-text-dim">
          <span>
            {String(dispCur).padStart(2, '0')} / {String(dispTot).padStart(2, '0')}
          </span>
        </div>
        <ProgressBar currentIndex={stepIndex} total={TOTAL_STEPS} />
      </div>

      <AssessmentSlide key={stepIndex} step={step} onCommit={handleCommit} />
    </div>
  )
}

function RelevanceBlock({ landedLabel, notLabel, onPick }) {
  return (
    <div className="mt-10 border-t border-white/10 pt-8">
      <p className="mb-3 text-center text-xs text-text-dim">How true does this feel?</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          className="rounded border border-white/15 px-4 py-2 text-xs text-text-primary hover:border-accent-gold/40"
          onClick={() => onPick('landed')}
        >
          {landedLabel}
        </button>
        <button
          type="button"
          className="rounded border border-white/15 px-4 py-2 text-xs text-text-primary hover:border-accent-gold/40"
          onClick={() => onPick('not_my_situation')}
        >
          {notLabel}
        </button>
      </div>
    </div>
  )
}
