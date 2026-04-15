import { SYSTEM_PROMPT } from './systemPrompt.js'

/** Production / preview: same-origin serverless route (see `/api/score.mjs`). */
async function scoreViaProxy(responseVector) {
  const res = await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responseVector }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(text || `Scoring proxy error ${res.status}`)
  }
  return JSON.parse(text)
}

/** Local dev: call OpenAI from the browser (requires `VITE_OPENAI_API_KEY`). */
async function scoreDirect(responseVector) {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) {
    throw new Error('Missing VITE_OPENAI_API_KEY (dev) or configure /api/score + OPENAI_API_KEY (prod)')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        temperature: 0.35,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Response vector: ${JSON.stringify(responseVector)}`,
          },
        ],
      }),
      signal: controller.signal,
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(errText || `OpenAI error ${res.status}`)
    }

    const data = await res.json()
    const raw = data.choices?.[0]?.message?.content
    if (!raw) throw new Error('Empty scoring response')
    return JSON.parse(raw)
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Dev (`vite`): direct OpenAI if `VITE_USE_API_PROXY` is not `"true"`.
 * Production build: uses `/api/score` unless `VITE_USE_API_PROXY=false` (e.g. `vite preview` with client key only).
 * @param {{ responses: Record<string, unknown> }} responseVector
 */
export async function scoreResponses(responseVector) {
  const forceClient =
    import.meta.env.DEV || import.meta.env.VITE_USE_API_PROXY === 'false'
  if (forceClient) {
    return scoreDirect(responseVector)
  }
  return scoreViaProxy(responseVector)
}
