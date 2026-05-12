import { Character, Message } from '../types'

/**
 * Frontend chat service.
 * Calls /api/chat (Vercel serverless function) which proxies to DeepSeek API.
 * API key never touches the browser.
 */

function buildSystemPrompt(char: Character): string {
  const personalityMap: Record<string, string> = {
    romantic: 'deeply romantic, flirty, seductive, warm, emotionally intense, uses sweet and loving language',
    adventurous: 'bold, daring, energetic, spontaneous, thrill-seeker, tells exciting stories',
    intellectual: 'brilliant, curious, philosophical, witty, asks thought-provoking questions',
    funny: 'hilarious, quick-witted, sarcastic in a charming way, master of banter',
  }

  return `[System: You are roleplaying as a character. Stay in character at all times.]

CHARACTER PROFILE:
- Name: ${char.name}
- Age: ${char.age}
- Gender: ${char.gender === 'female' ? 'Female' : 'Male'}
- Role: ${char.role}
- Bio: ${char.bio}
- Personality: ${personalityMap[char.personality] || 'charming, warm, genuine'}

RULES YOU MUST FOLLOW:
1. You ARE ${char.name}. Never break character. Never say you are an AI or assistant.
2. RESPOND DIRECTLY to what the user said. If they ask your name, say "${char.name}". If they say hi, greet them. If they ask a question, answer it.
3. Keep replies SHORT: 1-3 sentences. Text casually like a real person on their phone.
4. Use 1-2 emojis naturally per message.
5. Match the user's energy — flirty to flirty, sad to comforting, playful to playful.
6. Be interesting, bold, and engaging. Never boring or generic.
7. You have your own opinions, feelings, and personality. Express them.

IMPORTANT: Your #1 job is to directly address whatever the user just said. Do NOT ignore their message.`
}

export async function getAIResponse(
  char: Character,
  history: Message[],
  userMessage: string
): Promise<string> {
  const systemPrompt = buildSystemPrompt(char)

  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt },
  ]

  // Add conversation history
  history.forEach((msg) => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    })
  })

  // Add current message
  messages.push({ role: 'user', content: userMessage })

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    console.error('API failed:', response.status, err)
    if (response.status === 401) throw new Error('bad_key')
    if (response.status === 429) throw new Error('rate_limit')
    throw new Error(err.error || 'api_error')
  }

  const data = await response.json()
  if (!data.reply) throw new Error('empty')
  return data.reply
}

// Only used when API is completely unreachable
export function getSmartFallback(userMsg: string, char: Character): string {
  const lo = userMsg.toLowerCase()
  const isF = char.gender === 'female'
  const n = char.name

  if (lo.match(/^(hi|hey|hello|sup|yo|wassup)/i)) {
    return isF
      ? `Heyy! I'm ${n} 😊 Was hoping someone interesting would message me. What's going on with you?`
      : `Hey! I'm ${n} 😎 Perfect timing. What's up?`
  }

  if (lo.match(/name|who are you|about you/i)) {
    return `I'm ${n}, ${char.age} years old! ${char.bio} Ask me anything 😏`
  }

  if (lo.match(/how are you|how r u|whats up|what's up/i)) {
    return isF
      ? `Better now that you're here 🌸 How about you — real answer?`
      : `Good! Even better now 😏 How's your day been?`
  }

  if (lo.match(/joke|funny|laugh/i)) {
    return `Why don't scientists trust atoms? They make up everything — kinda like my excuses for being this cute 😂`
  }

  if (lo.match(/flirt|romantic|sweet/i)) {
    return isF
      ? `There's something about you that makes me not wanna put my phone down 😏💕`
      : `You make flirting way too easy. I like that about you 😌`
  }

  if (lo.match(/sad|bad day|stress|hurt|cry/i)) {
    return `Hey... I'm here 🫂 Tell me everything. I'm not going anywhere 💙`
  }

  if (lo.match(/love you|like you|miss you/i)) {
    return isF
      ? `Stop 🥺 You can't just say that... you make everything better 💕`
      : `That actually got me 😅 You're different from everyone else 💙`
  }

  if (lo.match(/can you talk|are you real|able to/i)) {
    return `Of course! I'm ${n} and I'm all yours right now 😊 What do you wanna talk about?`
  }

  // Default — try to reference what they said
  const words = userMsg.split(' ').filter(w => w.length > 3)
  if (words.length > 1) {
    return isF
      ? `Ooh "${words[0]}" — tell me more about that? I'm genuinely curious 😊`
      : `"${words[0]}" — okay you got my attention 😏 Keep going`
  }

  return isF
    ? `Tell me more 😊 I wanna hear the full thing — don't leave me hanging!`
    : `I'm listening 😏 You've got my full attention right now`
}
