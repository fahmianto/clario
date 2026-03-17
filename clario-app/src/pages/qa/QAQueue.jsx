import React, { useEffect, useState } from 'react';
import { Shield, Eye, AlertCircle, FileText, Check, X, Loader2, Bot } from 'lucide-react';
import { getArticlesForQA, simulateAiScreening } from '../../services/articleService';

const QAQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await getArticlesForQA();
      setQueue(data);
    } catch (error) {
      console.error("Error fetching QA queue:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleSimulateAI = async (id) => {
    try {
      await simulateAiScreening(id);
      fetchQueue();
      alert("AI Screening simulated successfully!");
    } catch (error) {
       console.error("AI simulation error:", error);
    }
  };

  const flaggedCount = queue.filter(item => (item.aiScore || 100) < 70).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Antrean QA</h1>
          <p className="text-slate-500 text-sm mt-1">Naskah yang telah selesai direview dan menunggu validasi.</p>
        </div>
        
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
             {queue.length} Menunggu
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800">
             {flaggedCount} Flagged
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Naskah & Reviewer</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Skor Reviewer</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Kesesuaian AI</th>
                <th scope="col" className="px-6 py-4 font-medium">Status Antrean</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Aksi QA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-2" />
                    <p className="text-slate-400 italic">Fetching real queue...</p>
                  </td>
                </tr>
              ) : queue.map((item) => {
                const isFlagged = (item.aiScore || 100) < 70;
                return (
                  <tr key={item.id} className={`transition-colors ${isFlagged ? 'bg-rose-50/30' : 'hover:bg-slate-50'}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 line-clamp-1 mb-1" title={item.title}>{item.title}</div>
                      <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                        <span>Ref: <span className="font-mono">#{item.id.slice(-6).toUpperCase()}</span></span>
                        <span>Oleh: {item.reviewerName || 'Expert Reviewer'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        (item.reviewScore || 80) >= 80 ? 'bg-emerald-100 text-emerald-700' :
                        (item.reviewScore || 60) >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.reviewScore || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                         <div className="w-full bg-slate-100 rounded-full h-2 mb-1 max-w-[4rem]">
                           <div className={`h-2 rounded-full ${item.aiScore > 85 ? 'bg-emerald-500' : item.aiScore > 70 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{width: `${item.aiScore || 0}%`}}></div>
                         </div>
                         <span className="text-xs font-medium text-slate-500">{item.aiScore || 0}% Cocok</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isFlagged ? (
                        <div className="flex items-center text-rose-600 text-xs font-medium">
                          <AlertCircle size={14} className="mr-1.5" /> Ada Indikasi Anomali
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600 text-xs font-medium">
                          <Shield size={14} className="mr-1.5" /> Butuh Validasi
                        </div>
                      )}
                      <div className="text-xs text-slate-400 mt-1">Selesai {item.timeElapsed || 'Baru Saja'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => handleSimulateAI(item.id)}
                           className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200" 
                           title="Simulate AI Screening"
                         >
                           <Bot size={18} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors" title="Lihat Detail Naskah & Tinjauan">
                           <Eye size={18} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200" title="Setujui Hasil Review">
                           <Check size={18} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200" title="Tolak / Kembalikan ke Reviewer">
                           <X size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && queue.length === 0 && (
             <div className="p-12 text-center flex flex-col items-center justify-center">
               <Shield size={48} className="text-slate-200 mb-4" strokeWidth={1} />
               <h3 className="text-lg font-medium text-slate-800">Antrean Kosong</h3>
               <p className="text-slate-500 max-w-sm mt-1">Tidak ada naskah yang menunggu validasi QA saat ini. Pekerjaan yang bagus!</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QAQueue;
