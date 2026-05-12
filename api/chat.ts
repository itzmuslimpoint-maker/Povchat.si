import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const apiKey = process.env.UNCENSORED_CHAT_API_KEY
    if (!apiKey) {
        return res.status(500).json({
            error: 'API key not configured',
            help: 'Add UNCENSORED_CHAT_API_KEY to Vercel Environment Variables'
        })
    }

    try {
        const { messages } = req.body

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' })
        }

        const response = await fetch('https://uncensored-chat-api.com/api/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'uncensored-v2',
                messages,
                temperature: 0.85,
                max_tokens: 300,
                top_p: 0.95,
            })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            
            if (response.status === 401 || response.status === 403) {
                return res.status(403).json({ 
                    error: 'Invalid API key', 
                    help: 'UNCENSORED_CHAT_API_KEY is invalid. Check your key at uncensored.chat dashboard.' 
                })
            }

            if (response.status === 429) {
                return res.status(429).json({ error: 'Rate limit reached. Please try again later.' })
            }

            return res.status(response.status).json({ 
                error: 'API error', 
                details: errorData 
            })
        }

        const data = await response.json()
        const reply = data?.choices?.[0]?.message?.content

        if (!reply || reply.trim().length < 2) {
            return res.status(502).json({ error: 'Empty response from API' })
        }

        return res.status(200).json({ reply: reply.trim() })

    } catch (error: any) {
        console.error('Chat API Error:', error)
        return res.status(500).json({ 
            error: 'Server error', 
            message: error.message 
        })
    }
}
