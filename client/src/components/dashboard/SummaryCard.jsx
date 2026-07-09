function SummaryCard({ label, value, icon: Icon, tone = 'slate' }) {
  const tones = {
    slate: 'border-slate-100 bg-white text-slate-900 shadow-premium',
    green: 'border-emerald-100 bg-emerald-50/50 text-emerald-900 shadow-premium',
    red: 'border-rose-100 bg-rose-50/50 text-rose-900 shadow-premium',
    blue: 'border-sky-100 bg-sky-50/50 text-sky-900 shadow-premium'
  }

  const iconColors = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-100 text-emerald-600',
    red: 'bg-rose-100 text-rose-600',
    blue: 'bg-sky-100 text-sky-600'
  }

  return (
    <div className={`rounded-2xl border p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${tones[tone]}`}>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{label}</p>
        <p className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800">{value}</p>
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${iconColors[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  )
}

export default SummaryCard
