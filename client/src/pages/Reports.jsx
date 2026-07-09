import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { downloadMonthlyReport, getMonthlyReport } from '../services/reportService'
import { formatCurrency, formatDate } from '../utils/format'
import { FiDownload, FiCalendar } from 'react-icons/fi'

function Reports() {
  const now = new Date()
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = useMemo(() => period, [period])

  useEffect(() => {
    setLoading(true)
    getMonthlyReport(params)
      .then((response) => setReport(response.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load report'))
      .finally(() => setLoading(false))
  }, [params])

  const exportPdf = async () => {
    const response = await downloadMonthlyReport(params)
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `finance-report-${period.year}-${String(period.month).padStart(2, '0')}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Statements & Reports</h2>
          <p className="text-slate-400 text-sm mt-0.5">Filter monthly statements and download PDF reports.</p>
        </div>
        <button
          onClick={exportPdf}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-white text-sm hover:bg-slate-800 transition-colors shadow-md"
        >
          <FiDownload className="w-4 h-4" />
          Export PDF Statement
        </button>
      </div>

      {/* Period Filter Card */}
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium">
        <div className="flex items-center gap-3">
          <FiCalendar className="text-secondary w-5 h-5 flex-shrink-0" />
          <div className="grid gap-3 sm:grid-cols-2 flex-1">
            <select
              value={period.month}
              onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-secondary"
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {new Date(2024, index, 1).toLocaleString('en-IN', { month: 'long' })}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={period.year}
              onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary"
              placeholder="Year"
            />
          </div>
        </div>
      </section>

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
          Generating statement report...
        </div>
      )}
      {error && <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-rose-700">{error}</div>}

      {report && !loading && (
        <>
          {/* Summary Metric Counters */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statement Income</span>
              <span className="text-2xl font-extrabold text-emerald-600 mt-2">{formatCurrency(report.totalIncome)}</span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statement Expenses</span>
              <span className="text-2xl font-extrabold text-rose-600 mt-2">{formatCurrency(report.totalExpense)}</span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Period Savings</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-2">{formatCurrency(report.savings)}</span>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-premium flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remaining Budget Balance</span>
              <span className="text-2xl font-extrabold text-indigo-600 mt-2">{formatCurrency(report.budgetRemaining)}</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Category Spend Chart */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium lg:col-span-2">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Category Analysis</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.categoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" tickLine={false} stroke="#94a3b8" fontSize={11} />
                    <YAxis tickLine={false} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* List of Statement Transactions */}
            <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-4">Period Logs</h3>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {report.transactions.length ? report.transactions.map((item) => (
                    <div key={item._id} className="flex justify-between items-center p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{item.title}</p>
                        <p className="text-xs text-slate-400 font-medium">{item.category} • {formatDate(item.transactionDate)}</p>
                      </div>
                      <p className={`font-bold text-sm ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                      </p>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 py-12 text-center">
                      No records exist for this period.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

export default Reports