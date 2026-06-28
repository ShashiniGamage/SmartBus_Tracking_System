import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import { Bus, User, Mail, Lock, Phone, Eye, EyeOff, UserCheck } from 'lucide-react'

export default function Register() {
  const navigate              = useNavigate()
  const [form, setForm]       = useState({ name:'', email:'', phone:'', password:'', role:'passenger' })
  const [show, setShow]       = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      const { data } = await register(form)
      setSuccess(data.message)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-[#2D1B4E] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-primary px-8 py-7 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <UserCheck size={30} className="text-white"/>
            </div>
            <h1 className="font-display font-bold text-2xl text-white">Create Account</h1>
            <p className="text-white/80 text-sm font-body mt-1">Join Lanka Metro Transit</p>
          </div>

          <div className="px-8 py-8">
            {/* Role selector */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              {[['passenger','🧍 Passenger'],['driver','🚌 Bus Driver']].map(([r, l]) => (
                <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                  className={`flex-1 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-200
                    ${form.role === r ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-navy'}`}>
                  {l}
                </button>
              ))}
            </div>

            {form.role === 'driver' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-amber-700 text-xs font-body flex gap-2">
                <span>⏳</span>
                <span>Driver accounts require admin approval before you can log in.</span>
              </div>
            )}

            {error   && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-body">⚠️ {error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-4 font-body">✅ {success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { k:'name',  icon:User,  type:'text',  ph:'Full Name',      label:'Full Name' },
                { k:'email', icon:Mail,  type:'email', ph:'your@email.com', label:'Email Address' },
                { k:'phone', icon:Phone, type:'tel',   ph:'07X XXX XXXX',   label:'Phone Number' },
              ].map(({ k, icon: Icon, type, ph, label }) => (
                <div key={k}>
                  <label className="block font-display font-semibold text-navy text-sm mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type={type} className="input-field pl-11" placeholder={ph}
                      value={form[k]} onChange={set(k)} required={k !== 'phone'}/>
                  </div>
                </div>
              ))}
              <div>
                <label className="block font-display font-semibold text-navy text-sm mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input type={show ? 'text' : 'password'} className="input-field pl-11 pr-11"
                    placeholder="Create a strong password" value={form.password} onChange={set('password')} required minLength={6}/>
                  <button type="button" onClick={() => setShow(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                    {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Creating account...</>
                  : `Register as ${form.role === 'driver' ? 'Driver' : 'Passenger'}`}
              </button>
            </form>

            <p className="text-center font-body text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}