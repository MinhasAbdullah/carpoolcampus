import { useEffect, useState } from 'react'
import { Phone, Plus, ShieldAlert } from 'lucide-react'
import { usersApi, apiErrorMessage } from '../lib/api.js'
import { EmptyState, ErrorState, LoadingState } from '../components/common/AsyncState.jsx'

export default function EmergencyContact() {
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const load = async () => { setLoading(true); try { const { data } = await usersApi.emergencyContacts(); setContacts(Array.isArray(data) ? data : data?.results || []) } catch (err) { setError(apiErrorMessage(err, 'Could not load emergency contacts.')) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  const submit = async (e) => { e.preventDefault(); setSaving(true); setError(''); try { const { data } = await usersApi.createEmergencyContact(form); setContacts((prev) => [...prev, data]); setForm({ name: '', phone: '' }) } catch (err) { setError(apiErrorMessage(err, 'Could not add contact.')) } finally { setSaving(false) } }
  if (loading) return <LoadingState label="Loading emergency contacts…" />
  return <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><div className="rounded-xl bg-rose-50 p-2 text-rose-500"><ShieldAlert size={18} /></div><div><h3 className="text-sm font-semibold text-slate-800">Add trusted contact</h3><p className="text-xs text-slate-400">Keep a trusted person available for your ride safety.</p></div></div>{error && <div className="mt-4"><ErrorState message={error} /></div>}<label className="mt-5 block text-xs font-semibold text-slate-500">Name</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400" /><label className="mt-4 block text-xs font-semibold text-slate-500">Phone</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400" /><button disabled={saving} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-semibold text-white"><Plus size={14} />{saving ? 'Adding…' : 'Add contact'}</button></form><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-sm font-semibold text-slate-800">Saved contacts</h3><div className="mt-4 space-y-3">{contacts.length === 0 ? <EmptyState title="No emergency contacts" description="Add a trusted person using the form." /> : contacts.map((contact) => <div key={contact.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div><p className="text-sm font-semibold text-slate-700">{contact.name}</p><p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400"><Phone size={11} />{contact.phone}</p></div><span className="text-[10px] font-semibold text-slate-300">#{contact.id}</span></div>)}</div></section></div>
}
