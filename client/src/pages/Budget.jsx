import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudget, saveBudget } from '../redux/slices/budgetSlice'
import { getDashboardSummary } from '../services/dashboardService'
import { categories, formatCurrency } from '../utils/format'
import { FiPlus, FiTrash2, FiActivity, FiCheck, FiInbox } from 'react-icons/fi'

function Budget() {
  const dispatch = useDispatch()
  const budget = useSelector(state => state.budget)
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [categoryBudgets, setCategoryBudgets] = useState([])
  const [summary, setSummary] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(fetchBudget())
    getDashboardSummary().then((response) => setSummary(response.data.data))
  }, [dispatch])

  useEffect(() => {
    setMonthlyBudget(budget.monthlyBudget)
    setCategoryBudgets(budget.categories)
  }, [budget.monthlyBudget, budget.categories])

  const addCategory = () => {
    setCategoryBudgets([...categoryBudgets, { category: 'Food', limit: 0 }])
  }

  const updateCategory = (index, field, value) => {
    setCategoryBudgets(categoryBudgets.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: field === 'limit' ? Number(value) : value } : item
    )))
  }

  const removeCategory = (index) => {
    setCategoryBudgets(categoryBudgets.filter((_, itemIndex) => itemIndex !== index))
  }

  const save = async (event) => {
    event.preventDefault()
    setMessage('')
    await dispatch(saveBudget({ monthlyBudget: Number(monthlyBudget), categoryBudgets })).unwrap()
    const response = await getDashboardSummary()
    setSummary(response.data.data)
    setMessage('Budget settings saved successfully.')
  }

  const totalExpense = summary?.totalExpense || 0
  const remaining = Number(monthlyBudget || 0) - totalExpense
  const usedPercent = monthlyBudget > 0 ? Math.min(100, Math.round((totalExpense / monthlyBudget) * 100)) : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Budget Planner</h2>
        <p className="text-slate-400 text-sm mt-0.5">Control your monthly outflows and restrict category levels.</p>
      </div>

      {message && <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-700">{message}</div>}
      {budget.error && <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-rose-700">{budget.error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Budget Editor Panel */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium lg:col-span-2">
          <form onSubmit={save} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Global Monthly Limit</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-8 pr-4 py-3 text-sm font-semibold focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <h3 className="font-bold text-slate-800 text-base">Category Budgets</h3>
              <button
                type="button"
                onClick={addCategory}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <FiPlus className="w-3.5 h-3.5" />
                Add Category Limit
              </button>
            </div>

            <div className="space-y-4">
              {categoryBudgets.map((item, index) => {
                const spent = summary?.categoryBreakdown?.find((entry) => entry.category === item.category)?.amount || 0
                const percent = item.limit ? Math.min(100, Math.round((spent / item.limit) * 100)) : 0
                return (
                  <div key={`${item.category}-${index}`} className="rounded-xl border border-slate-100 p-4 bg-slate-50/50">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <select
                        value={item.category}
                        onChange={(e) => updateCategory(index, 'category', e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-secondary"
                      >
                        {categories.map((category) => <option key={category}>{category}</option>)}
                      </select>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                        <input
                          type="number"
                          min="0"
                          value={item.limit}
                          onChange={(e) => updateCategory(index, 'limit', e.target.value)}
                          className="w-full rounded-xl border border-slate-200 pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-secondary"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCategory(index)}
                        className="flex items-center justify-center gap-1 p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors"
                        title="Remove Category"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
                        <span>{formatCurrency(spent)} spent</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200/50">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            percent >= 100 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              {categoryBudgets.length === 0 && (
                <div className="py-6 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                  <FiInbox className="w-6 h-6 text-slate-300" />
                  No category limits configured.
                </div>
              )}
            </div>

            <button
              disabled={budget.loading}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-3 font-bold text-white text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <FiCheck className="w-4 h-4" />
              {budget.loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </section>

        {/* Budget Status Sidebar Info */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium h-fit space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FiActivity className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-slate-800 text-lg">Overall Progress</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Month Spending</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">{formatCurrency(totalExpense)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Budget Balance</p>
              <p className={`text-3xl font-extrabold mt-1 ${remaining < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {formatCurrency(remaining)}
              </p>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                <span>Budget Utilized</span>
                <span>{usedPercent}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    usedPercent >= 100 ? 'bg-rose-500' : 'bg-secondary'
                  }`}
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
            </div>
            {remaining < 0 && (
              <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-xs font-medium text-rose-700 leading-relaxed">
                Budget overrun detected! You have exceeded your configured limit by {formatCurrency(Math.abs(remaining))}. Avoid discretionary outflows this period.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Budget