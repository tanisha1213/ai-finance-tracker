import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import { FiLayout, FiDollarSign, FiPieChart, FiTrendingUp, FiLayers, FiUser, FiLogOut, FiX } from 'react-icons/fi'

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FiLayout },
    { label: 'Transactions', path: '/transactions', icon: FiDollarSign },
    { label: 'Budget', path: '/budget', icon: FiPieChart },
    { label: 'Insights', path: '/insights', icon: FiTrendingUp },
    { label: 'Reports', path: '/reports', icon: FiLayers },
    { label: 'Profile', path: '/profile', icon: FiUser }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
    setIsOpen(false)
    navigate('/login')
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white flex flex-col transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-dark flex justify-between items-center bg-slate-900/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary text-white text-base">₹</span>
            FinTrack
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">AI Personal Finance</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-lg text-gray-400 hover:text-white lg:hidden hover:bg-slate-dark"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 bg-primary overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                  : 'text-gray-400 hover:text-white hover:bg-slate-dark'
              }`}
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-dark bg-slate-900/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200 font-semibold text-sm"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar