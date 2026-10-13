import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Store, Sprout, Sparkles, Sun, Sunset, Compass } from 'lucide-react';

interface IndianVillageHeroProps {
  onSearch?: (query: string, category: string, city: string) => void;
}

export const IndianVillageHeroLandscape: React.FC<IndianVillageHeroProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'noon' | 'dusk'>('dawn');
  const [tractorHonked, setTractorHonked] = useState(false);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');

  const skyGradients = {
    dawn: 'from-[#e38d38] via-[#c26d2d] to-[#123824]',
    noon: 'from-[#0284c7] via-[#059669]/85 to-[#064e3b]',
    dusk: 'from-[#4c1d95] via-[#9d174d]/85 to-[#0c1a11]'
  };

  const triggerHonk = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTractorHonked(true);
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {}
    setTimeout(() => setTractorHonked(false), 3000);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedCategory, selectedCity);
    } else {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedCategory) params.set('category', selectedCategory);
      if (selectedCity) params.set('city', selectedCity);
      navigate(`/marketplace?${params.toString()}`);
    }
  };

  return (
    <section className={`relative overflow-hidden min-h-[90vh] lg:min-h-screen flex items-center justify-center bg-gradient-to-b ${skyGradients[timeOfDay]} transition-colors duration-1000 text-white pt-20 pb-28`}>
      {/* ========================================================================= */}
      {/* 1. LAYER 1: SKY, MORNING SUN, DRIFTING CLOUDS & BIRDS (DISTANT PARALLAX) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Sky Ambient Filter */}
        <div className={`absolute inset-0 bg-gradient-to-b ${skyGradients[timeOfDay]} transition-colors duration-1000`} />

        {/* Radiant Morning Sun / Twilight Moon */}
        <div className="absolute top-8 right-16 sm:right-32 w-28 h-28 sm:w-40 sm:h-40">
          <div className="absolute inset-0 rounded-full bg-amber-200/30 blur-2xl animate-sun-rays" />
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-300 via-yellow-100 to-white shadow-[0_0_80px_rgba(254,240,138,0.7)] flex items-center justify-center">
            <span className="text-3xl sm:text-5xl opacity-80 select-none">{timeOfDay === 'dusk' ? '🌙' : '☀️'}</span>
          </div>
        </div>

        {/* Drifting Morning Mist Clouds */}
        <div className="absolute top-12 left-10 text-white/20 text-6xl select-none animate-[cloudDriftSlow_90s_linear_infinite]">
          ☁️
        </div>
        <div className="absolute top-24 left-1/3 text-white/15 text-7xl select-none animate-[cloudDriftSlow_140s_linear_infinite_15s]">
          ☁️
        </div>
        <div className="absolute top-8 right-1/4 text-white/20 text-5xl select-none animate-[cloudDriftSlow_110s_linear_infinite_30s]">
          ☁️
        </div>

        {/* Distant Birds in V-Formation */}
        <div className="absolute top-20 left-1/4 flex gap-4 text-stone-900/40 text-xs font-bold tracking-widest animate-[birdFlap_12s_linear_infinite]">
          <span>~v~</span>
          <span className="translate-y-2">~v~</span>
          <span className="-translate-y-1">~v~</span>
          <span className="translate-y-3">~v~</span>
        </div>

        {/* Distant Sahyadri / Western Ghats Mountains */}
        <svg
          className="absolute bottom-44 sm:bottom-48 w-full h-44 text-[#0f2e1e]/85 preserve-3d"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            d="M0,192L48,176C96,160,192,128,288,144C384,160,480,224,576,213.3C672,203,768,117,864,106.7C960,96,1056,160,1152,176C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="currentColor"
          />
        </svg>

        {/* Rural Village Houses, Trees & Desi Cow (Middle Distance) */}
        <div className="absolute bottom-36 sm:bottom-40 left-6 sm:left-16 flex items-end gap-5 opacity-90">
          {/* Authentic Indian Mud-brick House with Mangalore Tiles */}
          <div className="relative">
            <div className="w-20 sm:w-24 h-7 bg-[#b45309] rounded-t-xs border-b-2 border-[#78350f] shadow-md flex items-center justify-around px-1">
              <span className="text-[8px] text-amber-200">〰️</span>
              <span className="text-[8px] text-amber-200">〰️</span>
              <span className="text-[8px] text-amber-200">〰️</span>
            </div>
            <div className="w-18 sm:w-22 h-11 bg-[#78350f] mx-auto relative border-t-2 border-[#451a03] shadow-md">
              <div className="w-3.5 h-6 bg-[#451a03] rounded-t-xs absolute bottom-0 left-3" />
              <div className="w-3 h-3 bg-amber-200/90 rounded-xs absolute top-2 right-3 border border-[#451a03]" />
            </div>
            <div className="absolute -top-10 right-4 text-stone-300/80 text-xs animate-[bounce_4s_infinite]">
              💨
            </div>
          </div>

          {/* Broad Banyan Tree with Spreading Canopy */}
          <div className="relative -ml-2 -mb-1">
            <div className="w-24 sm:w-32 h-20 sm:h-24 rounded-full bg-[#14532d] shadow-lg relative flex items-center justify-center">
              <div className="w-16 sm:w-20 h-14 sm:h-16 rounded-full bg-[#166534] absolute -top-2 -left-2" />
              <div className="w-14 sm:w-18 h-12 sm:h-14 rounded-full bg-[#15803d] absolute -top-1 -right-2" />
            </div>
            <div className="w-4 h-12 bg-[#451a03] mx-auto -mt-2 rounded-b-xs relative">
              <div className="w-0.5 h-10 bg-[#78350f] absolute -left-1.5 top-0" />
              <div className="w-0.5 h-8 bg-[#78350f] absolute -right-1 top-1" />
            </div>
          </div>

          {/* Grazing Desi Gir Cow */}
          <div className="relative ml-2 mb-1 text-2xl sm:text-3xl animate-[pulse_4s_infinite]" title="Desi Gir Cow (Pure A2 Dairy)">
            🐄
          </div>

          {/* Coconut Palm */}
          <div className="relative ml-2 mb-2 hidden sm:block">
            <div className="w-16 h-12 relative">
              <div className="absolute -top-3 left-0 w-8 h-2 bg-[#15803d] rounded-full rotate-[-35deg]" />
              <div className="absolute -top-3 right-0 w-8 h-2 bg-[#15803d] rounded-full rotate-[35deg]" />
              <div className="absolute -top-5 left-4 w-8 h-2 bg-[#16a34a] rounded-full rotate-[-10deg]" />
            </div>
            <div className="w-2 h-24 bg-[#78350f] mx-auto rounded-xs rotate-[-4deg]" />
          </div>
        </div>

        {/* Waving Golden Wheat & Lush Paddy Fields (Middle Ground) */}
        <div className="absolute bottom-16 sm:bottom-20 inset-x-0 h-24 bg-gradient-to-t from-[#064e3b] via-[#047857] to-[#d97706]/70 shadow-lg border-t border-emerald-400/20 flex items-end justify-between px-2 overflow-hidden">
          {[...Array(36)].map((_, i) => (
            <div
              key={i}
              className={`w-3.5 sm:w-4 flex flex-col items-center animate-grass-sway ${
                i % 2 === 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}
              style={{ animationDelay: `${(i % 6) * 0.25}s` }}
            >
              <span className="text-base sm:text-lg select-none leading-none">
                {i % 3 === 0 ? '🌾' : i % 3 === 1 ? '🌱' : '🌾'}
              </span>
              <div className={`w-0.5 h-12 sm:h-16 ${i % 2 === 0 ? 'bg-amber-500' : 'bg-emerald-600'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LAYER 2: DIRT COUNTRY ROAD & MOVING INDIAN TRACTOR WITH PRODUCE TROLLEY */}
      {/* ========================================================================= */}
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-[#291807] border-t-2 border-dashed border-[#854d0e] z-10 flex items-center overflow-hidden pointer-events-auto">
        {/* Subtle dust particles on path */}
        <div className="absolute inset-0 bg-[radial-gradient(#ca8a04_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

        {/* Animated Moving Indian Tractor */}
        <div
          onClick={triggerHonk}
          className={`absolute flex items-end select-none cursor-pointer group pointer-events-auto ${
            speed === 'fast' ? 'animate-[tractorChug_14s_linear_infinite]' : 'animate-tractor-chug'
          }`}
        >
          {/* Interactive Honk Bubble */}
          {tractorHonked && (
            <div className="absolute -top-14 left-1/4 bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-full text-xs shadow-xl whitespace-nowrap animate-bounce z-40 border border-amber-500">
              📢 POM POM! Fresh Farm Harvest Coming! 🍅🌾
            </div>
          )}

          {/* Tractor Assembly */}
          <div className="flex items-end gap-1.5 animate-tractor-bob">
            {/* Exhaust Pipe & Animated Smoke Puffs */}
            <div className="relative w-4 h-12 mr-1">
              <span className="absolute bottom-2 left-0 text-stone-200/90 text-sm animate-smoke-1">💨</span>
              <span className="absolute bottom-6 left-1 text-stone-300/80 text-sm animate-smoke-2">💨</span>
              <span className="absolute bottom-9 left-2 text-stone-400/70 text-xs animate-smoke-3">💨</span>
            </div>

            {/* Authentic Indian Tractor (Mahindra / Swaraj Style) */}
            <div className="relative">
              <div className="absolute -top-7 left-6 text-xl" title="Farmer driving harvest">
                👨‍🌾
              </div>

              <svg width="84" height="46" viewBox="0 0 84 46" className="drop-shadow-xl">
                <rect x="22" y="10" width="28" height="22" rx="3" fill="#b91c1c" />
                <rect x="46" y="16" width="32" height="16" rx="4" fill="#991b1b" />
                <rect x="74" y="18" width="5" height="11" rx="1.5" fill="#facc15" />
                <rect x="52" y="3" width="3.5" height="14" rx="1" fill="#475569" />
                <rect x="51" y="2" width="5.5" height="2.5" rx="1" fill="#94a3b8" />
                <circle cx="75" cy="18" r="2.5" fill="#fef08a" />
                <rect x="20" y="18" width="7" height="10" rx="1.5" fill="#1e293b" />
                <line x1="34" y1="20" x2="42" y2="15" stroke="#0f172a" strokeWidth="2.5" />
                <circle cx="42" cy="14" r="3.5" stroke="#0f172a" strokeWidth="2" fill="none" />
                <circle cx="20" cy="32" r="13" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                <circle cx="20" cy="32" r="6" fill="#facc15" />
                <circle cx="66" cy="35" r="9" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                <circle cx="66" cy="35" r="4" fill="#facc15" />
              </svg>
            </div>

            {/* Hitch Linkage */}
            <div className="w-2.5 h-2 bg-stone-700 self-center" />

            {/* Wooden Farm Trolley loaded with Produce Crates */}
            <div className="relative bg-[#78350f] border-2 border-[#451a03] rounded-xs w-28 h-9 flex items-center justify-around px-2 shadow-inner">
              <div className="absolute -top-5 inset-x-0 flex items-center justify-around text-xs sm:text-sm">
                <span title="Fresh Tomatoes">🍅</span>
                <span title="Crisp Spinach">🥬</span>
                <span title="Golden Corn">🌽</span>
                <span title="Fresh Potatoes">🥔</span>
              </div>
              <div className="absolute -bottom-3 left-3 w-6 h-6 rounded-full bg-stone-900 border-2 border-stone-600 flex items-center justify-center animate-wheel-spin">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <div className="absolute -bottom-3 right-3 w-6 h-6 rounded-full bg-stone-900 border-2 border-stone-600 flex items-center justify-center animate-wheel-spin">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LAYER 3: AUTHENTIC INDIAN FARMERS & VILLAGE WORKERS IN FIELD */}
      {/* ========================================================================= */}
      <div className="absolute bottom-20 left-10 sm:left-28 z-20 flex items-end gap-6 select-none opacity-95 pointer-events-none">
        {/* Farmer with Sickle & Cotton Dhoti */}
        <div className="flex flex-col items-center animate-[tractorBob_2.5s_ease-in-out_infinite]" title="Indian farmer inspecting harvest">
          <span className="text-2xl">👨‍🌾</span>
          <div className="flex gap-1 text-[11px] -mt-1 font-bold text-amber-200 bg-stone-900/60 px-1.5 py-0.5 rounded-full border border-amber-500/30">
            <span>🌾</span>
            <span>Hari Ram (Grower)</span>
          </div>
        </div>

        {/* Rural Woman Sorting Produce into Wicker Basket */}
        <div className="flex flex-col items-center animate-[pulse_3s_ease-in-out_infinite] hidden sm:flex" title="Sorting fresh harvest">
          <span className="text-2xl">👩‍🌾</span>
          <div className="flex items-center gap-1 text-[11px] -mt-1 font-bold text-emerald-200 bg-stone-900/60 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
            <span>🧺</span>
            <span>Field Sorting</span>
          </div>
        </div>
      </div>

      {/* Foreground Delicate Butterflies near Marigold Flowers */}
      <div className="absolute bottom-24 right-16 sm:right-32 z-20 flex gap-4 select-none pointer-events-none">
        <span className="text-lg animate-[bounce_2s_infinite]">🦋</span>
        <span className="text-base animate-[bounce_3s_infinite_1s] translate-y-2">🦋</span>
      </div>

      {/* ========================================================================= */}
      {/* 4. READABLE FROSTED HERO CONTENT PANEL OVERLAY (CENTRALIZED & ACCESSIBLE) */}
      {/* ========================================================================= */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center w-full my-auto">
        <div className="bg-stone-950/75 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl space-y-6">
          {/* Small Top Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>FROM LOCAL FARMS WITH LOVE · DIRECT FARMER-TO-CUSTOMER</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Fresh From Local Farms<br />
            <span className="text-emerald-400">to Your Doorstep</span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 leading-relaxed drop-shadow-xs">
            Discover 95+ fresh farm harvests directly from verified Indian cultivators. Zero middlemen markups, 100% fair grower earnings, and nutritious chemical-free food delivered within 24 hours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              to="/marketplace"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Explore Fresh Produce</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/register?role=farmer"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs border border-white/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Join as a Farmer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Animated Indicator */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-300/90 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Fresh harvest. Fair prices. Direct rural empowerment.</span>
          </div>

          {/* Integrated Agricultural Produce Search Bar */}
          <div className="pt-4 max-w-3xl mx-auto w-full">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl border border-stone-200 text-stone-800 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-2 px-3 py-2 w-full border-b sm:border-b-0 sm:border-r border-stone-200">
                <Search className="w-4 h-4 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search apples, basmati, moong dal, palak, gajar..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full text-sm bg-transparent outline-none placeholder:text-stone-400 text-stone-800"
                />
              </div>

              <div className="w-full sm:w-40 px-3 py-2 border-b sm:border-b-0 sm:border-r border-stone-200">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full text-sm bg-transparent outline-none text-stone-700 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="Vegetables">Vegetables (28+)</option>
                  <option value="Fruits">Fruits (35+)</option>
                  <option value="Grains">Grains (14+)</option>
                  <option value="Pulses">Pulses (16+)</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Organic Produce">Organic Produce</option>
                </select>
              </div>

              <div className="w-full sm:w-36 px-3 py-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full text-sm bg-transparent outline-none text-stone-700 cursor-pointer"
                >
                  <option value="">Any Region</option>
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Ludhiana">Punjab</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                Find Harvest
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE AMBIENT VILLAGE CONTROLS (TIME-OF-DAY + TRACTOR TURBO + HORN) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-6 right-4 sm:right-8 z-30 pointer-events-auto flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-stone-200 shadow-2xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTimeOfDay('dawn')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              timeOfDay === 'dawn' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
            title="Sunrise Dawn Mode"
          >
            <Sun className="w-3 h-3" />
            <span className="hidden sm:inline">Dawn</span>
          </button>
          <button
            onClick={() => setTimeOfDay('noon')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              timeOfDay === 'noon' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
            title="Midday Sunshine"
          >
            <Compass className="w-3 h-3" />
            <span className="hidden sm:inline">Noon</span>
          </button>
          <button
            onClick={() => setTimeOfDay('dusk')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              timeOfDay === 'dusk' ? 'bg-purple-700 text-white' : 'text-stone-400 hover:text-white'
            }`}
            title="Twilight Evening Mode"
          >
            <Sunset className="w-3 h-3" />
            <span className="hidden sm:inline">Dusk</span>
          </button>
        </div>

        <div className="h-4 w-px bg-white/20" />

        <button
          onClick={triggerHonk}
          className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-medium transition-colors cursor-pointer flex items-center gap-1"
          title="Honk tractor horn"
        >
          <span>📢</span>
          <span className="hidden sm:inline">Honk</span>
        </button>

        <button
          onClick={() => setSpeed(s => (s === 'normal' ? 'fast' : 'normal'))}
          className="text-[11px] px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium transition-colors cursor-pointer"
          title="Toggle tractor travel speed"
        >
          🚜 {speed === 'fast' ? 'Turbo' : 'Pacing'}
        </button>
      </div>
    </section>
  );
};
