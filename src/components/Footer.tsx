import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Heart, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FarmConnect</span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              “Fresh from Local Farms, Directly to You.”
            </p>
            <p className="text-xs text-stone-500">
              Eliminating unnecessary middlemen to ensure fair remuneration for local growers and pristine, traceable produce for consumers.
            </p>
          </div>

          {/* Marketplace Categories */}
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider mb-4">
              Direct Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/marketplace?category=Vegetables" className="hover:text-emerald-400 transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Fruits" className="hover:text-emerald-400 transition-colors">
                  Seasonal Fruits
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Grains" className="hover:text-emerald-400 transition-colors">
                  Aged Traditional Grains
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Pulses" className="hover:text-emerald-400 transition-colors">
                  Unpolished Pulses
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Dairy" className="hover:text-emerald-400 transition-colors">
                  Gir Cow A2 Dairy
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Organic+Produce" className="hover:text-emerald-400 transition-colors">
                  Certified Organic
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Farmers */}
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider mb-4">
              Explore & Connect
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/farmers" className="hover:text-emerald-400 transition-colors">
                  Discover Nearby Farms
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Sell Your Produce (Farmer Register)
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  Our Direct Trade Mission
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  Shopping Basket & Checkout
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Farmer & Customer Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & College Hackathon Details */}
          <div>
            <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wider mb-4">
              Project & Support
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Agricultural Innovation Hub, Maharashtra & Pan-India Network</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@farmconnect.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+91 1800-FARM-CONNECT</span>
              </div>
              <div className="pt-2 text-stone-400">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MERN Stack College Hackathon Prototype
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} FarmConnect. All rights reserved.</p>
          <p className="flex items-center gap-1 text-stone-400">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Farmers & Conscious Consumers
          </p>
        </div>
      </div>
    </footer>
  );
};
