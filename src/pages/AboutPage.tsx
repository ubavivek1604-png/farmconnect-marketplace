import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Users,
  Code2,
  Database,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>Agricultural Tech Hackathon Project</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
          Empowering Indian Farmers Through<br />
          <span className="text-emerald-700">Direct Digital Commerce</span>
        </h1>
        <p className="text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          FarmConnect is a full-featured MERN Stack marketplace engineered to eliminate unnecessary supply chain intermediaries, ensuring cultivators earn fair remuneration while consumers access verified, field-fresh produce.
        </p>
      </div>

      {/* The Problem & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-rose-50/60 rounded-3xl p-8 border border-rose-100 space-y-4">
          <h3 className="font-bold text-rose-950 text-lg">The Traditional Mandi Dilemma</h3>
          <p className="text-xs text-rose-900/80 leading-relaxed">
            In conventional agricultural channels, farmers navigate layers of commission agents, transport aggregators, and wholesale brokers.
          </p>
          <ul className="space-y-2 text-xs text-rose-900/90">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Growers receive as little as 20% to 35% of the consumer retail rupee.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Produce spends 4 to 8 days in transit and cold storage, losing nutrients.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Consumers have zero visibility into who grew their food or what fertilizers were sprayed.</span>
            </li>
          </ul>
        </div>

        <div className="bg-emerald-50/60 rounded-3xl p-8 border border-emerald-100 space-y-4">
          <h3 className="font-bold text-emerald-950 text-lg">The FarmConnect Model</h3>
          <p className="text-xs text-emerald-900/80 leading-relaxed">
            Direct peer-to-peer connection through transparent digital listings, geographic farm maps, and multi-grower consolidated shopping.
          </p>
          <ul className="space-y-2 text-xs text-emerald-900/90">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Farmers retain 100% of their set produce price with zero middleman deductions.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Harvested upon order placement and delivered within 24 to 48 hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full geographic traceability through interactive Leaflet OpenStreetMap pins.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technology Stack Architecture */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-6 shadow-xs">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            Technical Specification
          </div>
          <h2 className="text-2xl font-bold text-stone-900">MERN Stack Architecture</h2>
          <p className="text-xs text-stone-500">
            Demonstrating modern full-stack web engineering patterns for scalable agricultural commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <Code2 className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-stone-900 text-sm">React & Vite Frontend</h4>
            <p className="text-[11px] text-stone-600">
              Responsive single page application with Tailwind CSS, custom React contexts, and accessible layouts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <Database className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-stone-900 text-sm">MongoDB & Mongoose</h4>
            <p className="text-[11px] text-stone-600">
              Document models with strict validation, schema indexes, atomic inventory reduction, and Mongoose references.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-stone-900 text-sm">Node & Express API</h4>
            <p className="text-[11px] text-stone-600">
              JWT authentication, Bcrypt password hashing, role-based access control, and validated RESTful endpoints.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-stone-900 text-sm">Leaflet & Recharts</h4>
            <p className="text-[11px] text-stone-600">
              Interactive OpenStreetMap GIS coordinates, location radius search, and live sales performance analytics charts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
        >
          <span>Explore Verified Farm Harvests</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
