import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  // Don't show the navbar on the landing page — it has its own clean hero layout
  if (location.pathname === '/') return null

  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-800'
    }`

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div
        onClick={() => navigate('/')}
        className="font-extrabold text-gray-900 cursor-pointer flex items-center gap-2"
      >
        <span className="text-cyan-500">◈</span> ChangeScope
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/search')} className={linkClass('/search')}>
          New Investigation
        </button>
        <button onClick={() => navigate('/history')} className={linkClass('/history')}>
          History
        </button>
        <button onClick={() => navigate('/settings')} className={linkClass('/settings')}>
          Architecture
        </button>
      </div>
    </nav>
  )
}
