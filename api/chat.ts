import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.DEEPINFRA_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured',
      help: 'Add DEEPINFRA_API_KEY to Vercel Environment Variables. Get key from deepinfra.com/dash/api_keys'
    })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages,
        temperature: 0.85,
        max_tokens: 300,
        top_p: 0.95,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('DeepInfra error:', response.status, errText)

      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({ error: 'invalid_key', help: 'DEEPINFRA_API_KEY is invalid.' })
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'rate_limit' })
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
