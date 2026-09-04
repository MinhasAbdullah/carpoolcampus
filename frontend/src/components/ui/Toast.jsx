import { CheckCircle2 } from 'lucide-react'

export default function Toast({ message }) {
  if (!message) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
        <CheckCircle2 size={16} className="text-emerald-400" />
        {message}
      </div>
    </div>
  )
}
