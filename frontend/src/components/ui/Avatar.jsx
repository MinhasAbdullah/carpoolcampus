const PALETTE = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
]

function colorFor(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

const SIZES = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-lg',
}

export default function Avatar({ initials = '?', size = 'md', ring = false, className = '' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${colorFor(
        initials
      )} ${SIZES[size]} ${ring ? 'ring-2 ring-white' : ''} ${className}`}
    >
      {initials}
    </div>
  )
}
