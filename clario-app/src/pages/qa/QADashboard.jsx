import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, FileText, AlertTriangle, TrendingUp, CheckCircle, Search, ArrowRight, Loader2 } from 'lucide-react';
import { getArticlesForQA } from '../../services/articleService';

const QADashboard = () => {
  const [qaQueue, setQaQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueueSize = async () => {
      try {
        const data = await getArticlesForQA();
        setQaQueue(data);
      } catch (error) {
        console.error("Error fetching QA queue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueueSize();
  }, []);

  const stats = {
    queueSize: qaQueue.length,
    approvedToday: 0, // Placeholder
    flagged: qaQueue.filter(a => (a.aiScore || 100) < 70).length,
    avgTime: '1.2h'
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">QA Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau kualitas evaluasi naskah dan kinerja sistem review.</p>
        </div>
        <Link to="/qa/queue" className="btn-primary flex items-center gap-2">
          <ShieldCheck size={18} />
          Buka Antrean QA ({stats.queueSize})
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-soft border border-slate-100 flex items-start justify-between group hover:border-primary-200 transition-colors">
          <div>
             <p className="text-slate-500 text-sm font-medium mb-1">Antrean Saat Ini</p>
             <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
               {loading ? <Loader2 className="w-6 h-6 animate-spin inline" /> : stats.queueSize}
             </h3>
             <p className="text-xs text-rose-500 mt-2 font-medium flex items-center gap-1">
               <AlertTriangle size={12} /> {stats.flagged} Flagged
             </p>
          </div>
          <div className="bg-amber-100 p-3 rounded-lg text-amber-600 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-soft border border-slate-100 flex items-start justify-between group hover:border-primary-200 transition-colors">
          <div>
             <p className="text-slate-500 text-sm font-medium mb-1">Disetujui Hari Ini</p>
             <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stats.approvedToday}</h3>
             <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
               <TrendingUp size={12} /> All Good
             </p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-soft border border-slate-100 flex items-start justify-between group hover:border-primary-200 transition-colors">
          <div>
             <p className="text-slate-500 text-sm font-medium mb-1">Review Dikembalikan</p>
             <h3 className="text-3xl font-bold text-slate-800 tracking-tight">0</h3>
             <p className="text-xs text-slate-400 mt-2 font-medium">Bulan ini</p>
          </div>
          <div className="bg-rose-100 p-3 rounded-lg text-rose-600 group-hover:scale-110 transition-transform">
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-soft border border-slate-100 flex items-start justify-between group hover:border-primary-200 transition-colors">
          <div>
             <p className="text-slate-500 text-sm font-medium mb-1">Rata-rata Waktu QA</p>
             <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stats.avgTime}</h3>
             <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1">
               <TrendingUp size={12} /> Target 2h
             </p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg text-primary-600 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
             <h2 className="font-bold text-slate-800 text-lg">Aktivitas Terkini</h2>
             <button className="text-primary-600 text-sm font-medium hover:text-primary-800 inline-flex items-center gap-1">
               Lihat Semua <ArrowRight size={16} />
             </button>
          </div>
          <div className="divide-y divide-slate-100">
             {[1, 2, 3].map((task) => (
                <div key={task} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                  <div className="mt-1 bg-emerald-100 text-emerald-600 p-2 rounded-full hidden sm:block">
                    <CheckCircle size={16} />
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium mb-0.5">Naskah PUB-2026-04{task} Lolos QA</p>
                    <p className="text-sm text-slate-500 line-clamp-1 mb-2">Penilaian 88/100 disetujui tanpa catatan tambahan untuk Reviewer A.</p>
                    <p className="text-xs text-slate-400 font-mono">1{task} mnt yang lalu oleh Anda</p>
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* Action Needed */}
         <div className="bg-white rounded-xl shadow-soft border border-slate-100 flex flex-col">
          <div className="p-5 border-b border-slate-100">
             <h2 className="font-bold text-slate-800 text-lg">Perlu Tindakan</h2>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center items-center text-center space-y-4">
             <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-2">
                <AlertTriangle size={32} />
             </div>
             <div>
                <h3 className="font-bold text-slate-800">Diskrepansi Tinggi</h3>
                <p className="text-sm text-slate-500 mt-1">Reviewer A (90) dan Reviewer B (45) memiliki rentang nilai terlalu jauh pada naskah PUB-2026-088.</p>
             </div>
             <button className="w-full btn-secondary mt-2">Investigasi Sekarang</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QADashboard;
