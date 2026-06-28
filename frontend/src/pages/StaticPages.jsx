import { useEffect, useRef, useState } from 'react'
import { Bus, Target, Eye, Heart, Award, Users, Globe, Zap,
         Bell, Shield, Clock, Navigation, Smartphone, BarChart3,
         Phone, Mail, MapPin, Send } from 'lucide-react'

function useReveal() {
  const refs = useRef([])
  useEffect(() => {
    const obs = new IntersectionObserver(
      e => e.forEach(x => x.isIntersecting && x.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    refs.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])
  const r = el => { if (el && !refs.current.includes(el)) refs.current.push(el) }
  return r
}

// ── ABOUT ─────────────────────────────────────────────────────
export function About() {
  const r = useReveal()
  const values = [
    { icon: Heart,   title: 'Passenger First',           desc: 'Every feature we build starts with one question: does this make the commuter\'s day better?' },
    { icon: Zap,     title: 'Real-Time Always',          desc: 'We believe outdated information is worse than none. Our platform delivers live data, always.' },
    { icon: Globe,   title: 'Nationwide Access',         desc: 'From Jaffna to Galle, every Sri Lankan deserves to know when their bus is coming.' },
    { icon: Award,   title: 'Driver Respect',            desc: 'We partner with drivers, not just track them. Their safety and dignity are non-negotiable.' },
    { icon: Users,   title: 'Community Driven',          desc: 'Built with feedback from thousands of real commuters across the island.' },
    { icon: Target,  title: 'Zero Tolerance for Downtime', desc: 'Our infrastructure is built for 99.9% uptime, because missing a bus matters.' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-navy to-[#2D1B4E] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-white px-4 py-2 rounded-full text-sm font-semibold font-body mb-6">
            <Bus size={16}/> About Smart Bus Transit
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl mb-6 leading-tight">
            We're Ending the Guessing<br/><span className="text-primary">at Bus Stops.</span>
          </h1>
          <p className="font-body text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Smart Bus Transit was born from a simple frustration: why should millions of Sri Lankans stand at a bus stop, staring down the road, wondering if their bus already left?
          </p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div ref={r} className="reveal text-center mb-14">
            <h2 className="section-title">Our Purpose</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div ref={r} className="reveal card p-8 border-l-4 border-primary">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                <Target size={24} className="text-primary"/>
              </div>
              <h3 className="font-display font-bold text-navy text-2xl mb-4">Our Mission</h3>
              <p className="font-body text-gray-600 leading-relaxed mb-4">
                To transform public transport in Sri Lanka by providing every passenger, driver, and transit authority with real-time, accurate, and accessible bus tracking technology.
              </p>
              <p className="font-body text-gray-600 leading-relaxed">
                We are committed to reducing commuter anxiety, improving punctuality across the network, and making public transport the first choice — not the last resort — for Sri Lankans from all walks of life.
              </p>
            </div>
            <div ref={r} className="reveal card p-8 border-l-4 border-navy" style={{transitionDelay:'100ms'}}>
              <div className="w-12 h-12 bg-navy/10 rounded-2xl flex items-center justify-center mb-5">
                <Eye size={24} className="text-navy"/>
              </div>
              <h3 className="font-display font-bold text-navy text-2xl mb-4">Our Vision</h3>
              <p className="font-body text-gray-600 leading-relaxed mb-4">
                A Sri Lanka where every bus journey is predictable, safe, and stress-free — where a passenger in Matara has the same quality of transit information as one in Colombo.
              </p>
              <p className="font-body text-gray-600 leading-relaxed">
                We envision a connected island where technology bridges the gap between infrastructure limitations and the modern commuter's expectations, making public transport not just functional, but delightful.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div ref={r} className="reveal text-center mb-14">
            <span className="text-primary font-body font-semibold text-sm uppercase tracking-widest">What We Stand For</span>
            <h2 className="section-title mt-2">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div ref={r} key={v.title} className="reveal p-6 rounded-2xl border-2 border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                   style={{transitionDelay:`${i*80}ms`}}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                  <v.icon size={22} className="text-primary group-hover:text-white transition-colors duration-300"/>
                </div>
                <h4 className="font-display font-bold text-navy mb-2">{v.title}</h4>
                <p className="font-body text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[['2019','Founded'],['48','Routes Covered'],['12,000+','Daily Users'],['25','Districts Served']].map(([n,l]) => (
            <div ref={r} key={l} className="reveal">
              <div className="font-display font-extrabold text-4xl mb-1">{n}</div>
              <div className="font-body text-white/70 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── SERVICES ──────────────────────────────────────────────────
export function Services() {
  const r = useReveal()
  const services = [
    { icon: Navigation, title: 'Real-Time GPS Tracking',      color: 'bg-red-500',    desc: 'Every active bus broadcasts its GPS location every 10 seconds. Passengers see a live moving marker on an interactive Sri Lanka map. When GPS drops, our time-estimation fallback keeps the data flowing automatically.' },
    { icon: Bell,       title: 'Smart Arrival Alerts',        color: 'bg-blue-500',   desc: 'Select your boarding stop once. We automatically send you a notification when your bus is roughly 10 minutes away. No refreshing, no guessing. Just a ping when it matters.' },
    { icon: Clock,      title: 'Accurate ETAs Per Stop',      color: 'bg-green-500',  desc: 'We display estimated arrival times for every stop on the route, calculated using actual GPS position, route distance, and any reported delays. The estimate updates live as the bus moves.' },
    { icon: Shield,     title: 'Delay & Cancellation Alerts', color: 'bg-orange-500', desc: 'Drivers report delays in the app with a reason and extra minutes. That information reaches every tracked passenger within seconds. Cancellations trigger immediate notifications.' },
    { icon: Smartphone, title: 'Driver Mobile Dashboard',     color: 'bg-purple-500', desc: 'A dedicated dashboard for drivers to register their bus, submit routes for approval, set schedules, start and end trips, and stream GPS — all from their phone.' },
    { icon: BarChart3,  title: 'Admin Control Panel',         color: 'bg-teal-500',   desc: 'Admins see every active trip on a live dashboard, manage driver approvals, review and edit route submissions, and monitor incidents in real time.' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-navy to-[#2D1B4E] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl mb-4">Our <span className="text-primary">Services</span></h1>
          <p className="font-body text-gray-300 text-lg">Everything you need for stress-free bus travel, built into one platform.</p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div ref={r} key={s.title} className="reveal card p-7 group" style={{transitionDelay:`${i*80}ms`}}>
              <div className={`${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                <s.icon size={24} className="text-white"/>
              </div>
              <h3 className="font-display font-bold text-navy text-lg mb-3">{s.title}</h3>
              <p className="font-body text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Simple Pricing</h2>
          <div className="card p-10 border-2 border-primary">
            <div className="font-display font-extrabold text-5xl text-primary mb-2">Free</div>
            <div className="font-body text-gray-400 mb-6">For all passengers, forever</div>
            {['Real-time bus tracking','Arrival notifications','Route search','ETA per stop','Delay alerts'].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm font-body text-navy py-2 border-b border-gray-100 last:border-0">
                <span className="text-green-500 font-bold">✓</span>{f}
              </div>
            ))}
            <a href="/register" className="btn-primary w-full mt-6 block text-center py-3.5">Get Started Free</a>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── CONTACT ───────────────────────────────────────────────────
export function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-navy to-[#2D1B4E] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl mb-4">Get in <span className="text-primary">Touch</span></h1>
          <p className="font-body text-gray-300 text-lg">We'd love to hear from you. Reach out any time.</p>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h2 className="section-title mb-4">Contact Information</h2>
              <p className="font-body text-gray-500 leading-relaxed">
                Our team is available Monday–Friday, 8am–6pm Sri Lanka time. For urgent transit issues, use the form and we'll respond within 2 hours.
              </p>
            </div>
            {[
              { icon: Phone,  label:'Phone',   value:'+94 11 234 5678',                     href:'tel:+94112345678' },
              { icon: Mail,   label:'Email',   value:'info@lankametro.lk',                   href:'mailto:info@lankametro.lk' },
              { icon: MapPin, label:'Address', value:'No. 42, Galle Road, Colombo 03, Sri Lanka', href:'#' },
            ].map(c => (
              <a key={c.label} href={c.href}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <c.icon size={20} className="text-primary group-hover:text-white transition-colors"/>
                </div>
                <div>
                  <div className="font-display font-semibold text-navy text-sm">{c.label}</div>
                  <div className="font-body text-gray-500 text-sm mt-0.5">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-display font-bold text-navy text-xl mb-2">Message Sent!</h3>
                <p className="font-body text-gray-500">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display font-bold text-navy text-xl mb-6">Send a Message</h3>
                <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-4">
                  {[
                    { k:'name',    ph:'Your full name',     type:'text',  label:'Name' },
                    { k:'email',   ph:'your@email.com',     type:'email', label:'Email' },
                    { k:'subject', ph:'What is this about?',type:'text',  label:'Subject' },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block font-display font-semibold text-navy text-sm mb-1.5">{f.label}</label>
                      <input type={f.type} className="input-field" placeholder={f.ph}
                        value={form[f.k]} onChange={set(f.k)} required/>
                    </div>
                  ))}
                  <div>
                    <label className="block font-display font-semibold text-navy text-sm mb-1.5">Message</label>
                    <textarea className="input-field resize-none" rows={5} placeholder="Tell us how we can help..."
                      value={form.message} onChange={set('message')} required/>
                  </div>
                  <button type="submit" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                    <Send size={16}/> Send Message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── PRIVACY ───────────────────────────────────────────────────
export function Privacy() {
  const sections = [
    { title:'1. Information We Collect',    content:'We collect information you provide directly: name, email address, phone number, and password during registration. For drivers, we additionally collect vehicle registration details. During active trips, we collect GPS location data from the driver\'s device at 10-second intervals. Passengers\' boarding stop preferences are stored to enable arrival notifications.' },
    { title:'2. How We Use Your Information',content:'We use collected information to authenticate your account and protect against unauthorized access; display real-time bus locations on our live map; calculate estimated arrival times for each route stop; send delay, cancellation, and arrival notifications; allow administrators to manage driver approvals and route operations; and improve platform performance through anonymized usage analytics.' },
    { title:'3. Data Sharing',              content:'Lanka Metro Transit does not sell, rent, or trade your personal information to third parties. Location data from drivers is shared only with passengers tracking the associated trip. Aggregated, anonymized data may be shared with transport authorities to improve route planning. We do not share data with advertising networks.' },
    { title:'4. GPS & Location Data',       content:'Driver GPS data is collected only when a trip is marked as active. Location updates stop immediately when a trip ends or is cancelled. Passengers\' locations are never collected — only their selected boarding stop is stored. GPS data older than 90 days is automatically deleted from our servers.' },
    { title:'5. Data Security',             content:'All data is transmitted over HTTPS. Passwords are hashed using bcrypt with a cost factor of 10. JWT tokens expire after 30 days. Our database servers are not publicly accessible. We conduct regular security audits and vulnerability assessments.' },
    { title:'6. Your Rights',               content:'You may request deletion of your account and all associated data at any time by contacting privacy@lankametro.lk. You may update your profile information from your dashboard. You may opt out of non-essential notifications. Data deletion requests are processed within 7 business days.' },
    { title:'7. Cookies',                   content:'We use session cookies strictly necessary for authentication. We do not use tracking cookies, advertising cookies, or third-party analytics cookies. You can disable cookies in your browser, but this will prevent you from staying logged in.' },
    { title:'8. Changes to This Policy',    content:'We will notify registered users by email at least 14 days before any material changes to this policy take effect. Continued use of the platform after that date constitutes acceptance of the revised policy.' },
    { title:'9. Contact',                   content:'For privacy concerns, data requests, or questions about this policy, contact our Privacy Officer at privacy@lankametro.lk or write to: Lanka Metro Transit, No. 42, Galle Road, Colombo 03, Sri Lanka.' },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="bg-gradient-to-br from-navy to-[#2D1B4E] py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h1 className="font-display font-extrabold text-4xl mb-4">Privacy <span className="text-primary">Policy</span></h1>
          <p className="font-body text-gray-300">Last updated: 10 june 2026</p>
        </div>
      </section>
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 space-y-8">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <p className="font-body text-gray-600 text-sm leading-relaxed">
                Smart Bus Transit ("we", "our", "us") is committed to protecting the privacy of all users of our platform. This policy explains what data we collect, how we use it, and your rights regarding that data.
              </p>
            </div>
            {sections.map(s => (
              <div key={s.title} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <h3 className="font-display font-bold text-navy text-lg mb-3">{s.title}</h3>
                <p className="font-body text-gray-600 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}