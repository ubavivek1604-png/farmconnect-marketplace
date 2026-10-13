import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sprout,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
  Store,
  Tractor
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'customer' | 'farmer'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Farmer-specific fields
  const [farmName, setFarmName] = useState('');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [description, setDescription] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [organicCertified, setOrganicCertified] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
        phone,
        address
      };

      if (role === 'farmer') {
        payload.farmLocation = {
          farmName: farmName || `${name}'s Farm`,
          city,
          state,
          address,
          description: description || 'Local organic cultivator selling direct produce.',
          lat: city === 'Nashik' ? 19.9975 : city === 'Bengaluru' ? 13.0982 : city === 'Ludhiana' ? 30.9010 : 18.5204,
          lng: city === 'Nashik' ? 73.7898 : city === 'Bengaluru' ? 77.3986 : city === 'Ludhiana' ? 75.8573 : 73.8567,
          experienceYears: Number(experienceYears),
          organicCertified
        };
      }

      await register(payload);
      if (role === 'farmer') navigate('/farmer/dashboard');
      else navigate('/marketplace');
    } catch (err) {
      setError((err as Error).message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-stone-900">FarmConnect</span>
        </Link>
        <h1 className="text-xl font-bold text-stone-900">Create your account</h1>
        <p className="text-xs text-stone-500">
          Join India's direct farm-to-consumer marketplace.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === 'customer'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <User className="w-4 h-4 text-emerald-600" />
          <span>I want to Buy (Customer)</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('farmer')}
          className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === 'farmer'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Tractor className="w-4 h-4 text-emerald-600" />
          <span>I want to Sell (Farmer)</span>
        </button>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs text-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Anand Devadiga"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">Mobile Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98220 44551"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. anand.grower@farmconnect.org"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-stone-700 block mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-semibold text-stone-700 block mb-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Locality, Village, District"
              className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
            />
          </div>
        </div>

        {/* Farmer Specific Setup */}
        {role === 'farmer' && (
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Farm Profile Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Farm / Orchard Name</label>
                <input
                  type="text"
                  required={role === 'farmer'}
                  value={farmName}
                  onChange={e => setFarmName(e.target.value)}
                  placeholder="e.g. Sahyadri Organic Orchards"
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Agricultural Region / City</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                >
                  <option value="Pune">Pune & Haveli</option>
                  <option value="Nashik">Nashik Belt</option>
                  <option value="Ludhiana">Ludhiana (Punjab)</option>
                  <option value="Bengaluru">Bengaluru Rural</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Cultivation Experience (Years)</label>
                <input
                  type="number"
                  min={1}
                  value={experienceYears}
                  onChange={e => setExperienceYears(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">Farm Bio / Crops Grown</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your soil, crops, irrigation, and natural cultivation methods..."
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={organicCertified}
                    onChange={e => setOrganicCertified(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-stone-800">
                    My farm follows chemical-free / certified organic farming practices
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
        >
          {loading ? 'Creating your account...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Customer'}`}
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="pt-2 text-center text-stone-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
};
