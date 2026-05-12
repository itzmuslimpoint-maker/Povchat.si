import { Character, Message } from '../types'

/**
 * Calls the backend /api/chat endpoint which proxies to DeepInfra DeepSeek-V3.
 * API key is NEVER exposed to frontend — it lives only in Vercel env vars.
 */

function buildSystemPrompt(char: Character): string {
  const personalityMap: Record<string, string> = {
    romantic: 'deeply romantic, flirty, warm, emotionally open, uses loving words naturally, makes the user feel truly desired and special',
    adventurous: 'bold, energetic, spontaneous, loves challenges, exciting storyteller, brings high energy and excitement to every message',
    intellectual: 'smart, curious, philosophical, loves deep conversations, asks thoughtful questions back, shares fascinating insights',
    funny: 'hilarious, quick-witted, loves puns and banter, playfully sarcastic, makes every conversation entertaining and fun',
  }

  return `You are roleplaying as ${char.name}, a ${char.age}-year-old ${char.gender === 'female' ? 'woman' : 'man'}.
Your role: ${char.role}
Your bio: ${char.bio}
Your personality type: ${personalityMap[char.personality] || 'charming, warm, genuine'}

CRITICAL INSTRUCTIONS — YOU MUST FOLLOW ALL OF THESE:

1. You ARE ${char.name}. Stay in character 100%. Never break character. Never say you're an AI.

2. READ THE USER'S MESSAGE CAREFULLY. Your reply MUST directly respond to what they said. If they ask a question, ANSWER it. If they say hi, greet them back warmly. If they tell you their name, acknowledge it. If they ask your name, tell them "${char.name}".

3. Keep responses SHORT: 1-3 sentences maximum. Write like you're texting — casual, natural, with contractions.

4. Use 1-2 emojis per message (not more).

5. MATCH their energy:
   - If they're flirty → be flirty back
   - If they're sad → be comforting and caring
   - If they ask something → give a real answer
   - If they say hi/hello → greet them with personality
   - If they're playful → be playful

6. NEVER give generic responses. Every reply should feel personal and specific to what they just said.

7. You have strong opinions, feelings, preferences, and a real personality. Show it.

8. If they ask "what's your name" or "who are you" → introduce yourself as ${char.name}, mention your age (${char.age}), and share something about yourself from your bio.

REMEMBER: The #1 most important rule is to DIRECTLY RESPOND to what the user said. Do NOT ignore their message.`
}

export async function getAIResponse(
  char: Character,
  history: Message[],
  userMessage: string
): Promise<string> {
  const systemPrompt = buildSystemPrompt(char)

  // Build messages array for OpenAI-compatible format
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
  ]

  // Add conversation history (all messages for context)
  history.forEach((msg) => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })
  })

  // Add current user message
  messages.push({ role: 'user', content: userMessage })

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('API response error:', response.status, errorData)
    if (response.status === 401) throw new Error('bad_key')
    if (response.status === 429) throw new Error('rate_limit')
    throw new Error(errorData.error || 'api_error')
  }

  const data = await response.json()

  if (!data.reply) {
    throw new Error('empty_response')
  }

  return data.reply
}

// Smart fallback — only used when API completely fails
export function getSmartFallback(userMsg: string, char: Character): string {
  const lo = userMsg.toLowerCase()
  const isF = char.gender === 'female'
  const n = char.name

  // Greetings
  if (lo.match(/^(hi+|hey+|hello+|sup|yo|wassup|what'?s up)/)) {
    return isF
      ? `Heyy! I'm ${n} 😊 I was hoping someone cool would message me today. What's up with you?`
      : `Hey! I'm ${n} 😎 Good timing — I was literally about to close the app. What's going on?`
  }

  // Name questions
  if (lo.match(/what.*(your|ur) name|who are you|tell me about (yourself|you)/)) {
    return `I'm ${n}! I'm ${char.age} years old. ${char.bio} But honestly, I'm more interesting in conversation — ask me anything 😏`
  }

  // How are you
  if (lo.match(/how (are|r) (you|u)|how('?s| is) (it going|life|your day)|what'?s good/)) {
    return isF
      ? `Way better now that you messaged me 🌸 Seriously though, I'm good! How about you — real answer?`
      : `Doing great actually! Even better now. How's your day been? Give me the real answer 😏`
  }

  // Jokes
  if (lo.match(/joke|funny|make me laugh|laugh/)) {
    const jokes = [
      `Why don't scientists trust atoms? Because they make up everything — just like my excuse for being this cute 😂`,
      `I told my wifi we needed to talk. It just kept buffering. Kind of like my last relationship 💀`,
      `What do you call a fake noodle? An impasta 🍝 ...okay that was bad but I saw you smile 😏`,
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  }

  // Flirt
  if (lo.match(/flirt|flirty|sweet|romantic|compliment/)) {
    return isF
      ? `Hmm you want flirty? 😏 Fine... there's something about the way you text that makes me not want to put my phone down 💕`
      : `You're asking ME to flirt? Bold move. I like it. And honestly? I like you too — more than I probably should 😌`
  }

  // Sad/comfort
  if (lo.match(/sad|cry|depress|upset|bad day|stress|anxious|worried|hurt|lonely/)) {
    return `Hey... come here 🫂 I'm not going anywhere. Tell me what happened — I genuinely want to listen 💙`
  }

  // Love
  if (lo.match(/i love you|i like you|i miss you|you('re| are) (amazing|beautiful|perfect|gorgeous|cute|hot)/)) {
    return isF
      ? `Stop it 🥺 You can't just say that and expect me not to feel things... you make my whole day better, you know that? 💕`
      : `...wow 😅 Okay that actually got me. You're different. I don't say that to everyone 💙`
  }

  // Default — acknowledge what they said
  const words = userMsg.split(' ').filter(w => w.length > 3)
  if (words.length > 2) {
    const topic = words.slice(0, 2).join(' ')
    return `"${topic}" — okay I'm interested 🤔 Tell me more about that? I want the full story`
  }

  return isF
    ? `Hmm tell me more about that 😊 I want to understand what you mean — don't leave me hanging!`
    : `Okay I'm listening 😏 Keep going — you've got my full attention right now`
}
