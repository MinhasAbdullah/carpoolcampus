import { Star } from 'lucide-react'

export default function StarRating({ value = 0, onChange, size = 18, showValue = false, reviews, disabled = false }) {
  const interactive = typeof onChange === 'function' && !disabled
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((score) => (
        <button key={score} type="button" disabled={!interactive} onClick={() => interactive && onChange(score)} aria-label={`${score} star${score > 1 ? 's' : ''}`} className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}>
          <Star size={size} className={score <= Math.round(Number(value || 0)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
        </button>
      ))}
      {showValue && <span className="ml-1 text-sm font-medium text-slate-700">{Number(value || 0).toFixed(1)}</span>}
      {reviews != null && <span className="text-xs text-slate-400">({reviews})</span>}
    </span>
  )
}
