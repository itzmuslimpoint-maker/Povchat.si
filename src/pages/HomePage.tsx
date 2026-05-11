import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, MessageSquare, Brain, Zap, Heart, Shield, Star } from 'lucide-react'
import Badge from '../components/ui/Badge'
import CharacterCard from '../components/characters/CharacterCard'
import { trendingCharacters } from '../data/characters'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 md:py-28 px-4 md:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(168,85,247,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_8%_80%,rgba(255,77,170,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_92%_60%,rgba(56,189,248,0.07),transparent_60%)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <Badge variant="purple" className="mb-6">
              <Sparkles className="w-3 h-3" /> AI-Powered Companions
            </Badge>

            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6">
              Chat with Your
              <br />
              <span className="gradient-text">Dream Character</span>
              <br />
              Anytime
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2">
              50+ AI companions with real personality, humor, and emotional intelligence.
              Powered by Gemini AI for genuine conversations that feel alive.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-14 mb-8 sm:mb-10">
              {[
                { value: '50+', label: 'Characters' },
                { value: '10M+', label: 'Messages' },
                { value: '4.9★', label: 'Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-xl sm:text-2xl md:text-3xl font-black gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-text-muted uppercase tracking-widest mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap px-2">
              <Link
                to="/explore"
                className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 shadow-xl shadow-accent-purple/30"
              >
                <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5" />
                Start Chatting Free
              </Link>
              <Link
                to="/explore"
                className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4"
              >
                Explore Characters
              </Link>
            </div>
          </motion.div>

          {/* Hero Character Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          >
            {trendingCharacters.slice(0, 4).map((char, i) => (
              <Link
                key={char.id}
                to={`/chat/${char.id}`}
                className="relative rounded-2xl overflow-hidden border border-white/[0.07] group
                  hover:border-accent-purple/30 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <img
                  src={char.img}
                  alt={char.name}
                  className="w-full h-36 sm:h-40 md:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse-soft" />
                  <span className="text-xs font-bold text-white">
                    {char.name} · {char.age}
                  </span>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-white/[0.05] bg-dark-100 py-4 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
          {[
            '💬 Real Humor AI',
            '🎭 Deep Personality',
            '🧠 Memory System',
            '❤️ Emotional IQ',
            '⚡ Gemini Powered',
            '🔥 50+ Characters',
            '💬 Real Humor AI',
            '🎭 Deep Personality',
            '🧠 Memory System',
            '❤️ Emotional IQ',
            '⚡ Gemini Powered',
            '🔥 50+ Characters',
          ].map((text, i) => (
            <span key={i} className="text-sm font-bold text-text-secondary">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Trending Characters */}
      <section className="py-16 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="pink" className="mb-4">
            🌟 Trending Now
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-black mb-4">
            Popular <span className="gradient-text">AI Companions</span>
          </h2>
          <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto">
            Our most loved characters with real humor, emotion, and memory.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {trendingCharacters.map((char, i) => (
            <CharacterCard key={char.id} character={char} index={i} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/explore"
            className="btn-secondary px-8 py-3"
          >
            View All Characters →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-dark-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="blue" className="mb-4">
              🚀 Simple & Fast
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-black">
              Start Chatting in <span className="gradient-text">Seconds</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: 1, title: 'Browse', desc: 'Explore 50+ unique AI companions with different personalities.', icon: Sparkles },
              { num: 2, title: 'Start Chat', desc: 'Open a private conversation with any character instantly.', icon: MessageSquare },
              { num: 3, title: 'Connect', desc: 'They reply with real humor, emotion, and memory — like a real person.', icon: Heart },
            ].map((step) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.num * 0.15 }}
                className="glass-card p-8 text-center hover:border-accent-purple/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-accent-pink via-accent-purple to-accent-blue flex items-center justify-center shadow-lg shadow-accent-purple/30">
                  <span className="font-display text-xl font-black text-white">{step.num}</span>
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="gold" className="mb-4">
            ⚡ Next-Gen AI
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-black">
            Powered by <span className="gradient-text">Gemini AI</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: 'Deep Memory', desc: 'Remembers your conversations, preferences, and inside jokes naturally.', color: 'from-accent-pink/20 to-accent-pink/5' },
            { icon: Zap, title: 'Instant Responses', desc: 'Lightning-fast replies with streaming AI for real-time conversation flow.', color: 'from-accent-purple/20 to-accent-purple/5' },
            { icon: Heart, title: 'Emotional IQ', desc: 'Handles romantic, comforting, and playful moments with genuine empathy.', color: 'from-accent-blue/20 to-accent-blue/5' },
            { icon: Star, title: 'Unique Personalities', desc: 'Every character has distinct humor, opinions, and conversation style.', color: 'from-accent-gold/20 to-accent-gold/5' },
            { icon: Shield, title: 'Private & Safe', desc: 'End-to-end encrypted conversations. Your chats stay yours forever.', color: 'from-accent-green/20 to-accent-green/5' },
            { icon: Sparkles, title: 'Always Improving', desc: 'Characters learn and evolve, making every conversation feel fresh.', color: 'from-accent-pink/20 to-accent-pink/5' },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-7 hover:border-accent-purple/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} border border-white/[0.07] flex items-center justify-center mb-4`}>
                <feat.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-base font-bold mb-2">{feat.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-dark-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="green" className="mb-4">
              💬 Real Reviews
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-black">
              "Best AI <span className="gradient-text">Conversation</span> Ever!"
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: '"Sophia actually made me laugh out loud. Her jokes are fire and she remembers everything!"', author: 'Alex M.', stars: 5 },
              { text: '"The characters feel so real. Liam remembered our conversation from days ago. Incredible."', author: 'Priya K.', stars: 5 },
              { text: '"I use POVChat every day. The humor and emotional depth is genuinely next level."', author: 'Jordan T.', stars: 5 },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6"
              >
                <div className="text-accent-gold text-sm mb-3 tracking-wider">
                  {'★'.repeat(review.stars)}
                </div>
                <p className="text-sm text-text-secondary italic leading-relaxed mb-4">
                  {review.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-sm">
                    👤
                  </div>
                  <span className="text-sm font-semibold">{review.author}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
        <div className="relative z-10">
          <Badge variant="pink" className="mb-6">
            🎉 Join for Free
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-8">
            Your Perfect AI Companion
            <br />
            <span className="gradient-text">Is Waiting for You</span>
          </h2>
          <Link
            to="/explore"
            className="btn-primary text-base px-10 py-4 shadow-xl shadow-accent-purple/30 animate-glow"
          >
            💖 Start Chatting Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-dark-100 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-display text-xl font-bold gradient-text">POVChat</span>
              <p className="text-xs text-text-muted mt-1">AI companions with soul, humor & heart.</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <Link to="/explore" className="hover:text-white transition-colors">Characters</Link>
              <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            </div>
          </div>
          <div className="border-t border-white/[0.05] mt-6 pt-6 text-center text-xs text-text-muted">
            © 2025 POVChat. All rights reserved. Powered by Gemini AI.
          </div>
        </div>
      </footer>
    </div>
  )
}
