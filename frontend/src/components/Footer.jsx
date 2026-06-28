import { Link } from 'react-router-dom'
import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Bus size={20} className="text-white"/>
            </div>
            <div>
              <span className="block font-display font-bold text-white">Smart Bus Transit</span>
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

        {/* Quick Links */}
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

        {/* Legal */}
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

        {/* Contact */}
        <div>
          <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <ul className="space-y-3">
            {[
              [Phone, '+94 11 234 5678'],
              [Mail,  'info@smartbustransit.lk'],
              [MapPin,'No. 42, Galle Road, Colombo 03'],
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
}