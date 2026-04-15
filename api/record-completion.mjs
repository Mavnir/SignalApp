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

  const baseUrl = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').replace(/\/$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!baseUrl || !serviceKey) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(
      JSON.stringify({
        error:
          'Server missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL / SUPABASE_URL.',
      }),
    )
  }

  let body
  try {
    body = await parseJsonBody(req)
  } catch {
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'Invalid JSON body' }))
  }

  const table =
    (process.env.VITE_SUPABASE_COMPLETIONS_TABLE || process.env.SUPABASE_COMPLETIONS_TABLE || 'signal_completions').trim() ||
    'signal_completions'

  const row = {
    dominant_quadrant: body.dominant_quadrant ?? null,
    texture: body.texture ?? null,
  }

  const insertRes = await fetch(`${baseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  })

  const errText = await insertRes.text()
  if (!insertRes.ok) {
    res.statusCode = insertRes.status >= 400 && insertRes.status < 600 ? insertRes.status : 502
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: errText || 'Supabase insert failed' }))
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ ok: true }))
}
