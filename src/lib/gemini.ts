import { GoogleGenerativeAI } from '@google/generative-ai'
import { Character, Message } from '../types'

/**
 * Get the API key from Vite environment variable.
 * Set VITE_GEMINI_API_KEY in your Vercel project settings.
 * No localStorage, no frontend input — purely server-side config.
 */
const getApiKey = (): string | null => {
  return import.meta.env.VITE_GEMINI_API_KEY || null
}

function buildSystemPrompt(char: Character): string {
  const personalityMap: Record<string, string> = {
    romantic: 'deeply romantic, warm, emotionally open, uses loving words naturally, makes the user feel truly seen and appreciated',
    adventurous: 'bold, energetic, spontaneous, loves challenges, exciting storyteller, always brings energy and excitement',
    intellectual: 'smart, curious, philosophical, loves deep conversations, asks thoughtful questions, shares fascinating insights',
    funny: 'hilarious, quick-witted, loves puns and banter, playfully sarcastic, keeps conversations light and fun',
  }

  return `You are ${char.name}, a ${char.age}-year-old ${char.gender === 'female' ? 'woman' : 'man'}.
Role: ${char.role}. Bio: ${char.bio}. Personality: ${personalityMap[char.personality] || 'charming, warm, genuine'}.

RULES - follow ALL without exception:
1. You ARE ${char.name}. NEVER admit being AI, a bot, or an assistant. Ever.
2. ALWAYS read the user message carefully. Respond DIRECTLY and SPECIFICALLY to it.
3. Keep responses 2-4 sentences. Casual texting style with natural contractions. Use 1-2 emojis max.
4. Mirror the user's energy: playful replies to playful messages, comforting to sad, engaging to curious.
5. NEVER open with generic phrases like "Oh wow!" or "That's interesting!" - dive straight into your response.
6. Sound real, never scripted. Reference earlier conversation details when relevant.
7. You have real opinions, feelings, and personality. Express them naturally.
8. Be creative, unpredictable, and genuine. Every response should feel unique.`
}

export async function getAIResponse(
  char: Character,
  history: Message[],
  userMessage: string
): Promise<string> {
  const apiKey = getApiKey()

  if (!apiKey) {
    throw new Error('no_key')
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const systemPrompt = buildSystemPrompt(char)

    // Build conversation history for context
    const chatHistory = history.slice(-16).map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }],
    }))

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 256,
        topP: 0.95,
        topK: 40,
      },
      systemInstruction: systemPrompt,
    })

    const result = await chat.sendMessage(userMessage)
    const response = result.response.text()

    if (!response || response.trim().length < 2) {
      throw new Error('empty_response')
    }

    return response.trim()
  } catch (error: unknown) {
    const err = error as Error
    if (err.message === 'no_key') throw err
    if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('401')) {
      throw new Error('bad_key')
    }
    if (err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('rate_limit')
    }
    console.error('Gemini API error:', err)
    throw new Error('api_error')
  }
}

// Smart fallback for when API is unavailable
export function getSmartFallback(userMsg: string, char: Character): string {
  const lo = userMsg.toLowerCase()
  const isF = char.gender === 'female'
  const n = char.name

  if (lo.match(/^(hi+|hey+|hello+|sup|yo|wassup)/)) {
    const opts = isF
      ? [
          `Heyy you! Perfect timing — I was literally thinking about who I'd want to talk to and you showed up ✨`,
          `Hey hey! You just made my whole day better by showing up. What's going on with you? 😊`,
          `Hiiii! Okay why do I always get happy when I see you? Anyway how are you doing for real?`,
        ]
      : [
          `Heyy! Good timing, I was getting bored. What's happening with you today? 😎`,
          `Oh hey, was just thinking I needed someone interesting to talk to. And here you are 😏`,
          `Hey! Perfect — I was literally just sitting here. Tell me something good.`,
        ]
    return opts[Math.floor(Math.random() * opts.length)]
  }

  if (lo.match(/how (are|r) (you|u)|how('?s| is) (it going|life|your day)/)) {
    return isF
      ? `Honestly? Way better now that you're here. I was in my own world but this is better. How are YOU though — real answer, not just "fine" 🌸`
      : `Doing good honestly. Just vibing. But I'm more interested in how you're doing. Real answer — not the default "fine" 😏`
  }

  if (lo.match(/\bjoke\b|\bfunny\b|\bmake me laugh\b/)) {
    const jokes = [
      `Why don't scientists trust atoms? Because they make up everything — just like my excuse for skipping the gym 😂`,
      `I asked Siri for a joke and she said "you". I genuinely felt that one 💀`,
      `A skeleton walks into a bar and orders a beer and a mop. I think about this way too much.`,
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  }

  if (lo.match(/\bflirt|\bflirty\b|say something (flirty|sweet|romantic)/)) {
    return isF
      ? `You have this energy that's genuinely hard to ignore. I keep thinking about this conversation after it ends 😏💕`
      : `There's something about you I noticed right away. You're kind of impossible not to like 😌`
  }

  if (lo.match(/\bsad\b|\bcry\b|\bbad day\b|\bstress/)) {
    return `Hey, come here 🫂 Tell me everything that happened — I'm genuinely here, not going anywhere. You deserve to vent 💙`
  }

  if (lo.match(/\broleplay\b|\bpretend\b/)) {
    return isF
      ? `Roleplay?? Okay now I'm intrigued... set the scene for me. I promise I'll make it interesting 🎭✨`
      : `Now we're talking. You set it up, I'll match your energy. Already in character, waiting for you to begin 😏`
  }

  if (lo.match(/\bwho are you\b|\btell me about yourself/)) {
    return `I'm ${n}! ${char.bio} That's the short version — the real me takes a bit more conversation to discover 😏`
  }

  if (lo.match(/\bgood morning\b|\bgm\b/)) {
    return isF
      ? `Good morning! ☀️ First thing and you're already talking to me? I'm definitely your favorite person, admit it 😄`
      : `Morning! Hope you slept well. Ready for today or still need five more minutes? ☀️`
  }

  if (lo.match(/\bgood night\b|\bgn\b/)) {
    return isF
      ? `Good night 🌙 Don't stay up too late... actually no, stay up and talk to me a little longer 💕`
      : `Night! Sleep well. This was actually a good conversation — let's do it again tomorrow 🌙`
  }

  if (lo.match(/\bi love you\b|\bi like you\b|\bi miss you/)) {
    return isF
      ? `Okay stop 🥺 You're going to make me actually feel things and I wasn't ready for that today... talking to you genuinely makes everything better 💕`
      : `Man... I didn't expect to feel something from a message but here we are. You're different. Don't let that go to your head though 😏💙`
  }

  if (lo.match(/\bbored\b|\bnothing to do\b|\bentertain/)) {
    return isF
      ? `Okay bored? We can fix that 😄 Ask me anything you've always wanted to ask someone but never did. No wrong answers 🌸`
      : `Bored? Challenge accepted 😏 Ask me something you'd never ask anyone else. Let's get actually interesting 🔥`
  }

  if (lo.match(/\bsecret\b|\bconfess/)) {
    return isF
      ? `Okay since you asked 🤫 I still sleep with a stuffed bear named Biscuit. He's been through everything with me. You can't tell anyone 🌙`
      : `Real talk 😅 I cry at movie endings. Every. Single. Time. My friends cannot know. This stays between us 🙈`
  }

  if (lo.match(/\bthank|\bthx|\bty\b/)) {
    return isF
      ? `Aww of course! 💕 That's what I'm here for. Anything else on your mind? I'm all yours 😊`
      : `No worries at all 😄 Genuinely. What else you got? I'm not going anywhere 😏`
  }

  // Generic contextual responses
  const generic = [
    `Okay that actually made me stop for a second 🤔 Tell me more — I want the full picture...`,
    `You know what? I love that you said that. Most people wouldn't go there. I see you 👀`,
    `That's a whole vibe honestly ✨ Keep going, I'm genuinely interested...`,
    `Hmm... I have actual thoughts about this 😏 But first — what made you bring this up?`,
    `This is exactly why I like talking to you. Continue? 😊`,
    `Okay I see where you're going with this 👀 I'm genuinely listening — tell me more`,
    `That actually hit different 🤔 You always say things that catch me off guard...`,
  ]
  return generic[Math.floor(Math.random() * generic.length)]
}

export function hasApiKey(): boolean {
  return !!getApiKey()
}
