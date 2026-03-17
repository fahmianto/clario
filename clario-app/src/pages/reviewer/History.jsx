import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, FileX, Calendar, Search, ArrowUpRight } from 'lucide-react';

const ReviewHistory = () => {
  // Mock data for review history
  const historyData = [
    {
      id: 'REV-089',
      title: 'Strategi Mitigasi Risiko pada Rantai Pasok Berbasis Blockchain',
      author: 'Dr. Arya Wiguna',
      assignedDate: '01 Mar 2026',
      completedDate: '08 Mar 2026',
      status: 'completed',
      recommendation: 'Diterima dengan Revisi Minor',
      score: 85
    },
    {
      id: 'REV-088',
      title: 'Efisiensi Energi pada Jaringan Sensor Nirkabel Menggunakan AI',
      author: 'Prof. Siti Aminah',
      assignedDate: '15 Feb 2026',
      completedDate: '25 Feb 2026',
      status: 'completed',
      recommendation: 'Diterima Tanpa Revisi',
      score: 92
    },
    {
      id: 'REV-085',
      title: 'Analisis Faktor Eksternal terhadap Volatilitas Saham Sektor Teknologi',
      author: 'Budi Santoso, M.Econ',
      assignedDate: '02 Jan 2026',
      completedDate: '12 Jan 2026',
      status: 'rejected',
      recommendation: 'Ditolak',
      score: 45
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Review</h1>
          <p className="text-slate-500 text-sm mt-1">Daftar naskah yang telah selesai Anda evaluasi.</p>
        </div>
        
        <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} strokeWidth={1.5} />
            </div>
            <input
              type="text"
              className="input-field pl-10 py-2 text-sm"
              placeholder="Cari naskah..."
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Selesai</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight mt-1">45</p>
          </div>
          <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
            <FileText size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Rata-rata Skor</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight mt-1">78</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Judul Naskah</th>
                <th scope="col" className="px-6 py-4 font-medium">Tanggal Selesai</th>
                <th scope="col" className="px-6 py-4 font-medium">Rekomendasi</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Skor</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Laporan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historyData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 line-clamp-2" title={item.title}>{item.title}</div>
                    <div className="text-xs text-slate-500 mt-1">ID: {item.id} • Penulis: {item.author}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-600">
                      <Calendar size={14} className="mr-1.5 text-slate-400" />
                      {item.completedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'completed' && item.score > 70 ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'completed' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {item.recommendation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-slate-700">{item.score}</span>/100
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-600 hover:text-primary-800 p-2 hover:bg-primary-50 rounded-lg transition-colors inline-flex items-center" title="Lihat Draf Penilaian">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewHistory;
