import { Car, ChevronRight, LogOut, X } from 'lucide-react'
import Avatar from '../ui/Avatar.jsx'
import { navSections } from '../../data/navigation.js'
import { currentUser } from '../../data/mockData.js'

export default function Sidebar({ activePage, onNavigate, mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 px-3 py-3 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <Car size={18} />
            </span>
            <div>
              <p className="text-sm font-bold leading-tight">CarpoolCampus</p>
              <p className="text-[11px] leading-tight text-violet-100">
                Share rides. Save money. Build community.
              </p>
            </div>
          </div>
          <button
            className="ml-2 rounded-md p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-4 overflow-y-auto px-3 pb-4">
          {navSections.map((section, idx) => (
            <div
              key={idx}
              className={idx > 0 ? 'space-y-1 border-t border-slate-100 pt-3' : 'space-y-1'}
            >
              {section.items.map((item) => {
                const Icon = item.icon
                const active = activePage === item.page
                return (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} strokeWidth={active ? 2.25 : 2} />
                      {item.label}
                    </span>
                    {item.badge ? (
                      <span className="rounded-full bg-violet-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          ))}

          <div className="space-y-1 border-t border-slate-100 pt-3">
            <button
              onClick={() => onNavigate('logout')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </nav>

        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-3 border-t border-slate-100 px-4 py-4 text-left hover:bg-slate-50"
        >
          <Avatar initials={currentUser.initials} size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.role}</p>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      </aside>
    </>
  )
}
