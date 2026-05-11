import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for the frontend
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured',
      help: 'Add OPENROUTER_API_KEY to Vercel Environment Variables. Get key from openrouter.ai/keys (starts with sk-or-v1-)'
    })
  }

  // Validate the key format
  if (!apiKey.startsWith('sk-or-')) {
    return res.status(500).json({
      error: 'Invalid API key format',
      help: 'OPENROUTER_API_KEY must start with sk-or-v1-... Get it from openrouter.ai/keys. You may have pasted the model name instead of the key.'
    })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.referer || req.headers.origin || 'https://povchat.vercel.app',
        'X-Title': 'POVChat',
      },
      body: JSON.stringify({
        model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        messages,
        temperature: 0.85,
        max_tokens: 300,
        top_p: 0.95,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('OpenRouter error:', response.status, errText)

      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({
          error: 'invalid_key',
          help: 'Your OPENROUTER_API_KEY is invalid. Go to openrouter.ai/keys to create a new key (starts with sk-or-v1-)'
        })
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'rate_limit', help: 'Too many requests. Wait a moment and try again.' })
      }
      return res.status(502).json({ error: 'api_error', details: errText })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content

    if (!reply || reply.trim().length < 2) {
      return res.status(502).json({ error: 'empty_response' })
    }

    return res.status(200).json({ reply: reply.trim() })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'server_error', message: error.message })
  }
}
