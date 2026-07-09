import { useSelector } from 'react-redux'
import { FiMenu, FiUser, FiBell } from 'react-icons/fi'

function Navbar({ setSidebarOpen }) {
  const { user } = useSelector(state => state.auth)

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
      <div className="px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-50 lg:hidden"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
            Financial Dashboard
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
            <FiBell className="w-5 h-5" />
          </button>
          {user && (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-secondary font-bold text-base shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar