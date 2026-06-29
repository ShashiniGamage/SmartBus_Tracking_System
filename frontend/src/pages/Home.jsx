import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Bell, Shield, ChevronRight, Bus, Users, Route, Star } from 'lucide-react'

const stats = [
  { num: '2,400+', label: 'Daily Trips' },
  { num: '48',     label: 'Routes Covered' },
  { num: '12,000+',label: 'Daily Passengers' },
  { num: '99.2%',  label: 'On-Time Rate' },
]

const features = [
  { icon: MapPin, title: 'Real-Time GPS Tracking',  desc: 'See exactly where your bus is on a live map. Updated every 10 seconds from the driver\'s device.' },
  { icon: Bell,   title: 'Smart Arrival Alerts',    desc: 'Get notified 2 stops before your bus arrives. Never miss your ride again.' },
  { icon: Clock,  title: 'Accurate ETAs',           desc: 'AI-powered time estimates using GPS speed and historical route data.' },
  { icon: Shield, title: 'Delay Notifications',     desc: 'Instant alerts if your bus is delayed or cancelled, with the reason explained.' },
]

const testimonials = [
  { name: 'Nimali Perera',    role: 'Daily Commuter, Colombo',   text: 'I used to wait 45 minutes not knowing when the bus would come. Now I just open Lanka Metro Transit and know exactly when to leave home.' },
  { name: 'Kasun Fernando',   role: 'University Student, Kandy', text: 'The app is so easy to use. The live map is incredible — I can actually see the bus moving towards my stop in real time.' },
  { name: 'Priya Rathnayake', role: 'Working Professional, Galle',text: 'The delay alerts have saved me so many times. I got notified about a cancellation and arranged an alternative immediately.' },
]

function HeroAnimation() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg viewBox="0 0 400 220" className="w-full drop-shadow-2xl">
        <rect x="0" y="100" width="400" height="40" rx="8" fill="#1A1A2E" opacity="0.9"/>
        <rect x="0" y="116" width="400" height="8" rx="4" fill="#C8102E" opacity="0.3"/>
        {[40,100,160,220,280,340].map(x => (
          <rect key={x} x={x} y="118" width="30" height="4" rx="2" fill="white" opacity="0.4"/>
        ))}
        {[30,130,230,330,380].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="80" r="12" fill="white" stroke="#C8102E" strokeWidth="3"/>
            <circle cx={x} cy="80" r="5"  fill="#C8102E"/>
            {i < 4 && <line x1={x+12} y1="80" x2={x+78} y2="80" stroke="#C8102E" strokeWidth="2" strokeDasharray="8,4" opacity="0.6"/>}
          </g>
        ))}
        {[['Kandy',20],['Kegalle',110],['Warakapola',205],['Veyangoda',310],['Colombo',355]].map(([name,x]) => (
          <text key={name} x={x} y="62" fontSize="8" fill="#1A1A2E" fontFamily="Poppins" fontWeight="600" textAnchor="middle" opacity="0.8">{name}</text>
        ))}
        <g style={{animation:'busMove 4s linear infinite'}}>
          <rect x="-50" y="95" width="40" height="24" rx="5" fill="#C8102E"/>
          <rect x="-48" y="98" width="10" height="8" rx="2" fill="white" opacity="0.9"/>
          <rect x="-35" y="98" width="10" height="8" rx="2" fill="white" opacity="0.9"/>
          <circle cx="-42" cy="120" r="4" fill="#1A1A2E"/>
          <circle cx="-18" cy="120" r="4" fill="#1A1A2E"/>
          <text x="-30" y="110" fontSize="6" fill="white" fontFamily="Poppins" fontWeight="700" textAnchor="middle">BUS</text>
        </g>
      </svg>
      <style>{`@keyframes busMove { 0%{transform:translateX(0)} 100%{transform:translateX(500px)} }`}</style>
    </div>
  )
}

export default function Home() {
  const revealRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    revealRefs.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  const addRef = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el) }

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-screen bg-gradient-to-br from-navy via-navy-light to-[#2D1B4E] flex items-center overflow-hidden pt-20">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"/>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-2xl"/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-light px-4 py-2 rounded-full text-sm font-semibold font-body">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              Live Tracking Active — 24/7
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-tight">
              The Future Of<br/>
              <span className="text-primary">SriLanakan</span><br/>
              Travel.
            </h1>
            <p className="font-body text-gray-300 text-lg leading-relaxed max-w-lg">
              Smart Bus Transit brings real-time GPS tracking to Sri Lanka's bus network. Search your route, track your bus live, and never wait in the dark again.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/live"     className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2">
                Track a Bus <ChevronRight size={18}/>
              </Link>
              <Link to="/register" className="border-2 border-white/30 text-white font-display font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2">
                Join Free <ChevronRight size={18}/>
              </Link>
            </div>
          </div>
          <div className="animate-fade-in">
            <HeroAnimation/>
            <p className="text-center text-gray-400 text-sm font-body mt-4 italic">
              "The road ahead is clear when you know what's coming."
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display font-extrabold text-2xl text-primary">{s.num}</div>
                <div className="font-body text-gray-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div ref={addRef} className="reveal text-center mb-14">
            <span className="text-primary font-body font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="section-title mt-2">Everything You Need,<br/>Right on Your Screen</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div ref={addRef} key={f.title} className="reveal card p-6 text-center group" style={{transitionDelay:`${i*100}ms`}}>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4
                                group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <f.icon size={26} className="text-primary group-hover:text-white transition-colors duration-300"/>
                </div>
                <h3 className="font-display font-semibold text-navy text-base mb-2">{f.title}</h3>
                <p className="font-body text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div ref={addRef} className="reveal text-center mb-14">
            <span className="text-primary font-body font-semibold text-sm uppercase tracking-widest">Simple Steps</span>
            <h2 className="section-title mt-2">Track Your Bus in 3 Steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step:'01', icon:Route,  title:'Search Your Route', desc:'Enter your origin and destination to find all available buses on that route.' },
              { step:'02', icon:MapPin, title:'Select Your Bus',   desc:'Pick a bus and choose your boarding stop. We\'ll start tracking it for you instantly.' },
              { step:'03', icon:Bell,   title:'Get Notified',      desc:'Receive real-time alerts as your bus approaches. No more guessing at the stop.' },
            ].map((s, i) => (
              <div ref={addRef} key={s.step} className="reveal text-center" style={{transitionDelay:`${i*150}ms`}}>
                <div className="w-20 h-20 bg-primary rounded-2xl flex flex-col items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/30">
                  <s.icon size={28} className="text-white"/>
                  <span className="text-white/60 text-[10px] font-display font-bold">{s.step}</span>
                </div>
                <h3 className="font-display font-bold text-navy text-lg mb-2">{s.title}</h3>
                <p className="font-body text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/live" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
              Try It Now — It's Free <ChevronRight size={18}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div ref={addRef} className="reveal text-center mb-14">
            <span className="text-primary font-body font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mt-2">What Commuters Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div ref={addRef} key={t.name} className="reveal bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                   style={{transitionDelay:`${i*100}ms`}}>
                <div className="flex gap-1 mb-4">
                  {Array.from({length:5}).map((_,j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400"/>)}
                </div>
                <p className="font-body text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold font-display">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white text-sm">{t.name}</div>
                    <div className="font-body text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white relative overflow-hidden border-t border-red-100">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full -translate-y-1/2 translate-x-1/2"/>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary rounded-full translate-y-1/2 -translate-x-1/2"/>
        </div>
        <div ref={addRef} className="reveal relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-navy mb-4">
            Ready to Never Miss a Bus Again?
          </h2>
          <p className="font-body text-gray-500 text-lg mb-8">
            Join thousands of Sri Lankan commuters who travel smarter every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-primary text-white font-display font-bold px-8 py-3.5 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 inline-flex items-center gap-2">
              <Users size={18}/> Create Free Account
            </Link>
            <Link to="/live" className="border-2 border-primary text-primary font-display font-semibold px-8 py-3.5 rounded-xl hover:bg-primary hover:text-white transition-all inline-flex items-center gap-2">
              <Bus size={18}/> View Live Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}