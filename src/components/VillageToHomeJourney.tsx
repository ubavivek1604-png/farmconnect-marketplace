import React, { useState } from 'react';
import { Sprout, Sun, Package, Truck, Home, CheckCircle2 } from 'lucide-react';

export const VillageToHomeJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2); // default mid-journey

  const stages = [
    {
      id: 0,
      name: 'Farm Soil',
      subtitle: 'Living Earth',
      icon: <Sprout className="w-5 h-5" />,
      desc: 'Sown in chemical-free soil using heirloom indigenous seeds.'
    },
    {
      id: 1,
      name: 'Dawn Harvest',
      subtitle: 'Peak Nutrition',
      icon: <Sun className="w-5 h-5" />,
      desc: 'Hand-picked by village farming families at early morning light.'
    },
    {
      id: 2,
      name: 'Farm-Gate Packing',
      subtitle: 'Zero Gas Chambers',
      icon: <Package className="w-5 h-5" />,
      desc: 'Weighed and packed into natural crates right at the farm gate.'
    },
    {
      id: 3,
      name: 'Direct Transit',
      subtitle: 'Bypassing Middlemen',
      icon: <Truck className="w-5 h-5" />,
      desc: 'Country vehicle travels directly to city hubs without auction delays.'
    },
    {
      id: 4,
      name: 'Your Dining Table',
      subtitle: 'Within 24 Hours',
      icon: <Home className="w-5 h-5" />,
      desc: 'Delivered fresh and crisp to your doorstep with 100% grower traceability.'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider border border-emerald-200">
            <span>24-Hour Farm-to-Fork Loop</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif tracking-tight">
            The Village-to-Home Journey
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Watch how wholesome farm harvests travel straight from rural furrows to your kitchen counter without warehouse delays.
          </p>
        </div>

        {/* Horizontal Illustrated Timeline & Animated Cart */}
        <div className="relative py-8">
          {/* Connecting Track Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1.5 bg-stone-200 rounded-full z-0 hidden md:block">
            {/* Progress fill */}
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-700"
              style={{ width: `${(activeStep / (stages.length - 1)) * 100}%` }}
            />
          </div>

          {/* Animated Produce Delivery Cart Marker */}
          <div
            className="hidden md:flex absolute top-1/2 -translate-y-10 z-20 items-center justify-center transition-all duration-700 pointer-events-none"
            style={{
              left: `calc(${(activeStep / (stages.length - 1)) * 100}% - 24px)`
            }}
          >
            <div className="w-12 h-12 rounded-full bg-amber-400 text-stone-950 font-bold flex items-center justify-center shadow-lg border-2 border-white animate-bounce text-lg">
              🚜
            </div>
          </div>

          {/* 5 Stages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {stages.map((stage) => {
              const isActive = activeStep === stage.id;
              const isPast = activeStep >= stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStep(stage.id)}
                  className={`p-5 rounded-2xl border text-center cursor-pointer transition-all duration-300 flex flex-col justify-between items-center gap-3 ${
                    isActive
                      ? 'bg-emerald-900 text-white border-emerald-700 shadow-xl scale-105'
                      : isPast
                      ? 'bg-emerald-50 text-stone-900 border-emerald-200 hover:border-emerald-400'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {/* Step Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-xs ${
                      isActive
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {stage.icon}
                  </div>

                  <div>
                    <h4 className={`font-bold text-sm leading-snug ${isActive ? 'text-white' : 'text-stone-900'}`}>
                      {stage.name}
                    </h4>
                    <span className={`text-[11px] font-medium block mt-0.5 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`}>
                      {stage.subtitle}
                    </span>
                    <p className={`text-xs mt-2 leading-relaxed ${isActive ? 'text-stone-200' : 'text-stone-500'}`}>
                      {stage.desc}
                    </p>
                  </div>

                  <div className="pt-2 text-[11px] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : isPast ? 'text-emerald-600' : 'text-stone-300'}`} />
                    <span className={isActive ? 'text-amber-300' : isPast ? 'text-emerald-700' : 'text-stone-400'}>
                      Step 0{stage.id + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
