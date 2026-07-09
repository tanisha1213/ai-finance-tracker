import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts'
import SummaryCard from '../components/dashboard/SummaryCard'
import { getDashboardSummary } from '../services/dashboardService'
import { formatCurrency, formatDate } from '../utils/format'
import { FiArrowUpRight, FiArrowDownRight, FiDollarSign, FiActivity, FiTrendingUp } from 'react-icons/fi'

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardSummary()
      .then((response) => setSummary(response.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-6 text-rose-700 shadow-premium">
        <p className="font-semibold text-lg">Error Loading Dashboard</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  const trend = summary.monthlyTrend || []
  const categories = summary.categoryBreakdown || []
  const incomeExpense = trend.map((item) => ({
    month: item.month,
    Income: item.income,
    Expense: item.expense
  }))

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-indigo-950 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-xl space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Welcome Back to FinTrack</h2>
          <p className="text-slate-300 text-sm md:text-base font-normal">
            Analyze spending patterns, manage active budgets, and discover smart financial recommendations.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none transform skew-x-12 hidden md:block" />
      </div>

      {/* Summary Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={FiArrowUpRight}
          tone="green"
        />
        <SummaryCard
          label="Total Expense"
          value={formatCurrency(summary.totalExpense)}
          icon={FiArrowDownRight}
          tone="red"
        />
        <SummaryCard
          label="Remaining Budget"
          value={formatCurrency(summary.budgetRemaining)}
          icon={FiActivity}
          tone="blue"
        />
        <SummaryCard
          label="Net Savings"
          value={formatCurrency(summary.savings)}
          icon={FiDollarSign}
          tone="slate"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Trend Chart */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-slate-800 text-lg">Monthly Spending Trend</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" fontSize={12} />
                <YAxis tickLine={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                  formatter={(value) => [formatCurrency(value), 'Spent']}
                />
                <Line type="monotone" dataKey="expense" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Category Share Donut Chart */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Category Distribution</h3>
          <div className="h-72 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="amount" nameKey="category" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {categories.map((entry, index) => (
                    <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            {categories.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Comparisons & Recent Listings Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Income vs Expenses Bar Chart */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium lg:col-span-2">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Income vs Expense Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeExpense} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" fontSize={12} />
                <YAxis tickLine={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Transactions List */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {summary.recentTransactions?.length ? (
                summary.recentTransactions.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl text-xs font-semibold ${
                        item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {item.type === 'income' ? 'IN' : 'EX'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                        <p className="text-xs text-slate-400 font-medium">
                          {item.category} • {formatDate(item.transactionDate)}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold text-sm ${
                      item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No transactions recorded yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard