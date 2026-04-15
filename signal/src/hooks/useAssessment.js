import { useState, useCallback } from 'react'

export function useAssessment() {
  const [phase, setPhase] = useState('landing')
  const [responseVector, setResponseVector] = useState(() => ({ responses: {} }))
  const [diagnostic, setDiagnostic] = useState(null)
  const [processingError, setProcessingError] = useState(null)

  const begin = useCallback(() => {
    setPhase('assessment')
    setProcessingError(null)
  }, [])

  const setResponses = useCallback((updater) => {
    setResponseVector((prev) => (typeof updater === 'function' ? updater(prev) : updater))
  }, [])

  const startProcessing = useCallback(() => {
    setPhase('processing')
    setProcessingError(null)
  }, [])

  const setDiagnosticResult = useCallback((d) => {
    setDiagnostic(d)
    setPhase('email')
  }, [])

  const failProcessing = useCallback((err) => {
    setProcessingError(err?.message || 'Something went wrong.')
    setPhase('assessment')
  }, [])

  const afterEmail = useCallback(() => {
    setPhase('report')
  }, [])

  const restart = useCallback(() => {
    setPhase('landing')
    setResponseVector({ responses: {} })
    setDiagnostic(null)
    setProcessingError(null)
  }, [])

  return {
    phase,
    setPhase,
    responseVector,
    setResponses,
    diagnostic,
    setDiagnosticResult,
    processingError,
    begin,
    startProcessing,
    failProcessing,
    afterEmail,
    restart,
  }
}
