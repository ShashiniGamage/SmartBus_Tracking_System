/*import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Bus, ChevronDown } from 'lucide-react'

const navLinks = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/live',     label: 'Live Routes' },
  { to: '/services', label: 'Services' },
  { to: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const { user, logout }        = useAuth()
  const location                = useLocation()
  const navigate                = useNavigate()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropOpen, setDrop]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLogout = () => { logout(); setDrop(false); navigate('/') }

  const dashLink = user?.role === 'admin'  ? '/admin'
                 : user?.role === 'driver' ? '/driver'
                 : '/passenger'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-sm'
    }`}>
      {/* Top red bar }
      <div className="bg-primary text-white text-xs py-1.5 text-center font-body hidden md:block">
        🚌 Smart Bus Transit — Connecting Sri Lanka, One Route at a Time
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo }
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center
                            group-hover:bg-primary-dark transition-colors duration-200 shadow-md">
              <Bus size={22} className="text-white"/>
            </div>
            <div className="leading-tight">
              <span className="block font-display font-bold text-navy text-base">Smart Bus</span>
              <span className="block font-body text-primary text-[10px] font-semibold tracking-widest uppercase">Transit</span>
            </div>
          </Link>

          {/* Desktop nav links }
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-200
                  ${location.pathname === l.to
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-navy hover:text-primary hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth }
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDrop(d => !d)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10
                             text-primary font-semibold text-sm hover:bg-primary/20 transition-colors">
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span>{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${dropOpen ? 'rotate-180' : ''}`}/>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <Link to={dashLink} onClick={() => setDrop(false)}
                      className="block px-4 py-2.5 text-sm text-navy hover:bg-primary/5 hover:text-primary font-medium">
                      📊 Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100"/>
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"    className="btn-outline text-sm py-2 px-5">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button }
          <button onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-lg text-navy hover:bg-gray-100 transition-colors">
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu }
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl font-body font-medium text-sm transition-all
                  ${location.pathname === l.to ? 'bg-primary text-white' : 'text-navy hover:bg-gray-50'}`}>
                {l.label}
              </Link>
            ))}
            <hr className="border-gray-100 my-2"/>
            {user ? (
              <>
                <Link to={dashLink} onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-navy hover:bg-gray-50">
                  📊 Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
                  🚪 Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login"    onClick={() => setOpen(false)} className="flex-1 btn-outline text-sm text-center py-2.5">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 btn-primary text-sm text-center py-2.5">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}*/


import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Bus, ChevronDown } from 'lucide-react'

const navLinks = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/live',     label: 'Live Routes' },
  { to: '/services', label: 'Services' },
  { to: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const { user, logout }        = useAuth()
  const location                = useLocation()
  const navigate                = useNavigate()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropOpen, setDrop]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLogout = () => { logout(); setDrop(false); navigate('/') }

  const dashLink = user?.role === 'admin'  ? '/admin'
                 : user?.role === 'driver' ? '/driver'
                 : '/passenger'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      scrolled
        ? 'bg-white/98 backdrop-blur-xl shadow-xl shadow-primary/10 border-b border-red-100'
        : 'bg-white/95 backdrop-blur-md shadow-sm'
    }`}>

      {/* Top bar */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark text-white text-xs py-1.5 text-center font-body hidden md:block tracking-wide">
        🚌 Smart Bus Transit — Real-Time Bus Tracking Across Sri Lanka
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl
                              flex items-center justify-center shadow-lg shadow-primary/40
                              group-hover:shadow-primary/60 transition-all duration-300
                              group-hover:scale-105">
                <Bus size={21} className="text-white"/>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"/>
            </div>
            <div className="leading-tight">
              <span className="block font-display font-extrabold text-navy text-[15px] tracking-tight">Smart Bus</span>
              <span className="block font-body text-primary text-[9px] font-bold tracking-[0.2em] uppercase">Transit</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(l => {
              const active = location.pathname === l.to
              return (
                <Link key={l.to} to={l.to}
                  className={`relative px-4 py-2 rounded-lg font-body font-medium text-sm transition-all duration-200
                    ${active
                      ? 'text-primary font-semibold'
                      : 'text-gray-600 hover:text-primary hover:bg-red-50'}`}>
                  {l.label}
                  {active && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full"/>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDrop(d => !d)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                             bg-gradient-to-r from-red-50 to-red-100
                             border border-red-200 hover:border-primary/50
                             text-primary font-semibold text-sm transition-all duration-200">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary-dark rounded-full
                                  flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span>{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}/>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl shadow-primary/20
                                  border border-red-100 py-2 z-50 animate-slide-up">
                    <div className="px-4 py-2 border-b border-red-50 mb-1">
                      <p className="font-display font-bold text-navy text-xs">{user.name}</p>
                      <p className="font-body text-gray-400 text-[10px] capitalize">{user.role}</p>
                    </div>
                    <Link to={dashLink} onClick={() => setDrop(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-navy hover:bg-red-50 hover:text-primary font-medium transition-colors">
                      📊 Dashboard
                    </Link>
                    <hr className="my-1 border-red-50"/>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"
                  className="px-5 py-2 font-display font-semibold text-sm text-primary
                             border-2 border-primary/30 rounded-xl hover:border-primary
                             hover:bg-red-50 transition-all duration-200">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Register Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-xl text-navy hover:bg-red-50 hover:text-primary transition-colors">
            {open ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-red-100 shadow-2xl shadow-primary/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body font-medium text-sm transition-all
                  ${location.pathname === l.to
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/30'
                    : 'text-navy hover:bg-red-50 hover:text-primary'}`}>
                {l.label}
              </Link>
            ))}
            <hr className="border-red-100 my-2"/>
            {user ? (
              <>
                <Link to={dashLink} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-navy hover:bg-red-50">
                  📊 Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50">
                  🚪 Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login"    onClick={() => setOpen(false)} className="flex-1 btn-outline text-sm text-center py-2.5">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 btn-primary text-sm text-center py-2.5">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}