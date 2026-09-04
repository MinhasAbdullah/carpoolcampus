import { Car, ChevronRight, LogOut, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Avatar from '../ui/Avatar.jsx'
import { navigationForRole } from '../../data/navigation.js'
import { useAuth } from '../../context/AuthContext.jsx'

function initials(value = '') {
  return value.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'CC'
}

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, signOut } = useAuth()
  const items = navigationForRole(user?.role)

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-3 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15"><Car size={18} /></span>
            <div><p className="text-sm font-bold leading-tight">CarpoolCampus</p><p className="text-[10px] leading-tight text-violet-100">Share rides. Build community.</p></div>
          </div>
          <button className="ml-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden" onClick={onClose}><X size={18} /></button>
        </div>

        <nav className="mt-5 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.path} to={item.path} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-violet-50 text-violet-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                {({ isActive }) => <><Icon size={17} strokeWidth={isActive ? 2.3 : 2} />{item.label}</>}
              </NavLink>
            )
          })}
          <button onClick={signOut} className="mt-3 flex w-full items-center gap-3 border-t border-slate-100 px-3 pt-4 text-sm font-medium text-slate-500 hover:text-slate-700"><LogOut size={17} />Logout</button>
        </nav>

        <div className="flex items-center gap-3 border-t border-slate-100 px-4 py-4">
          <Avatar initials={initials(user?.username)} size="md" />
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{user?.username || 'Account'}</p><p className="text-xs capitalize text-slate-400">{user?.role || 'member'}</p></div>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
      </aside>
    </>
  )
}
