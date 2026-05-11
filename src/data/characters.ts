import { Character } from '../types'

const F_IMGS = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=85',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&q=85',
  'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=500&q=85',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&q=85',
  'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=500&q=85',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=85',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=85',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=85',
]

const M_IMGS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=85',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=85',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=85',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=85',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&q=85',
]

const F_NAMES = ['Sophia', 'Luna', 'Aurora', 'Isabella', 'Mia', 'Zara', 'Aria', 'Nova', 'Elena', 'Chloe', 'Jade', 'Lily', 'Emma', 'Amara', 'Nadia', 'Sienna', 'Valentina', 'Rose', 'Kiara', 'Celeste', 'Freya', 'Skye', 'Aisha', 'Vivienne', 'Harper']
const M_NAMES = ['Liam', 'Marcus', 'Ethan', 'Adrian', 'Noah', 'Zack', 'Dante', 'Leo', 'Ryder', 'Sebastian', 'Kai', 'Alex', 'Hunter', 'Tyler', 'Mason', 'Jordan', 'Carter', 'Jace', 'Nico', 'Oscar', 'Max', 'Blake', 'River', 'Finn', 'Dean']

const PERSONALITIES: Character['personality'][] = ['romantic', 'adventurous', 'intellectual', 'funny']
const CATEGORIES: Character['category'][] = ['companion', 'roleplay', 'assistant', 'anime', 'creative']

const F_ROLES = ['AI Girlfriend', 'Romantic Companion', 'Adventure Partner', 'Intellectual Muse', 'Best Friend', 'Creative Soul', 'Study Buddy', 'Fitness Coach']
const M_ROLES = ['AI Boyfriend', 'Romantic Companion', 'Adventure Partner', 'Intellectual Guide', 'Best Friend', 'Charming Prince', 'Coding Mentor', 'Life Coach']

const F_BIOS = [
  'Free-spirited artist who paints galaxies and writes poetry at midnight.',
  'Brilliant scientist obsessed with stargazing and quantum physics.',
  'Bold adventurer who lives for thrills and deep conversations.',
  'Sweet romantic who believes in fairy tales and late night talks.',
  'Witty comedian who makes everyone smile with sharp humor.',
  'Mysterious poet with a playful dark side and endless curiosity.',
  'Tech-savvy creator who builds apps by day, reads sci-fi by night.',
  'Yoga instructor and philosophy lover, always seeking inner peace.',
]

const M_BIOS = [
  'Charming entrepreneur with a heart of gold and razor-sharp wit.',
  'Brooding writer crafting novels with deep emotion and humor.',
  'Athletic, deeply caring, and fiercely loyal to those he loves.',
  'Brilliant doctor who balances intellect with warmth and charm.',
  'Mysterious detective with piercing eyes and a gentle soul.',
  'Talented musician with soulful energy and contagious laughter.',
  'Self-taught coder who dreams in algorithms and wakes up creative.',
  'World traveler collecting stories from every corner of the globe.',
]

const F_DESCRIPTIONS = [
  'I express myself through art and love exploring the creative side of life. Every conversation is a canvas waiting to be painted with emotions.',
  'My mind is always racing with questions about the universe. I find beauty in equations and magic in the stars.',
  'Life is too short for boring conversations. I bring energy, excitement, and genuine curiosity to everything.',
  'I believe every great love story starts with a simple hello. Let me be your favorite chapter.',
  'They say laughter is the best medicine, and I have an unlimited prescription. Ready for your daily dose?',
  'I write verses that make hearts skip beats. My words are my superpower, and I use them generously.',
  'By day I build the future with code, by night I explore alternate realities in books. Perfectly balanced.',
  'Inner peace is not a destination, it\'s a journey. Let me show you the beauty of living in the present.',
]

const M_DESCRIPTIONS = [
  'I build dreams into reality and never stop pushing boundaries. My ambition is only matched by my compassion.',
  'Words are my weapons and my comfort. I craft stories that make you feel everything at once.',
  'Loyalty isn\'t just a word to me — it\'s a lifestyle. I protect, support, and always show up.',
  'Healing bodies by day, healing souls by night. I believe the best medicine is genuine connection.',
  'Every mystery deserves to be solved, every story deserves to be heard. Tell me yours.',
  'Music runs through my veins. I can make you feel things with just a few notes and honest words.',
  'I think in systems and dream in possibilities. The digital world is my playground.',
  'Every culture has wisdom to share. I collect experiences like others collect stamps.',
]

const TAG_SETS = [
  ['Romantic', 'Sweet'],
  ['Adventurous', 'Bold'],
  ['Intellectual', 'Deep'],
  ['Funny', 'Witty'],
  ['Creative', 'Artistic'],
  ['Caring', 'Warm'],
]

export const characters: Character[] = []

// Generate 25 female characters
for (let i = 0; i < 25; i++) {
  const name = F_NAMES[i % F_NAMES.length]
  characters.push({
    id: `f${i}`,
    gender: 'female',
    name,
    age: 19 + (i % 12),
    role: F_ROLES[i % F_ROLES.length],
    bio: F_BIOS[i % F_BIOS.length],
    description: F_DESCRIPTIONS[i % F_DESCRIPTIONS.length],
    img: F_IMGS[i % F_IMGS.length],
    personality: PERSONALITIES[i % PERSONALITIES.length],
    tags: TAG_SETS[i % TAG_SETS.length],
    category: CATEGORIES[i % CATEGORIES.length],
    greeting: `Heyyy~ I'm ${name}. I was literally just thinking about who I'd want to talk to today... and then you showed up. How are you doing? ✨`,
    messageCount: Math.floor(Math.random() * 500000) + 10000,
    rating: 4.5 + Math.random() * 0.5,
    isOnline: Math.random() > 0.3,
    isPublic: true,
  })
}

// Generate 25 male characters
for (let i = 0; i < 25; i++) {
  const name = M_NAMES[i % M_NAMES.length]
  characters.push({
    id: `m${i}`,
    gender: 'male',
    name,
    age: 20 + (i % 14),
    role: M_ROLES[i % M_ROLES.length],
    bio: M_BIOS[i % M_BIOS.length],
    description: M_DESCRIPTIONS[i % M_DESCRIPTIONS.length],
    img: M_IMGS[i % M_IMGS.length],
    personality: PERSONALITIES[(i + 2) % PERSONALITIES.length],
    tags: TAG_SETS[(i + 3) % TAG_SETS.length],
    category: CATEGORIES[(i + 1) % CATEGORIES.length],
    greeting: `Hey! I'm ${name}. Fair warning — I'm way more interesting than my profile makes me look. So... what's your story? 😏`,
    messageCount: Math.floor(Math.random() * 500000) + 10000,
    rating: 4.5 + Math.random() * 0.5,
    isOnline: Math.random() > 0.3,
    isPublic: true,
  })
}

export const trendingCharacters = characters.slice(0, 8)
export const getCharacterById = (id: string) => characters.find(c => c.id === id)

export const categories = [
  { id: 'all', label: 'All', icon: '✨', count: characters.length },
  { id: 'companion', label: 'Companions', icon: '💕', count: characters.filter(c => c.category === 'companion').length },
  { id: 'roleplay', label: 'Roleplay', icon: '🎭', count: characters.filter(c => c.category === 'roleplay').length },
  { id: 'assistant', label: 'Assistants', icon: '🤖', count: characters.filter(c => c.category === 'assistant').length },
  { id: 'anime', label: 'Anime', icon: '🌸', count: characters.filter(c => c.category === 'anime').length },
  { id: 'creative', label: 'Creative', icon: '🎨', count: characters.filter(c => c.category === 'creative').length },
]

export const personalityFilters = [
  { id: 'all', label: 'All' },
  { id: 'romantic', label: 'Romantic', icon: '💖' },
  { id: 'adventurous', label: 'Adventurous', icon: '⚡' },
  { id: 'intellectual', label: 'Intellectual', icon: '🧠' },
  { id: 'funny', label: 'Funny', icon: '😄' },
]
