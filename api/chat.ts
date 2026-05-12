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

  // Read the API key from environment variable
  const apiKey = process.env.DEEPSEEK_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'no_key',
      help: 'Add DEEPSEEK_KEY to Vercel Environment Variables'
    })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array required' })
    }

    // Call DeepSeek API (OpenAI-compatible format)
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.9,
        max_tokens: 300,
        top_p: 0.95,
        frequency_penalty: 0.4,
        presence_penalty: 0.4,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('DeepSeek API error:', response.status, errText)

      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({ error: 'invalid_key' })
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'rate_limit' })
      }
      return res.status(502).json({ error: 'api_error', status: response.status, details: errText })
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content

    if (!reply || reply.trim().length < 2) {
      return res.status(502).json({ error: 'empty_response' })
    }

    // Clean response
    let clean = reply.trim()
    // Remove <think> reasoning tags if present
    clean = clean.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
    // Remove wrapping quotes
    if (clean.startsWith('"') && clean.endsWith('"')) {
      clean = clean.slice(1, -1)
    }

    return res.status(200).json({ reply: clean })
  } catch (error: any) {
    console.error('Server error:', error)
    return res.status(500).json({ error: 'server_error', message: error.message })
  }
}
