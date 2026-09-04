import { Car, Leaf, Users } from 'lucide-react'

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-violet-800 to-fuchsia-800 px-6 py-8 text-white sm:px-10">
      <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute right-16 bottom-0 h-24 w-24 rounded-full bg-white/5" />
      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold sm:text-2xl">Travel Together. Go Further.</h3>
          <p className="mt-1.5 max-w-md text-sm text-violet-100">
            Carpool and reduce travel cost, traffic and pollution.
          </p>
          <button className="mt-4 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50">
            Learn More
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-3 self-center opacity-90">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Car size={20} />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Users size={20} />
          </span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <Leaf size={20} />
          </span>
        </div>
      </div>
    </div>
  )
}
