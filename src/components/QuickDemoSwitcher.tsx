import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Sparkles, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { api } from '../services/api.ts';

export const QuickDemoSwitcher: React.FC = () => {
  const { user, loginWithDemoAccount, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSelectRole = async (role: 'farmer' | 'customer' | 'admin') => {
    try {
      await loginWithDemoAccount(role);
      setIsOpen(false);
      setMessage(`Switched to ${role.toUpperCase()} role.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all demo data (products, orders, users) to default seeds?')) return;
    try {
      setIsResetting(true);
      await api.admin.resetSeed();
      setMessage('Sample data refreshed to initial state.');
      setTimeout(() => {
        setMessage(null);
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs"
        title="Quick Role Switcher for Hackathon Judges"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">Role:</span>
        <span className="font-semibold capitalize">
          {user ? `${user.role} (${user.name.split(' ')[0]})` : 'Guest'}
        </span>
        <ChevronDown className={`w-3 h-3 text-emerald-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-xs">
          <div className="px-3 py-1.5 border-b border-stone-100">
            <p className="font-semibold text-stone-800">Hackathon Quick Switch</p>
            <p className="text-stone-500 text-[11px]">Instant 1-click test roles with live data</p>
          </div>

          <div className="p-1 space-y-1">
            <button
              onClick={() => handleSelectRole('farmer')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-stone-50 transition-colors ${
                user?.role === 'farmer' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-stone-700'
              }`}
            >
              <div>
                <div className="font-medium">👨‍🌾 Farmer: Ramesh Patil</div>
                <div className="text-[10px] text-stone-500">Manage produce, view orders, track revenue</div>
              </div>
              {user?.role === 'farmer' && <Check className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              onClick={() => handleSelectRole('customer')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-stone-50 transition-colors ${
                user?.role === 'customer' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-stone-700'
              }`}
            >
              <div>
                <div className="font-medium">🛒 Customer: Priya Sharma</div>
                <div className="text-[10px] text-stone-500">Cart, direct checkout & order timeline</div>
              </div>
              {user?.role === 'customer' && <Check className="w-4 h-4 text-emerald-600" />}
            </button>

            <button
              onClick={() => handleSelectRole('admin')}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-stone-50 transition-colors ${
                user?.role === 'admin' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-stone-700'
              }`}
            >
              <div>
                <div className="font-medium">🛡️ Admin: FarmConnect HQ</div>
                <div className="text-[10px] text-stone-500">Platform GMV, user oversight, moderation</div>
              </div>
              {user?.role === 'admin' && <Check className="w-4 h-4 text-emerald-600" />}
            </button>

            {user && (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg"
              >
                Sign out to Guest
              </button>
            )}
          </div>

          <div className="mt-1 pt-1 border-t border-stone-100 px-2">
            <button
              onClick={handleResetData}
              disabled={isResetting}
              className="w-full text-left px-2 py-1.5 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-50 flex items-center gap-1.5 text-[11px]"
            >
              <RefreshCw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
              Reset Demo Seeds to Default
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed bottom-4 right-4 z-50 bg-stone-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg animate-fade-in">
          {message}
        </div>
      )}
    </div>
  );
};
