import React, { useEffect, useState } from 'react';
import { Flame, TrendingUp, Info, Loader2 } from 'lucide-react';
import { getAllArticles } from '../../services/articleService';

const MarketHotspots = () => {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotspots = async () => {
    try {
      setLoading(true);
      const articles = await getAllArticles();
      
      // Calculate volumes by field
      const fieldMap = {};
      articles.forEach(art => {
        const field = art.researchField || 'General';
        fieldMap[field] = (fieldMap[field] || 0) + 1;
      });

      // Convert to array and calculate "intensity" (percentage of total)
      const total = articles.length || 1;
      const data = Object.entries(fieldMap)
        .map(([field, count]) => ({
          field,
          volume: count,
          intensity: (count / total) * 100,
          trend: '+5%' // Placeholder for trend logic
        }))
        .sort((a, b) => b.volume - a.volume);

      setHotspots(data);
    } catch (error) {
      console.error("Error fetching hotspots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspots();
  }, []);

  const getIntensityColor = (intensity) => {
    if (intensity > 30) return 'bg-rose-500 text-white';
    if (intensity > 20) return 'bg-orange-500 text-white';
    if (intensity > 10) return 'bg-amber-400 text-amber-900';
    if (intensity > 5) return 'bg-slate-200 text-slate-700';
    return 'bg-slate-100 text-slate-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-slate-100 flex flex-col h-[500px]">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
            <Flame size={18} />
          </div>
          <h2 className="font-bold text-slate-800">Market Hotspots (Heatmap)</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Info size={14} />
          <span>Berdasarkan total penyerahan naskah platform</span>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            Memetakan data...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {hotspots.map((spot, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-default flex flex-col justify-between h-32 ${getIntensityColor(spot.intensity)}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 truncate pr-2">{spot.field}</span>
                  <div className={`p-1 rounded-md bg-white/20 backdrop-blur-sm`}>
                      <TrendingUp size={12} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black">{spot.volume}</div>
                  <div className="text-[10px] font-medium opacity-90 mt-1">
                    Naskah Terdaftar
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-50 bg-slate-50/50 rounded-b-xl flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
            <span>Dominan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
            <span>Tinggi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-400"></div>
            <span>Sedang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-slate-200"></div>
            <span>Rendah</span>
          </div>
        </div>
        <button className="text-primary-600 font-semibold hover:underline">Lihat Detail Analitik</button>
      </div>
    </div>
  );
};

export default MarketHotspots;
