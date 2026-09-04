import { useState } from 'react'
import { CheckCircle2, Phone, Shield, User } from 'lucide-react'
import Toggle from '../components/ui/Toggle.jsx'
import { defaultEmergencyContacts } from '../data/mockData.js'

export default function EmergencyContact({ notify }) {
  const [primary, setPrimary] = useState(defaultEmergencyContacts.primary)
  const [shareLiveStatus, setShareLiveStatus] = useState(defaultEmergencyContacts.shareLiveStatus)
  const [secondary, setSecondary] = useState(defaultEmergencyContacts.secondary)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!primary.name.trim()) nextErrors.primaryName = 'Add a name'
    if (!primary.phone.trim()) nextErrors.primaryPhone = 'Add a phone number'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false)
      return
    }
    setSaved(true)
    notify?.('Emergency contacts saved.')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Emergency Contact</h3>
            <p className="text-xs text-slate-400">Add a contact to share your trip status.</p>
          </div>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            <Shield size={20} />
          </span>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Primary Contact</p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="p-name">
                Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  id="p-name"
                  value={primary.name}
                  onChange={(e) => {
                    setPrimary({ ...primary, name: e.target.value })
                    setSaved(false)
                  }}
                  placeholder="e.g. Mother"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                    errors.primaryName ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.primaryName && <p className="mt-1 text-xs text-rose-500">{errors.primaryName}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="p-phone">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  id="p-phone"
                  value={primary.phone}
                  onChange={(e) => {
                    setPrimary({ ...primary, phone: e.target.value })
                    setSaved(false)
                  }}
                  placeholder="+92 300 1234567"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 ${
                    errors.primaryPhone ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
              </div>
              {errors.primaryPhone && <p className="mt-1 text-xs text-rose-500">{errors.primaryPhone}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-sm text-slate-600">Share live status with this contact</span>
          <Toggle
            checked={shareLiveStatus}
            onChange={(v) => {
              setShareLiveStatus(v)
              setSaved(false)
            }}
            label="Share live status with this contact"
          />
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Secondary Contact (Optional)
          </p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="s-name">
                Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  id="s-name"
                  value={secondary.name}
                  onChange={(e) => {
                    setSecondary({ ...secondary, name: e.target.value })
                    setSaved(false)
                  }}
                  placeholder="e.g. Father"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500" htmlFor="s-phone">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  id="s-phone"
                  value={secondary.phone}
                  onChange={(e) => {
                    setSecondary({ ...secondary, phone: e.target.value })
                    setSaved(false)
                  }}
                  placeholder="+92 301 7654321"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
        >
          Save Contacts
        </button>

        {saved && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-600">
            <CheckCircle2 size={15} /> Contacts saved
          </p>
        )}
      </form>
    </div>
  )
}
