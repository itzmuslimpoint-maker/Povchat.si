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

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
        return res.status(500).json({
            error: 'API key not configured',
            help: 'Add DEEPSEEK_API_KEY to Vercel Environment Variables. Get key from platform.deepseek.com/api_keys'
        })
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

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages,
                temperature: 0.85,
                max_tokens: 300,
                top_p: 0.95,
            })
        })

        if (!response.ok) {
            const errorText = await response.text()

            if (response.status === 401 || response.status === 403) {
                return res.status(403).json({ 
                    error: 'Invalid API key', 
                    help: 'DEEPSEEK_API_KEY is invalid. Get valid key from platform.deepseek.com/api_keys' 
                })
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

            return res.status(502).json({ 
                error: 'API error', 
                details: errorText 
            })
        }

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
