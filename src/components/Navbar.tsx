import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { QuickDemoSwitcher } from './QuickDemoSwitcher.tsx';
import { PincodeSelectorModal } from './PincodeSelectorModal.tsx';
import { getUserPincode, getRegionFromPincode } from '../utils/pincodeHelper.ts';
import {
  ShoppingBag,
  Menu,
  X,
  Sprout,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Tractor,
  MapPin
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState(user?.pincode || getUserPincode());
  const [regionInfo, setRegionInfo] = useState(getRegionFromPincode(currentPin));
  const navigate = useNavigate();

  useEffect(() => {
    const pin = user?.pincode || getUserPincode();
    setCurrentPin(pin);
    setRegionInfo(getRegionFromPincode(pin));

    const onPinChange = (e: Event) => {
      const customPin = (e as CustomEvent).detail || getUserPincode();
      setCurrentPin(customPin);
      setRegionInfo(getRegionFromPincode(customPin));
    };

    window.addEventListener('farmconnect_pincode_changed', onPinChange);
    return () => {
      window.removeEventListener('farmconnect_pincode_changed', onPinChange);
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-emerald-700 font-semibold'
        : 'text-stone-600 hover:text-stone-900'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors flex items-center gap-1">
                FarmConnect
              </span>
              <span className="hidden sm:block text-[10px] text-stone-500 font-normal leading-none">
                Fresh from Local Farms
              </span>
            </div>
          </Link>

          {/* Area PIN Code Delivery Indicator */}
          <button
            onClick={() => setPincodeModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 text-xs text-stone-800 transition-colors shrink-0 group cursor-pointer"
            title="Click to check or change your area PIN code"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="text-left leading-tight">
              <span className="text-[10px] text-emerald-800 font-semibold block">
                {user?.role === 'farmer' ? 'Farm Circle' : 'Delivering to'}
              </span>
              <span className="font-bold text-stone-900 text-xs">
                {currentPin}{' '}
                <span className="text-stone-500 font-normal">({regionInfo.city})</span>
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-emerald-700 opacity-60 group-hover:opacity-100" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/marketplace" className={navLinkClass}>
              Marketplace
            </NavLink>
            <NavLink to="/farmers" className={navLinkClass}>
              Local Farmers
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </nav>

          {/* Actions & Role Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* 1-Click Role Switcher for Hackathon Evaluation */}
            <QuickDemoSwitcher />

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile or Login/Register */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-100 transition-colors border border-stone-200"
                >
                  <img
                    src={
                      user.profileImage ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
                    }
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <p className="font-semibold text-stone-900 truncate max-w-[100px]">{user.name}</p>
                    <p className="text-[10px] text-stone-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden lg:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="font-semibold text-stone-900">{user.name}</p>
                      <p className="text-stone-500 text-[11px] truncate">{user.email}</p>
                    </div>

                    {/* Role Dashboard Routing */}
                    {user.role === 'farmer' && (
                      <Link
                        to="/farmer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <Tractor className="w-4 h-4 text-emerald-600" />
                        <span>Farmer Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'customer' && (
                      <Link
                        to="/customer/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>My Orders & Profile</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Admin Oversight</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left border-t border-stone-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900 md:hidden rounded-lg hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Marketplace
            </Link>
            <Link
              to="/farmers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Local Farmers
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              About
            </Link>
          </nav>

          <div className="pt-3 border-t border-stone-200">
            {user ? (
              <div className="space-y-2">
                {user.role === 'farmer' && (
                  <Link
                    to="/farmer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50"
                  >
                    Farmer Dashboard
                  </Link>
                )}
                {user.role === 'customer' && (
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50"
                  >
                    My Orders & Profile
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out ({user.name})
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 border border-stone-200 rounded-lg text-sm font-semibold text-stone-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-3 py-2 bg-emerald-600 rounded-lg text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
            {/* Mobile Area PIN Code Selector Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setPincodeModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-stone-800 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-stone-900">
                  {user?.role === 'farmer' ? 'Farm Circle' : 'Delivering to'}: {currentPin} ({regionInfo.city})
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 underline">Change PIN</span>
            </button>
          </div>
        </div>
      )}

      {/* Pincode Selection Modal */}
      <PincodeSelectorModal
        isOpen={pincodeModalOpen}
        onClose={() => setPincodeModalOpen(false)}
        isFarmerMode={user?.role === 'farmer'}
      />
    </header>
  );
};
