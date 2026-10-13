import React, { useState } from 'react';
import { Tractor, Sprout, Sun, Wind, HeartHandshake, Sparkles, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';

export const VillageVibesSection: React.FC = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Gentle synthesized peaceful village sound using Web Audio API (no external file needed)
  const toggleVillageSound = () => {
    if (!isPlayingAudio) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          // Gentle breeze noise
          const bufferSize = ctx.sampleRate * 2;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 400;

          const gain = ctx.createGain();
          gain.gain.value = 0.04;

          whiteNoise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          whiteNoise.start();

          (window as any).__villageAudio = { ctx, whiteNoise };
          setIsPlayingAudio(true);
        }
      } catch (e) {
        console.warn('Audio not allowed:', e);
      }
    } else {
      if ((window as any).__villageAudio) {
        (window as any).__villageAudio.ctx.close();
        (window as any).__villageAudio = null;
      }
      setIsPlayingAudio(false);
    }
  };

  const villageSteps = [
    {
      time: '04:30 AM',
      title: 'Dawn Field Inspection & Prayers',
      desc: 'Farmers walk dew-covered paddy bunds, inspecting crop health and watering natural soil beds before first light.',
      icon: '🌅',
      details: 'Organic fields wake up under cool morning mist with traditional well irrigation.'
    },
    {
      time: '06:00 AM',
      title: 'Tractor Tillage & Soil Nourishment',
      desc: 'Tractors hum across fertile acreage, distributing chemical-free vermicompost and Jeevamrutha cow manure.',
      icon: '🚜',
      details: 'Zero chemical pesticides: restoring earthworms and natural soil microbiology.'
    },
    {
      time: '08:00 AM',
      title: 'Hand-Harvesting at Peak Ripeness',
      desc: 'Village farming families hand-pick vine tomatoes, tender spinach, and fresh grains only after customer confirmation.',
      icon: '🧺',
      details: 'Crops never sit for weeks in industrial gas-ripening cold storage chambers.'
    },
    {
      time: '11:00 AM',
      title: 'Crate Packing & Direct Dispatch',
      desc: 'Harvest is sorted by grade, weighed transparently, loaded into country transport, and dispatched directly to your home.',
      icon: '📦',
      details: 'Farmers keep 100% of the produce value with zero middleman commission deductions.'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-12 text-white border border-emerald-800/40 shadow-2xl space-y-8">
      {/* Background rural pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-emerald-800/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gramin Jeevan · The Living Village Vibe</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            From Rural Fields to Your Dining Table
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-2xl leading-relaxed">
            Experience the heartbeat of Indian farming. Hardworking cultivators, buzzing tractors, and unhurried village wisdom cultivating honest food.
          </p>
        </div>

        {/* Ambient Village Soundscape Button */}
        <button
          onClick={toggleVillageSound}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md self-start md:self-auto ${
            isPlayingAudio
              ? 'bg-emerald-600 text-white animate-pulse'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
          }`}
        >
          {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{isPlayingAudio ? 'Village Breeze Playing 🍃' : 'Play Village Breeze Ambience'}</span>
        </button>
      </div>

      {/* Interactive 4-Stage Village Day Timeline */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
        {villageSteps.map((step, idx) => (
          <div
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              activeStep === idx
                ? 'bg-emerald-900/60 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg scale-102'
                : 'bg-stone-900/60 border-emerald-900/60 hover:bg-stone-800/80 hover:border-emerald-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-amber-400">{step.time}</span>
                <span className="text-2xl">{step.icon}</span>
              </div>
              <h3 className="font-bold text-white text-sm leading-snug">{step.title}</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">{step.desc}</p>
            </div>

            <div className="pt-3 border-t border-emerald-900/60 text-[11px] text-emerald-300 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{step.details}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Village Visual Highlights Ribbon */}
      <div className="relative z-10 bg-emerald-900/40 rounded-2xl p-5 border border-emerald-800/60 flex flex-wrap items-center justify-around gap-4 text-xs text-stone-200">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚜</span>
          <div>
            <p className="font-bold text-white">Daily Field Tillage</p>
            <p className="text-[11px] text-stone-400">Natural organic composting</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">🐄</span>
          <div>
            <p className="font-bold text-white">Indigenous Desi Breeds</p>
            <p className="text-[11px] text-stone-400">Pure Gir & Sahiwal A2 milk</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <div>
            <p className="font-bold text-white">Heritage Heirloom Grains</p>
            <p className="text-[11px] text-stone-400">1121 Basmati & Sharbati wheat</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">🤝</span>
          <div>
            <p className="font-bold text-white">Direct Farmer Prosperity</p>
            <p className="text-[11px] text-stone-400">Zero middleman exploitation</p>
          </div>
        </div>
      </div>
    </section>
  );
};
