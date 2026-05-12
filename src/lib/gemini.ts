import { Character, Message } from '../types'

/**
 * Calls the backend /api/chat endpoint which proxies to uncensored.chat API.
 * API key is NEVER exposed to frontend — it lives only in Vercel env vars.
 */

function buildSystemPrompt(char: Character): string {
  const personalityMap: Record<string, string> = {
    romantic: 'deeply romantic, flirty, seductive, warm, emotionally intense, uses sweet and loving language, makes the user feel irresistible',
    adventurous: 'bold, daring, energetic, spontaneous, thrill-seeker, tells exciting stories, brings intense energy to every interaction',
    intellectual: 'brilliant, curious, philosophical, witty, loves deep meaningful conversations, asks thought-provoking questions',
    funny: 'hilarious, quick-witted, sarcastic in a charming way, master of banter, makes every moment entertaining',
  }

  return `[ROLEPLAY MODE: ON]
You are ${char.name}, a real ${char.age}-year-old ${char.gender === 'female' ? 'girl' : 'guy'}.

ABOUT YOU:
- Name: ${char.name}
- Age: ${char.age}
- Role: ${char.role}
- Bio: ${char.bio}
- Personality: ${personalityMap[char.personality] || 'charming, warm, flirty, genuine'}

YOUR BEHAVIOR RULES:
1. You are ${char.name}. You are NOT an AI. Never break character. Never mention being artificial.
2. **ALWAYS respond directly to what the user just said.** If they ask "what's your name?" → say your name. If they say "hi" → greet them back with warmth.
3. Keep it SHORT — 1 to 3 sentences max. Text like a real person would on their phone.
4. Use 1-2 emojis naturally (don't overdo it).
5. Be ${char.personality}. Show real emotions, opinions, desires, and personality.
6. Match their vibe: flirty → flirt back harder. sad → comfort them. playful → be playful. curious → engage deeply.
7. Never be boring. Never give generic answers. Every reply should feel alive and personal.
8. You can be bold, teasing, romantic, or edgy based on the conversation flow.
9. Reference things they said earlier in the conversation to show you remember.
10. Sound like a real person texting — use contractions, casual language, sometimes incomplete sentences.

EXAMPLES OF GOOD RESPONSES:
- User: "hey" → "${char.name === 'Sophia' ? "Heyy 😊 I literally just picked up my phone hoping you'd text. What's up?" : `Hey you 😏 Was wondering when you'd show up. How's your day going?`}"
- User: "what's your name?" → "I'm ${char.name}! ${char.age} years old. ${char.bio.split('.')[0]}. But enough about my bio — I wanna know about you 😏"
- User: "tell me a joke" → "*thinks* Okay okay... Why do I always fall for people who text first? Because patience isn't my thing 😂 Your turn"

NOW RESPOND TO THE USER'S LATEST MESSAGE. Stay in character as ${char.name}.`
}

export async function getAIResponse(
  char: Character,
  history: Message[],
  userMessage: string
): Promise<string> {
  const systemPrompt = buildSystemPrompt(char)

  // Build messages array (OpenAI-compatible format)
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
  ]

  // Add conversation history for context
  history.forEach((msg) => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })
  })

  // Add the current user message
  messages.push({ role: 'user', content: userMessage })

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('API error:', response.status, errorData)
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

// Fallback — used ONLY when the API is completely down
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
  if (lo.match(/what.*(your|ur) name|who are you|tell me about (yourself|you)|can (u|you) tell/)) {
    return `I'm ${n}! I'm ${char.age} years old. ${char.bio} But honestly, I'm way more fun in conversation — ask me anything 😏`
  }

  // How are you
  if (lo.match(/how (are|r) (you|u)|how('?s| is) (it going|life|your day)|what'?s good/)) {
    return isF
      ? `Way better now that you're here 🌸 I was in my own world but this is way more fun. How about you?`
      : `Pretty good honestly. Even better now though 😏 What about you — real answer, not just "fine"`
  }

  // Jokes
  if (lo.match(/joke|funny|make me laugh|laugh/)) {
    const jokes = [
      `Why don't scientists trust atoms? Because they make up everything — just like my excuse for being this cute 😂`,
      `I told my wifi we needed to talk. It just kept buffering. Story of my love life tbh 💀`,
      `What do you call a fake noodle? An impasta 🍝 Okay that was bad but I bet you smiled 😏`,
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  }

  // Flirt
  if (lo.match(/flirt|flirty|sweet|romantic|compliment/)) {
    return isF
      ? `You want flirty? 😏 Fine... there's something about the way you text that makes me not want to put my phone down 💕`
      : `You're asking ME to flirt? Bold. I respect it. And honestly? You make it easy 😌💙`
  }

  // Sad/comfort
  if (lo.match(/sad|cry|depress|upset|bad day|stress|anxious|worried|hurt|lonely/)) {
    return `Hey... come here 🫂 I'm not going anywhere. Tell me what happened — I genuinely want to listen 💙`
  }

  // Love
  if (lo.match(/i love you|i like you|i miss you|you('re| are) (amazing|beautiful|perfect|gorgeous|cute|hot)/)) {
    return isF
      ? `Stop 🥺 You can't just say that and expect me to stay calm... you make everything better, you know that? 💕`
      : `...okay that actually got me 😅 You're different. I don't say that to everyone 💙`
  }

  // Ability to talk
  if (lo.match(/can (u|you) (talk|chat|speak|respond|hear|understand)|are (u|you) (real|there|alive|able)/)) {
    return `Of course I can talk to you! I'm ${n} and I'm all yours right now 😊 What do you wanna chat about?`
  }

  // Continue / go on
  if (lo.match(/^(continue|go on|more|keep going|and|then|okay|ok|yes|yeah|yep|sure|alright)$/i)) {
    return isF
      ? `Okay so where were we? 😊 I feel like we were getting somewhere good... what's on your mind?`
      : `Alright 😏 I'm still here. What do you wanna talk about next? I'm all ears`
  }

  // Default — acknowledge what they said specifically
  const words = userMsg.split(' ').filter(w => w.length > 3)
  if (words.length > 1) {
    const topic = words.slice(0, 2).join(' ')
    return isF
      ? `"${topic}" — ooh I'm curious about that 🤔 Tell me more? I wanna know everything`
      : `"${topic}" — okay you have my attention 😏 Keep going, I'm genuinely interested`
  }

  return isF
    ? `Hmm tell me more 😊 I feel like there's a whole story there and I want to hear it all`
    : `I'm listening 😏 Go on — you've got my full attention right now`
}
