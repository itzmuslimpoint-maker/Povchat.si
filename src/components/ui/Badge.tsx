interface BadgeProps {
  children: React.ReactNode
  variant?: 'purple' | 'pink' | 'blue' | 'gold' | 'green'
  className?: string
}

const variants = {
  purple: 'bg-accent-purple/10 border-accent-purple/25 text-accent-purple',
  pink: 'bg-accent-pink/10 border-accent-pink/25 text-accent-pink',
  blue: 'bg-accent-blue/10 border-accent-blue/25 text-accent-blue',
  gold: 'bg-accent-gold/10 border-accent-gold/25 text-accent-gold',
  green: 'bg-accent-green/10 border-accent-green/25 text-accent-green',
}

export default function Badge({ children, variant = 'purple', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
        border tracking-wide uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
