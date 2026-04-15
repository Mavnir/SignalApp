import { SYSTEM_PROMPT } from '../signal/src/services/systemPrompt.js'

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => {
      raw += c
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.statusCode = 204
    return res.end()
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Method not allowed' }))
  }

  const key = process.env.OPENAI_API_KEY
  if (!key) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Missing OPENAI_API_KEY on server' }))
  }

  let body
  try {
    body = await parseJsonBody(req)
  } catch {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Invalid JSON body' }))
  }

  const responseVector = body.responseVector
  if (!responseVector || typeof responseVector !== 'object') {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Expected { responseVector: object }' }))
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const ores = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const text = await ores.text()
    if (!ores.ok) {
      res.statusCode = ores.status >= 400 && ores.status < 600 ? ores.status : 502
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: text || 'OpenAI error' }))
    }

    const data = JSON.parse(text)
    const raw = data.choices?.[0]?.message?.content
    if (!raw) {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: 'Empty model response' }))
    }

    const diagnostic = JSON.parse(raw)
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify(diagnostic))
  } catch (e) {
    const msg = e?.name === 'AbortError' ? 'OpenAI request timed out' : e?.message || 'Scoring failed'
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: msg }))
  } finally {
    clearTimeout(timeout)
  }
}
