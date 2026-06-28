import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/api'
import { Bus, Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function Login() {
  const { saveUser }          = useAuth()
  const navigate              = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [show, setShow]       = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await login(form)
      saveUser(data)
      if      (data.role === 'admin')  navigate('/admin')
      else if (data.role === 'driver') navigate('/driver')
      else                             navigate('/passenger')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-[#2D1B4E] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Red header */}
          <div className="bg-primary px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Bus size={32} className="text-white"/>
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Welcome Back</h1>
            <p className="text-white/80 text-sm font-body mt-1">Smart Bus Transit</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-body px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                <span>⚠️</span>{error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-display font-semibold text-navy text-sm mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type="email" className="input-field pl-11" placeholder="your@email.com"
                    value={form.email} onChange={set('email')} required/>
                </div>
              </div>
              <div>
                <label className="block font-display font-semibold text-navy text-sm mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type={show ? 'text' : 'password'} className="input-field pl-11 pr-11"
                    placeholder="Enter password" value={form.password} onChange={set('password')} required/>
                  <button type="button" onClick={() => setShow(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                    {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-70">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Logging in...</>
                  : 'Login to Dashboard'}
              </button>
            </form>
            <p className="text-center font-body text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
            </p>
          </div>
        </div>
        <p className="text-center text-white/50 text-xs font-body mt-6">© 2025 Smart Bus Transit</p>
      </div>
    </div>
  )
}