import { AlertCircle, Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Loading…' }) {
  return <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-slate-400"><Loader2 size={18} className="animate-spin" />{label}</div>
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700">
      <div className="flex items-start gap-2"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span>{message}</span></div>
      {onRetry && <button onClick={onRetry} className="mt-3 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">Try again</button>}
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">{description}</p>}
      {action}
    </div>
  )
}
