import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle, AlertCircle, ChevronRight, Search, Filter } from 'lucide-react';

const Submissions = () => {
  // Mock data for author submissions
  const submissions = [
    {
      id: 'PUB-2026-001',
      title: 'Dampak Perubahan Iklim terhadap Keanekaragaman Hayati Laut Tropis',
      date: '10 Mar 2026',
      status: 'review',
      journal: 'Jurnal Ilmu Kelautan Tropis',
      lastUpdate: '11 Mar 2026'
    },
    {
      id: 'PUB-2026-002',
      title: 'Penerapan Machine Learning dalam Prediksi Cuaca Jangka Pendek',
      date: '28 Feb 2026',
      status: 'accepted',
      journal: 'Jurnal Teknologi Cerdas',
      lastUpdate: '05 Mar 2026'
    },
    {
      id: 'PUB-2026-003',
      title: 'Analisis Sentimen Konsumen pada E-commerce menggunakan NLP',
      date: '15 Jan 2026',
      status: 'revision',
      journal: 'Jurnal Sistem Informasi Bisnis',
      lastUpdate: '20 Feb 2026'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'review':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock size={12} className="mr-1" /> Sedang Direview</span>;
      case 'accepted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle size={12} className="mr-1" /> Diterima</span>;
      case 'revision':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><AlertCircle size={12} className="mr-1" /> Revisi Diperlukan</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Menunggu</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Naskah Saya</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola dan pantau status publikasi artikel Anda.</p>
        </div>
        <Link to="/author/upload" className="btn-primary flex items-center gap-2">
          <FileText size={18} />
          Kirim Naskah Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} strokeWidth={1.5} />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Cari judul artikel atau ID..."
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} />
            Filter Status
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Informasi Naskah</th>
                <th scope="col" className="px-6 py-4 font-medium">Jurnal Tujuan</th>
                <th scope="col" className="px-6 py-4 font-medium">Tanggal Kirim</th>
                <th scope="col" className="px-6 py-4 font-medium">Status & Update</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 mb-1">{sub.title}</div>
                    <div className="text-xs text-slate-500 font-mono">{sub.id}</div>
                  </td>
                  <td className="px-6 py-4">{sub.journal}</td>
                  <td className="px-6 py-4">{sub.date}</td>
                  <td className="px-6 py-4">
                    <div className="mb-1">{getStatusBadge(sub.status)}</div>
                    <div className="text-xs text-slate-400">Updated: {sub.lastUpdate}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/author/article/${sub.id}`} className="text-primary-600 hover:text-primary-800 font-medium text-sm inline-flex items-center gap-1">
                      Detail <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && (
             <div className="p-8 text-center text-slate-500">
               <FileText size={48} className="mx-auto text-slate-300 mb-3" />
               <p>Belum ada naskah yang dikirim.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submissions;
