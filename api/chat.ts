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
      error: 'no_key',
      help: 'Add DEEPINFRA_API_KEY to Vercel Environment Variables'
    })
  }

  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required and must not be empty' })
    }

    // Call DeepInfra OpenAI-compatible endpoint
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages,
        temperature: 0.9,
        max_tokens: 350,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.4,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const errText = await response.text()
      console.error('DeepInfra error:', response.status, errText)

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
      return res.status(502).json({ error: 'empty_response', raw: JSON.stringify(data).slice(0, 200) })
    }

    // Clean up any <think> tags that DeepSeek sometimes adds
    let cleanReply = reply.trim()
    cleanReply = cleanReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
    // Remove any leading/trailing quotes if the whole response is wrapped
    if (cleanReply.startsWith('"') && cleanReply.endsWith('"')) {
      cleanReply = cleanReply.slice(1, -1)
    }

    return res.status(200).json({ reply: cleanReply })
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'timeout', help: 'Request took too long' })
    }
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'server_error', message: error.message })
  }
}
