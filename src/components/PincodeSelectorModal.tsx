import React, { useState, useEffect } from 'react';
import { MapPin, X, Check, ArrowRight, Sparkles } from 'lucide-react';
import {
  getUserPincode,
  setUserPincode,
  getRegionFromPincode,
  POPULAR_PINCODES
} from '../utils/pincodeHelper.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';

interface PincodeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  isFarmerMode?: boolean;
}

export const PincodeSelectorModal: React.FC<PincodeSelectorModalProps> = ({
  isOpen,
  onClose,
  title,
  isFarmerMode = false
}) => {
  const { user, updateUser } = useAuth();
  const [pincode, setPincode] = useState('');
  const [detectedRegion, setDetectedRegion] = useState({ city: '', state: '', area: '', isValid: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = user?.pincode || getUserPincode();
      setPincode(current);
      setDetectedRegion(getRegionFromPincode(current));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);
    setDetectedRegion(getRegionFromPincode(val));
  };

  const selectPreset = (pin: string) => {
    setPincode(pin);
    setDetectedRegion(getRegionFromPincode(pin));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pincode.length !== 6) return;

    setSaving(true);
    setUserPincode(pincode);

    if (user) {
      try {
        const payload: Record<string, unknown> = { pincode };
        if (isFarmerMode || user.role === 'farmer') {
          payload.farmLocation = {
            ...(user.farmLocation || {}),
            pincode,
            city: detectedRegion.city || user.farmLocation?.city
          };
        }
        const res = await api.auth.updateProfile(payload);
        if (res.success && res.user) {
          updateUser(res.user);
        }
      } catch (err) {
        console.warn('Could not sync pincode to profile:', err);
      }
    }

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden space-y-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {title || (isFarmerMode ? 'Set Your Farm Area PIN Code' : 'Set Your Delivery PIN Code')}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isFarmerMode
                  ? 'Connect with nearby customers in your agricultural circle'
                  : 'Check live produce availability and calculate direct delivery'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Enter 6-digit Indian PIN Code
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={handlePincodeChange}
                placeholder="e.g. 411038"
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 text-stone-900 font-bold tracking-widest text-lg bg-stone-50 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600"
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
              <p className="text-xs text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
                <span>📍 Location identified:</span>
                <span className="font-bold">{detectedRegion.city}, {detectedRegion.state}</span>
                {detectedRegion.area && <span className="text-stone-500">({detectedRegion.area})</span>}
              </p>
            ) : (
              <p className="text-[11px] text-stone-400 mt-1.5">
                Type 6 digits to auto-detect your delivery circle.
              </p>
            )}
          </div>

          {/* Quick Select Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Popular Farming Hubs & Cities:</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_PINCODES.slice(0, 6).map(p => (
                <button
                  key={p.pincode}
                  type="button"
                  onClick={() => selectPreset(p.pincode)}
                  className={`text-left p-2 rounded-xl border text-xs transition-all ${
                    pincode === p.pincode
                      ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-900'
                      : 'border-stone-200 hover:border-emerald-400 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <p className="text-[11px] font-bold truncate">{p.city}</p>
                  <p className="text-[10px] text-stone-500">{p.pincode}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pincode.length !== 6 || saving}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{saving ? 'Updating...' : 'Apply & Save'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
