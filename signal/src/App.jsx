import { useCallback, useState } from 'react'
import { useAssessment } from './hooks/useAssessment'
import { Landing } from './components/Landing'
import { Assessment } from './components/Assessment'
import { Processing } from './components/Processing'
import { EmailGate } from './components/EmailGate'
import { Report } from './components/Report'

export default function App() {
  const {
    phase,
    begin,
    responseVector,
    setResponses,
    startProcessing,
    setDiagnosticResult,
    diagnostic,
    afterEmail,
    restart,
  } = useAssessment()

  const [sessionKey, setSessionKey] = useState(0)

  const onBegin = useCallback(() => {
    setSessionKey((k) => k + 1)
    begin()
  }, [begin])

  return (
    <div className="min-h-svh bg-bg-primary text-text-primary">
      {phase === 'landing' ? <Landing onBegin={onBegin} /> : null}

      {phase !== 'landing' ? (
        <div className={phase === 'assessment' ? 'block' : 'hidden'} aria-hidden={phase !== 'assessment'}>
          <Assessment
            key={sessionKey}
            setResponses={setResponses}
            onComplete={startProcessing}
          />
        </div>
      ) : null}

      {phase === 'processing' ? (
        <Processing
          responseVector={responseVector}
          onDone={setDiagnosticResult}
          onBack={() => begin()}
        />
      ) : null}

      {phase === 'email' && diagnostic ? (
        <EmailGate
          diagnostic={diagnostic}
          responseVector={responseVector}
          onContinue={afterEmail}
        />
      ) : null}

      {phase === 'report' && diagnostic ? (
        <div className="min-h-svh">
          <header className="flex justify-end border-b border-white/5 px-4 py-3">
            <button
              type="button"
              className="text-xs text-text-dim hover:text-text-secondary"
              onClick={restart}
            >
              Exit
            </button>
          </header>
          <Report diagnostic={diagnostic} />
        </div>
      ) : null}
    </div>
  )
}
