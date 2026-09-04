import { Star } from 'lucide-react'

export default function StarRating({ value, size = 14, showValue = true, reviews }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      {showValue && <span className="text-sm font-medium text-slate-700">{value}</span>}
      {reviews != null && <span className="text-xs text-slate-400">({reviews})</span>}
    </span>
  )
}
