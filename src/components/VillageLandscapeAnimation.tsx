import React, { useState } from 'react';
import { Sun, Sunset, Compass } from 'lucide-react';

interface VillageLandscapeAnimationProps {
  asBackground?: boolean;
}

export const VillageLandscapeAnimation: React.FC<VillageLandscapeAnimationProps> = ({ asBackground = false }) => {
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'noon' | 'dusk'>('dawn');
  const [tractorHonked, setTractorHonked] = useState(false);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');

  const triggerHonk = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTractorHonked(true);
    setTimeout(() => setTractorHonked(false), 3000);
  };

  // Color theme per time of day
  const skyGradients = {
    dawn: 'from-amber-600 via-orange-500/80 to-emerald-950',
    noon: 'from-sky-500 via-emerald-600/60 to-emerald-950',
    dusk: 'from-purple-900 via-rose-700/80 to-stone-950'
  };

  return (
    <div
      className={
        asBackground
          ? 'absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none'
          : 'relative w-full overflow-hidden rounded-3xl border border-emerald-900/40 shadow-2xl bg-stone-900 my-8'
      }
    >
      {/* Sky Canvas */}
      <div
        className={
          asBackground
            ? `absolute inset-0 w-full h-full bg-gradient-to-b ${skyGradients[timeOfDay]} transition-colors duration-1000 overflow-hidden`
            : `relative h-72 sm:h-96 w-full bg-gradient-to-b ${skyGradients[timeOfDay]} transition-colors duration-1000 overflow-hidden`
        }
      >
        {/* Darkening overlay when used as background so text in front is ultra-crisp */}
        {asBackground && (
          <div className="absolute inset-0 bg-stone-950/60 z-5 pointer-events-none" />
        )}

        {/* Morning Sun or Twilight Moon */}
        <div className="absolute top-6 right-12 sm:right-28">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28">
            <div className="absolute inset-0 rounded-full bg-amber-300/40 blur-xl animate-sun-rays" />
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-yellow-100 shadow-[0_0_50px_rgba(251,191,36,0.6)] flex items-center justify-center">
              <span className="text-3xl opacity-80">{timeOfDay === 'dusk' ? '🌙' : '☀️'}</span>
            </div>
          </div>
        </div>

        {/* Drifting Morning Clouds */}
        <div className="absolute top-8 left-10 text-white/30 text-4xl select-none animate-[pulse_6s_ease-in-out_infinite]">
          ☁️
        </div>
        <div className="absolute top-14 left-1/3 text-white/25 text-5xl select-none animate-[pulse_8s_ease-in-out_infinite_1s]">
          ☁️
        </div>
        <div className="absolute top-4 right-1/3 text-white/30 text-3xl select-none animate-[pulse_7s_ease-in-out_infinite_2s]">
          ☁️
        </div>

        {/* Birds in flight */}
        <div className="absolute top-12 left-1/4 flex gap-3 text-stone-200/50 text-xs font-bold select-none tracking-widest animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]">
          <span>~v~</span>
          <span className="translate-y-2">~v~</span>
          <span className="-translate-y-1">~v~</span>
        </div>

        {/* Distant Misty Mountain Ridges */}
        <svg
          className="absolute bottom-24 sm:bottom-28 w-full h-32 text-emerald-950/80 preserve-3d"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0,180 Q180,40 380,160 T800,90 Q980,140 1200,100 L1200,300 L0,300 Z"
            fill="currentColor"
          />
        </svg>

        {/* Midground Hills & Trees */}
        <svg
          className="absolute bottom-16 sm:bottom-20 w-full h-36 text-emerald-900/90"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          <path
            d="M0,220 Q240,110 500,200 T1000,140 Q1120,180 1200,170 L1200,300 L0,300 Z"
            fill="currentColor"
          />
        </svg>

        {/* Rural Village Houses & Windmill */}
        <div className="absolute bottom-20 sm:bottom-24 left-8 sm:left-24 flex items-end gap-3 z-10 opacity-90">
          {/* Thatched Hut */}
          <div className="relative group cursor-pointer pointer-events-auto" title="Village Farmer Homestead">
            <div className="w-14 sm:w-16 h-10 sm:h-12 bg-amber-800 rounded-xs relative border-t-4 border-amber-950 shadow-md">
              {/* Roof */}
              <div className="absolute -top-6 -left-2 w-18 sm:w-20 h-7 sm:h-8 bg-amber-600 rounded-t-lg border-b border-amber-900 shadow-xs flex items-center justify-center text-[10px] text-amber-200 font-bold">
                🌾
              </div>
              {/* Door */}
              <div className="w-3.5 h-6 bg-amber-950 rounded-t-xs absolute bottom-0 left-5" />
              {/* Window */}
              <div className="w-2.5 h-2.5 bg-amber-200 rounded-xs absolute top-2 right-2 border border-amber-950" />
            </div>
            {/* Chulha Smoke */}
            <div className="absolute -top-9 right-2 text-stone-300 text-xs animate-[bounce_3s_infinite]">
              💨
            </div>
          </div>

          {/* Windmill */}
          <div className="relative ml-6 sm:ml-8 mb-2">
            <div className="w-2.5 sm:w-3 h-20 sm:h-24 bg-stone-300 rounded-t-xs mx-auto border-x border-stone-400" />
            <div className="absolute -top-3 -left-7 w-16 h-16 animate-windmill">
              <svg viewBox="0 0 100 100" className="w-full h-full text-stone-100 drop-shadow">
                <line x1="50" y1="50" x2="50" y2="5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <line x1="50" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <line x1="50" y1="50" x2="50" y2="95" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <line x1="50" y1="50" x2="5" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <circle cx="50" cy="50" r="5" fill="#e11d48" />
              </svg>
            </div>
          </div>

          {/* Grazing Desi Gir Cow */}
          <div className="ml-4 sm:ml-6 flex items-end text-lg sm:text-xl animate-[pulse_4s_infinite]" title="Desi Gir Cow (A2 Dairy)">
            🐄
          </div>

          {/* Hardworking Farmer Walking with Harvest Basket */}
          <div className="ml-4 sm:ml-6 flex flex-col items-center animate-[bounce_1.4s_infinite]" title="Farmer carrying daily harvest">
            <span className="text-[10px] sm:text-xs -mb-1">🧺</span>
            <span className="text-lg sm:text-xl">👨‍🌾</span>
          </div>
        </div>

        {/* Foreground Lush Green & Golden Crops Terrace */}
        <div className="absolute bottom-8 sm:bottom-10 inset-x-0 h-14 sm:h-16 bg-gradient-to-r from-emerald-800 via-emerald-700 to-lime-800 z-10 shadow-lg border-t border-emerald-500/30 flex items-center justify-around overflow-hidden px-4 opacity-95">
          {[...Array(24)].map((_, i) => (
            <span
              key={i}
              className={`text-sm sm:text-base select-none animate-grass-sway ${
                i % 2 === 0 ? 'text-amber-300' : 'text-emerald-300'
              }`}
              style={{ animationDelay: `${(i % 5) * 0.3}s` }}
            >
              {i % 3 === 0 ? '🌾' : i % 3 === 1 ? '🌱' : '🌽'}
            </span>
          ))}
        </div>

        {/* Country Dirt Road */}
        <div className="absolute bottom-0 inset-x-0 h-8 sm:h-10 bg-amber-950 border-t-2 border-dashed border-amber-800 z-20 overflow-hidden flex items-center">
          {/* Moving Tractor & Harvest Wagon */}
          <div
            onClick={triggerHonk}
            className={`cursor-pointer absolute flex items-center z-30 select-none pointer-events-auto ${
              speed === 'fast' ? 'animate-[tractorChug_14s_linear_infinite]' : 'animate-tractor-chug'
            }`}
          >
            {/* Interactive Honk Bubble */}
            {tractorHonked && (
              <div className="absolute -top-12 left-1/3 bg-amber-400 text-stone-950 font-bold px-3 py-1 rounded-full text-xs shadow-lg whitespace-nowrap animate-bounce z-40 border border-amber-500">
                📢 POM POM! Fresh Farm Harvest Coming! 🍅🌾
              </div>
            )}

            {/* Tractor Container */}
            <div className="flex items-end gap-1 animate-tractor-bob">
              {/* Exhaust Smoke Puffs */}
              <div className="relative w-4 h-8 mr-1">
                <span className="absolute bottom-2 left-0 text-stone-300 text-xs animate-smoke-1">💨</span>
                <span className="absolute bottom-4 left-1 text-stone-300 text-xs animate-smoke-2">💨</span>
                <span className="absolute bottom-6 left-2 text-stone-300 text-xs animate-smoke-3">💨</span>
              </div>

              {/* Main Tractor Body */}
              <div className="relative">
                {/* Farmer Driving */}
                <div className="absolute -top-5 sm:-top-6 left-5 text-base sm:text-lg">
                  👨‍🌾
                </div>

                {/* Tractor SVG Engine & Wheels */}
                <svg width="68" height="38" viewBox="0 0 68 38" className="drop-shadow-md">
                  {/* Cabin & Hood */}
                  <rect x="18" y="8" width="22" height="18" rx="2" fill="#047857" />
                  <rect x="36" y="14" width="26" height="12" rx="3" fill="#059669" />
                  {/* Grill */}
                  <rect x="58" y="16" width="4" height="8" rx="1" fill="#facc15" />
                  {/* Silencer */}
                  <rect x="42" y="4" width="3" height="10" fill="#374151" />
                  {/* Seat */}
                  <rect x="16" y="14" width="6" height="8" rx="1" fill="#1f2937" />
                  {/* Steering wheel */}
                  <line x1="28" y1="16" x2="34" y2="12" stroke="#111827" strokeWidth="2" />
                  <circle cx="34" cy="11" r="3" stroke="#111827" strokeWidth="1.5" fill="none" />
                  {/* Big Rear Wheel */}
                  <circle cx="16" cy="26" r="11" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
                  <circle cx="16" cy="26" r="5" fill="#facc15" />
                  {/* Small Front Wheel */}
                  <circle cx="52" cy="29" r="8" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
                  <circle cx="52" cy="29" r="3.5" fill="#facc15" />
                </svg>
              </div>

              {/* Hitch Link */}
              <div className="w-2 h-1.5 bg-stone-700 self-center" />

              {/* Cargo Trailer loaded with Produce */}
              <div className="relative bg-amber-800 border border-amber-900 rounded-xs w-18 sm:w-20 h-6 sm:h-7 flex items-center justify-around px-1 shadow-inner">
                {/* Produce Crate Contents */}
                <div className="absolute -top-4 inset-x-0 flex items-center justify-around text-xs">
                  <span>🍅</span>
                  <span>🥔</span>
                  <span>🌽</span>
                  <span>🥦</span>
                </div>
                {/* Trailer Wheels */}
                <div className="absolute -bottom-2.5 left-2 w-5 h-5 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center animate-wheel-spin">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <div className="absolute -bottom-2.5 right-2 w-5 h-5 rounded-full bg-stone-800 border-2 border-stone-600 flex items-center justify-center animate-wheel-spin">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Ambient Controls in Corner */}
      <div
        className={
          asBackground
            ? 'absolute bottom-12 right-4 sm:right-6 z-30 pointer-events-auto flex items-center gap-1.5 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-700 text-[11px] text-stone-300 shadow-md'
            : 'bg-stone-900/95 backdrop-blur-xs px-5 py-3 border-t border-emerald-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-300'
        }
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTimeOfDay('dawn')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-colors ${
              timeOfDay === 'dawn' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
            title="Sunrise Mode"
          >
            <Sun className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Dawn</span>
          </button>
          <button
            onClick={() => setTimeOfDay('noon')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-colors ${
              timeOfDay === 'noon' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
            title="Midday Sunshine"
          >
            <Compass className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Noon</span>
          </button>
          <button
            onClick={() => setTimeOfDay('dusk')}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-colors ${
              timeOfDay === 'dusk' ? 'bg-purple-700 text-white' : 'text-stone-400 hover:text-white'
            }`}
            title="Twilight Mode"
          >
            <Sunset className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Dusk</span>
          </button>
        </div>

        <button
          onClick={() => setSpeed(s => (s === 'normal' ? 'fast' : 'normal'))}
          className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700"
          title="Tractor speed"
        >
          🚜 {speed === 'fast' ? 'Turbo' : 'Pacing'}
        </button>
      </div>
    </div>
  );
};
