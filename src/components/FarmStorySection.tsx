import React from 'react';
import { Sprout, Sun, Tractor, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmStorySection: React.FC = () => {
  const stories = [
    {
      step: '01',
      title: 'Cultivated in Living Soil',
      subtitle: 'Natural Composting & Heirloom Seeds',
      description: 'Generations of indigenous farming knowledge. Zero synthetic agrochemicals — our growers feed the soil with Jeevamrutha, cow dung compost, and neem bio-extracts.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
      icon: <Sprout className="w-5 h-5 text-emerald-400" />,
      farmerNote: '“We feed the soil, and the soil feeds our nation.” — Ramesh Patil, Pune'
    },
    {
      step: '02',
      title: 'Dawn Hand-Harvesting',
      subtitle: 'Picked at Peak Morning Nutrition',
      description: 'Village families step into mist-draped fields at 5:00 AM, harvesting only what was ordered by consumers overnight to eliminate warehouse decay.',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      farmerNote: '“Picked while dew drops still cling to the leaves.” — Sunita Gaikwad, Nashik'
    },
    {
      step: '03',
      title: 'Field-to-Gate Tractor Transport',
      subtitle: 'Country Trails Direct from Furrows',
      description: 'Loaded directly onto local farm trolleys from the harvest beds, bypassing predatory auction APMC mandis and broker commission cuts.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      icon: <Tractor className="w-5 h-5 text-emerald-400" />,
      farmerNote: '“Every rupee paid goes straight into the farmer’s savings.” — Harpreet Singh, Ludhiana'
    },
    {
      step: '04',
      title: 'Packed in Natural Crates',
      subtitle: 'Zero Chemical Waxing or Gas Ripening',
      description: 'Sorted carefully into reusable wooden crates and dispatched in eco-friendly wraps directly to urban household kitchens within 24 to 48 hours.',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
      icon: <Package className="w-5 h-5 text-amber-400" />,
      farmerNote: '“Honest food for your family, fair dignity for ours.” — Anand Devadiga, Bengaluru'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-stone-50 via-emerald-50/40 to-stone-50 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>Farm Traditions & Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-serif">
            Every Harvest Has a Story
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            From the fertile black soil of Maharashtra to the golden wheat plains of Punjab, discover the quiet dedication behind every meal on your table.
          </p>
        </div>

        {/* 4 Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map(item => (
            <div
              key={item.step}
              className="group relative bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Photo Header with subtle zoom */}
              <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

                {/* Step badge */}
                <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur text-stone-900 font-bold text-xs flex items-center justify-center shadow-md">
                  {item.step}
                </div>

                {/* Title over photo bottom */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <span className="text-xs text-amber-300 font-medium">{item.subtitle}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs italic text-stone-700">
                  {item.farmerNote}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-900/50">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-bold text-white">Ready to taste produce direct from the soil?</h4>
            <p className="text-xs text-stone-300">Browse hundreds of fresh harvests straight from verified local village growers.</p>
          </div>
          <Link
            to="/marketplace"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shrink-0 transition-colors flex items-center gap-2 shadow-md"
          >
            <span>Browse Full Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
