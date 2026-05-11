import { motion } from 'framer-motion'

export function CardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="h-52 bg-dark-300/50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark-300/50 rounded-full w-2/3" />
        <div className="h-3 bg-dark-300/50 rounded-full w-full" />
        <div className="h-3 bg-dark-300/50 rounded-full w-4/5" />
        <div className="flex gap-2 mt-3">
          <div className="h-6 w-16 bg-dark-300/50 rounded-full" />
          <div className="h-6 w-16 bg-dark-300/50 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`flex gap-3 ${i % 2 === 0 ? 'justify-end' : ''}`}
        >
          {i % 2 !== 0 && (
            <div className="w-8 h-8 rounded-full bg-dark-300/50 animate-pulse flex-shrink-0" />
          )}
          <div
            className={`rounded-2xl animate-pulse ${
              i % 2 === 0 ? 'bg-accent-purple/10' : 'bg-dark-300/50'
            }`}
            style={{
              width: `${40 + Math.random() * 30}%`,
              height: '48px',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="flex gap-6 items-start">
        <div className="w-32 h-32 rounded-2xl bg-dark-300/50" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-dark-300/50 rounded-full w-1/3" />
          <div className="h-4 bg-dark-300/50 rounded-full w-1/2" />
          <div className="h-4 bg-dark-300/50 rounded-full w-2/3" />
        </div>
      </div>
    </div>
  )
}
