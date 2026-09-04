import { useState } from 'react'
import { Bell, Menu, Radio } from 'lucide-react'
import useNotifications from '../../hooks/useNotifications.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { isAuthenticated } = useAuth()
  const { items, unreadCount, connected, markRead, markAllRead } = useNotifications(isAuthenticated)
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={onMenuClick}><Menu size={20} /></button>
        <div className="min-w-0"><h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{title}</h1>{subtitle && <p className="truncate text-sm text-slate-400">{subtitle}</p>}</div>
      </div>

      <div className="relative">
        <button onClick={() => setOpen((value) => !value)} className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
          <Bell size={19} />
          {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white">{Math.min(unreadCount, 99)}</span>}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div><p className="text-sm font-semibold text-slate-800">Notifications</p><p className="flex items-center gap-1 text-[10px] text-slate-400"><Radio size={10} className={connected ? 'text-emerald-500' : 'text-slate-300'} />{connected ? 'Live updates active' : 'Live updates unavailable'}</p></div>
              {unreadCount > 0 && <button onClick={markAllRead} className="text-xs font-semibold text-violet-600">Mark all read</button>}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? <p className="p-6 text-center text-xs text-slate-400">No notifications yet.</p> : items.slice(0, 12).map((item) => (
                <button key={item.id} onClick={() => !item.is_read && markRead(item.id)} className={`block w-full border-b border-slate-50 px-4 py-3 text-left hover:bg-slate-50 ${item.is_read ? '' : 'bg-violet-50/40'}`}>
                  <div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-slate-700">{item.title}</p>{!item.is_read && <span className="mt-1 h-2 w-2 rounded-full bg-violet-500" />}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.message}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
