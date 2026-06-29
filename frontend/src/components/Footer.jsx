/*import { Link } from 'react-router-dom'
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand }
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Bus size={20} className="text-white"/>
            </div>
            <div>
              <span className="block font-display font-bold text-white">Smart Bus</span>
              <span className="block text-primary text-[10px] font-semibold tracking-widest uppercase">Transit</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed font-body mb-5">
            Sri Lanka's most reliable real-time bus tracking system. Connecting passengers, drivers, and cities.
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#"
                className="w-9 h-9 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200">
                <Icon size={16}/>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links }
        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5">
            {[['/', 'Home'],['/about','About Us'],['/live','Live Routes'],['/services','Services'],['/contact','Contact']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-primary text-sm font-body transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"/>{label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal }
        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2.5">
            {[['/privacy','Privacy Policy'],['/register','Driver Registration'],['/login','Passenger Login']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-primary text-sm font-body transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-primary rounded-full"/>{label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact }
        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3">
            {[
              [Phone, '+94 70 234 5678'],
              [Mail,  'info@smartbustransit.lk'],
              [MapPin,'No. 42, Kegalle Road, Mawanalla'],
            ].map(([Icon, text], i) => (
              <li key={i} className="flex items-start gap-3 text-gray-400 text-sm font-body">
                <Icon size={15} className="text-primary mt-0.5 flex-shrink-0"/>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs font-body">© 2025 Smart Bus Transit. All rights reserved.</p>
          <p className="text-gray-500 text-xs font-body">Built with ❤️ for Sri Lanka 🇱🇰</p>
        </div>
      </div>
    </footer>
  )
}*/


import { Link } from 'react-router-dom'
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-navy overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-dark via-primary to-primary-dark"/>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"/>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"/>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-dark rounded-xl
                              flex items-center justify-center shadow-lg shadow-primary/40">
                <Bus size={22} className="text-white"/>
              </div>
              <div>
                <span className="block font-display font-extrabold text-white text-[15px]">Smart Bus</span>
                <span className="block text-primary text-[9px] font-bold tracking-[0.2em] uppercase">Transit</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-body mb-5">
              Sri Lanka's most reliable real-time bus tracking platform. Connecting passengers and drivers island-wide.
            </p>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary
                             rounded-lg flex items-center justify-center transition-all duration-200 group">
                  <Icon size={15} className="text-gray-400 group-hover:text-white transition-colors"/>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 text-sm uppercase tracking-wider
                           flex items-center gap-2 after:flex-1 after:h-px after:bg-primary/30">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[['/', 'Home'],['/about','About Us'],['/live','Live Routes'],['/services','Services'],['/contact','Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to}
                    className="text-gray-400 hover:text-primary text-sm font-body transition-all duration-200
                               flex items-center gap-2 group">
                    <ArrowRight size={12} className="text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all"/>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {[['/privacy','Privacy Policy'],['/register','Driver Registration'],['/login','Passenger Login']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to}
                    className="text-gray-400 hover:text-primary text-sm font-body transition-all duration-200
                               flex items-center gap-2 group">
                    <ArrowRight size={12} className="text-primary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all"/>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              {[
                [Phone, '+94 11 234 5678',                      'tel:+94112345678'],
                [Mail,  'info@smartbustransit.lk',                   'mailto:info@smartbustransit.lk'],
                [MapPin,'No. 42, Kegalle Road, Mawanalla',       '#'],
              ].map(([Icon, text, href], i) => (
                <li key={i}>
                  <a href={href}
                    className="flex items-start gap-3 text-gray-400 hover:text-primary text-sm font-body transition-colors group">
                    <div className="w-7 h-7 bg-primary/10 group-hover:bg-primary/20 rounded-lg
                                    flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                      <Icon size={13} className="text-primary"/>
                    </div>
                    <span className="leading-relaxed">{text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs font-body">© 2026 Smart Bus Transit. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs font-body text-gray-500">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>
              System Online
            </span>
            <p className="text-gray-500 text-xs font-body">Built with ❤️ for Sri Lanka 🇱🇰</p>
          </div>
        </div>
      </div>
    </footer>
  )
}