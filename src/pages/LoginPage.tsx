import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sprout,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  MapPin,
  Check,
  Building2,
  Tractor
} from 'lucide-react';
import {
  getRegionFromPincode,
  setUserPincode,
  POPULAR_PINCODES
} from '../utils/pincodeHelper.ts';
import { api } from '../services/api.ts';

export const LoginPage: React.FC = () => {
  const { login, loginWithDemoAccount, user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Steps: 'credentials' -> 'pincode'
  const [step, setStep] = useState<'credentials' | 'pincode'>('credentials');
  const [loggedInRole, setLoggedInRole] = useState<'customer' | 'farmer' | 'admin'>('customer');
  const [loggedInName, setLoggedInName] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PIN code setup state
  const [pincode, setPincode] = useState('411038');
  const [detectedRegion, setDetectedRegion] = useState({ city: 'Pune', state: 'Maharashtra', area: 'Kothrud', isValid: true });
  const [savingPin, setSavingPin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);

      // Inspect role from response / user
      const isFarmer = email.toLowerCase().includes('farmer');
      const isAdmin = email.toLowerCase().includes('admin');
      const currentRole = isFarmer ? 'farmer' : isAdmin ? 'admin' : 'customer';

      if (isAdmin) {
        navigate('/admin/dashboard');
        return;
      }

      setLoggedInRole(currentRole);
      setLoggedInName(email.split('@')[0].replace('.', ' '));

      // Default pincode per role
      const defaultPin = currentRole === 'farmer' ? '411014' : '411038';
      setPincode(defaultPin);
      setDetectedRegion(getRegionFromPincode(defaultPin));

      // Transition to PIN Code step
      setStep('pincode');
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'farmer' | 'customer' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await loginWithDemoAccount(role);
      if (role === 'admin') {
        navigate('/admin/dashboard');
        return;
      }

      setLoggedInRole(role);
      setLoggedInName(role === 'farmer' ? 'Ramesh Patil' : 'Priya Sharma');

      const defaultPin = role === 'farmer' ? '411014' : '411038';
      setPincode(defaultPin);
      setDetectedRegion(getRegionFromPincode(defaultPin));
      setStep('pincode');
    } catch (err) {
      setError((err as Error).message || 'Failed demo login');
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    setDetectedRegion(getRegionFromPincode(val));
  };

  const selectPreset = (pin: string) => {
    setPincode(pin);
    setDetectedRegion(getRegionFromPincode(pin));
  };

  const handleSavePincode = async (targetDestination: 'marketplace' | 'dashboard') => {
    if (pincode.length !== 6) return;
    setSavingPin(true);

    setUserPincode(pincode);

    try {
      const payload: Record<string, unknown> = { pincode };
      if (loggedInRole === 'farmer') {
        payload.farmLocation = {
          pincode,
          city: detectedRegion.city
        };
      }
      const res = await api.auth.updateProfile(payload);
      if (res.success && res.user) {
        updateUser(res.user);
      }
    } catch (err) {
      console.warn('Could not sync pincode to profile:', err);
    } finally {
      setSavingPin(false);
    }

    if (targetDestination === 'dashboard') {
      if (loggedInRole === 'farmer') navigate('/farmer/dashboard');
      else navigate('/customer/dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Sprout className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-stone-900">FarmConnect</span>
        </Link>

        {step === 'credentials' ? (
          <>
            <h1 className="text-xl font-bold text-stone-900">Sign in to your account</h1>
            <p className="text-xs text-stone-500">
              Access your farm dashboard, customer orders, or administration tools.
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Email Verified</span>
            </div>
            <h1 className="text-xl font-bold text-stone-900">
              {loggedInRole === 'farmer' ? 'Set Your Farm Area PIN Code' : 'Set Your Delivery Area PIN Code'}
            </h1>
            <p className="text-xs text-stone-500">
              {loggedInRole === 'farmer'
                ? `Welcome, ${loggedInName}! Enter your farm PIN code so local buyers can verify produce delivery distance.`
                : `Welcome, ${loggedInName}! Enter your 6-digit PIN to check live crop availability and direct 24h delivery.`}
            </p>
          </>
        )}
      </div>

      {/* STEP 1: EMAIL & PASSWORD LOGIN */}
      {step === 'credentials' && (
        <>
          {/* 1-Click Test Credentials for Hackathon Evaluation */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Hackathon 1-Click Evaluation Roles</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Instantly sign in with pre-seeded accounts containing live products, maps, and order history:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('farmer')}
                className="px-2.5 py-2 bg-white hover:bg-emerald-100/70 border border-emerald-300 rounded-xl text-left text-xs transition-colors cursor-pointer"
              >
                <p className="font-bold text-stone-900">👨‍🌾 Farmer</p>
                <p className="text-[10px] text-stone-500 truncate">Ramesh Patil</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="px-2.5 py-2 bg-white hover:bg-emerald-100/70 border border-emerald-300 rounded-xl text-left text-xs transition-colors cursor-pointer"
              >
                <p className="font-bold text-stone-900">🛒 Customer</p>
                <p className="text-[10px] text-stone-500 truncate">Priya Sharma</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="px-2.5 py-2 bg-white hover:bg-emerald-100/70 border border-emerald-300 rounded-xl text-left text-xs transition-colors cursor-pointer"
              >
                <p className="font-bold text-stone-900">🛡️ Admin</p>
                <p className="text-[10px] text-stone-500 truncate">FarmConnect HQ</p>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-2xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. customer@farmconnect.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Default test password: password123</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In with Email'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-stone-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
                Create an Account
              </Link>
            </div>
          </form>
        </>
      )}

      {/* STEP 2: AREA PIN CODE SETUP (AFTER LOGIN) */}
      {step === 'pincode' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl space-y-5 animate-[fadeIn_0.3s_ease-out]">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-stone-900">
                {loggedInRole === 'farmer' ? 'Farm Location Identification' : 'Delivery Availability Check'}
              </h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {loggedInRole === 'farmer'
                  ? 'Your products will be tagged with this Farm PIN code so nearby consumers discover your farm on our map.'
                  : 'Products in our marketplace will show if they are deliverable to your doorstep and their direct farm distance.'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-stone-700">
              {loggedInRole === 'farmer' ? 'Your Farm Area PIN Code (6 digits)' : 'Your Delivery Area PIN Code (6 digits)'}
            </label>

            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={handlePincodeChange}
                placeholder="e.g. 411038"
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-stone-900 font-bold tracking-widest text-xl bg-stone-50 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600"
                autoFocus
              />
              {detectedRegion.isValid && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{detectedRegion.city}</span>
                </div>
              )}
            </div>

            {detectedRegion.isValid ? (
              <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                <span className="font-bold">📍 Detected Region:</span> {detectedRegion.city}, {detectedRegion.state}{' '}
                {detectedRegion.area && <span className="text-emerald-700">({detectedRegion.area})</span>}
              </div>
            ) : (
              <p className="text-[11px] text-stone-400">
                Enter any 6-digit Indian PIN code to locate your area.
              </p>
            )}
          </div>

          {/* Quick Preset Selector */}
          <div className="space-y-2 pt-1">
            <p className="text-[11px] font-semibold text-stone-500">
              {loggedInRole === 'farmer' ? 'Popular Agricultural Regions:' : 'Popular Delivery Regions:'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_PINCODES.slice(0, 4).map(p => (
                <button
                  key={p.pincode}
                  type="button"
                  onClick={() => selectPreset(p.pincode)}
                  className={`p-2 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                    pincode === p.pincode
                      ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-900 shadow-xs'
                      : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <p className="font-bold truncate">{p.city}</p>
                  <p className="text-[10px] text-stone-500">PIN: {p.pincode}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            {loggedInRole === 'farmer' ? (
              <button
                type="button"
                disabled={pincode.length !== 6 || savingPin}
                onClick={() => handleSavePincode('dashboard')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Tractor className="w-4 h-4" />
                <span>{savingPin ? 'Saving Farm Location...' : 'Save Farm PIN & Go to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={pincode.length !== 6 || savingPin}
                  onClick={() => handleSavePincode('marketplace')}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{savingPin ? 'Saving Location...' : 'Save PIN & Browse Available Produce'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={savingPin}
                  onClick={() => handleSavePincode('dashboard')}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Go to Customer Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
