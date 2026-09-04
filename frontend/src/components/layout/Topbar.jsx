import { Bell, ChevronDown, Menu, MessageCircle } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'
import { currentUser } from '../../data/mockData.js'

export default function Topbar({ title, subtitle, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{title}</h1>
          {subtitle && <p className="truncate text-sm text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
            3
          </span>
        </button>
        <button
          className="relative hidden rounded-full p-2 text-slate-500 hover:bg-slate-100 sm:inline-flex"
          aria-label="Messages"
        >
          <MessageCircle size={19} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-semibold text-white">
            2
          </span>
        </button>
        <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-slate-100">
          <Avatar initials={currentUser.initials} size="sm" />
          <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  )
}
