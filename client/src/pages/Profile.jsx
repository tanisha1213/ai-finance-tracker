import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileThunk } from '../redux/slices/authSlice'
import { changePassword, getAccountStats } from '../services/authService'
import { formatCurrency } from '../utils/format'
import { FiUser, FiKey, FiCheck, FiPieChart } from 'react-icons/fi'

function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [stats, setStats] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) setProfile({ name: user.name, email: user.email })
    getAccountStats().then((response) => setStats(response.data.data))
  }, [user])

  const saveProfile = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    try {
      await dispatch(updateProfileThunk(profile)).unwrap()
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err || 'Unable to update profile.')
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    try {
      await changePassword(passwords)
      setPasswords({ currentPassword: '', newPassword: '' })
      setMessage('Password changed successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to change password.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Account Settings</h2>
        <p className="text-slate-400 text-sm mt-0.5">Manage user credentials and view system activity logs.</p>
      </div>

      {message && <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium lg:col-span-2 space-y-8">
          {/* User Profile Form */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <FiUser className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-slate-800 text-base">User Profile</h3>
            </div>
            <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-secondary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-secondary"
                  required
                />
              </div>
              <button className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 font-bold text-white text-sm hover:bg-slate-800 transition-colors sm:w-fit mt-2">
                <FiCheck className="w-4 h-4" />
                Save Profile
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <FiKey className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-slate-800 text-base">Security</h3>
            </div>
            <form onSubmit={savePassword} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-secondary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                <input
                  type="password"
                  minLength="6"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-secondary"
                  required
                />
              </div>
              <button className="flex items-center justify-center gap-1.5 rounded-xl bg-secondary px-4 py-2.5 font-bold text-white text-sm hover:bg-indigo-700 transition-colors sm:w-fit mt-2 shadow-md shadow-secondary/15">
                <FiKey className="w-4 h-4" />
                Change Password
              </button>
            </form>
          </div>
        </section>

        {/* Account statistics */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium h-fit space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FiPieChart className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-slate-800 text-lg">Account Stats</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-xl border border-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Actions Logged</span>
              <span className="text-xl font-extrabold text-slate-800">{stats?.transactionCount || 0}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Income Total</span>
              <span className="text-xl font-extrabold text-emerald-600">{formatCurrency(stats?.totalIncome)}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Expense Total</span>
              <span className="text-xl font-extrabold text-rose-600">{formatCurrency(stats?.totalExpense)}</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Savings Accumulation</span>
              <span className="text-xl font-extrabold text-indigo-600">{formatCurrency(stats?.savings)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile