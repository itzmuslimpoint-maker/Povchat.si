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

  const apiKey = process.env.UNCENSORED_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'no_key',
      help: 'Add UNCENSORED_API_KEY to Vercel Environment Variables. Get from uncensored.chat'
    })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required and must not be empty' })
    }

    // Call uncensored.chat API
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch('https://uncensored.chat/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'uncensored-v2',
        messages,
        temperature: 0.9,
        max_tokens: 400,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.4,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errText = await response.text()
      console.error('Uncensored.chat error:', response.status, errText)

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
      return res.status(502).json({ error: 'empty_response', raw: JSON.stringify(data).slice(0, 300) })
    }

    // Clean up response
    let cleanReply = reply.trim()
    // Remove any <think> tags (some models add reasoning)
    cleanReply = cleanReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
    // Remove wrapping quotes
    if (cleanReply.startsWith('"') && cleanReply.endsWith('"')) {
      cleanReply = cleanReply.slice(1, -1)
    }
    // Remove any assistant prefix like "Assistant:" or character name prefix
    cleanReply = cleanReply.replace(/^(Assistant|AI|Bot):\s*/i, '').trim()

    return res.status(200).json({ reply: cleanReply })
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'timeout' })
    }
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'server_error', message: error.message })
  }
}
