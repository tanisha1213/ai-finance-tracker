import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactions,
  removeTransactionById,
  saveTransaction
} from '../redux/slices/transactionSlice'
import { categories, formatCurrency, formatDate, paymentMethods } from '../utils/format'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi'

const emptyForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'upi',
  description: '',
  transactionDate: new Date().toISOString().slice(0, 10)
}

function Transactions() {
  const dispatch = useDispatch()
  const { transactions, pagination, loading, error } = useSelector(state => state.transactions)

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    sort: 'latest',
    page: 1
  })

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  const query = useMemo(() => ({
    search: filters.search,
    type: filters.type,
    category: filters.category,
    sort: filters.sort,
    page: filters.page,
    limit: 10
  }), [filters])

  useEffect(() => {
    dispatch(fetchTransactions(query))
  }, [dispatch, query])

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1 // Reset page on filter update
    })
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      sort: 'latest',
      page: 1
    })
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
    setMessage('')
  }

  const openEdit = (item) => {
    setEditingId(item._id)
    setForm({
      type: item.type,
      title: item.title,
      amount: item.amount,
      category: item.category,
      paymentMethod: item.paymentMethod,
      description: item.description || '',
      transactionDate: new Date(item.transactionDate).toISOString().slice(0, 10)
    })
    setShowForm(true)
    setMessage('')
  }

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submitForm = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await dispatch(saveTransaction({ id: editingId, data: form })).unwrap()
      setShowForm(false)
      dispatch(fetchTransactions(query))
      setMessage(editingId ? 'Transaction updated successfully.' : 'Transaction created successfully.')
    } catch (err) {
      setMessage(err || 'Failed to save transaction')
    }
  }

  const deleteItem = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        await dispatch(removeTransactionById(item._id)).unwrap()
        dispatch(fetchTransactions(query))
        setMessage('Transaction deleted successfully.')
      } catch (err) {
        setMessage(err || 'Failed to delete transaction')
      }
    }
  }

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Transactions</h2>
          <p className="text-slate-400 text-sm mt-0.5">Manage and filter your cash flows, salaries, and expenses.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 font-semibold text-white text-sm hover:bg-indigo-700 shadow-md shadow-secondary/15 transition-all"
        >
          <FiPlus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Filters Form Block */}
      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-premium">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="search"
              placeholder="Search details..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
            />
          </div>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="amount_desc">Amount: High to Low</option>
            <option value="amount_asc">Amount: Low to High</option>
          </select>
          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <FiRefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </section>

      {/* Messages Banner */}
      {message && (
        <div className={`rounded-xl border p-4 text-sm ${
          message.includes('failed') || message.includes('Failed')
            ? 'border-rose-100 bg-rose-50/50 text-rose-700'
            : 'border-emerald-100 bg-emerald-50/50 text-emerald-700'
        }`}>
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Transactions Table Section */}
      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Title / Description</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-secondary"></div>
                      Loading entries...
                    </div>
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-slate-400 mt-0.5 max-w-[200px] truncate">{item.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        item.type === 'income'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{item.category}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(item.transactionDate)}</td>
                    <td className="px-6 py-4">
                      <span className="uppercase text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-extrabold ${
                      item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1 text-slate-400 hover:text-secondary rounded transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm bg-slate-50/50 text-slate-500">
          <p className="font-medium">
            Page {pagination.page} of {pagination.pages || 1} <span className="text-slate-400">({pagination.total} records)</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Creation/Editing Dialog Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? 'Edit Transaction' : 'New Transaction'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 hover:bg-slate-100 rounded-lg text-lg"
              >
                &times;
              </button>
            </header>

            <form onSubmit={submitForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    min="0.01"
                    step="any"
                    value={form.amount}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 capitalize"
                  >
                    {paymentMethods.map((p) => (
                      <option key={p} value={p}>{p.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Transaction Date</label>
                <input
                  type="date"
                  name="transactionDate"
                  value={form.transactionDate}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                />
              </div>

              <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 -mx-6 -mb-6 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 shadow-md shadow-secondary/15 disabled:opacity-50"
                >
                  <FiCheck className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Entry'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions