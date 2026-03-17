import React, { useEffect, useState } from 'react';
import { Shield, Search, ArrowRight, CornerDownRight, Check, Play, UserPlus, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { getAllArticles } from '../../services/articleService';
import { getAllUsers } from '../../services/userService';
import { createNotification } from '../../services/notificationService';
import { doc, serverTimestamp, updateDoc as firestoreUpdateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const AdminAssignments = () => {
  const [articles, setArticles] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allArticles, allUsers] = await Promise.all([
        getAllArticles(),
        getAllUsers()
      ]);
      
      // Filter for articles that finished AI screening but aren't assigned yet
      const unassigned = allArticles.filter(a => 
        (a.status === 'pending' || a.status === 'screening_completed') && 
        (!a.assignments || a.assignments.length === 0)
      );
      
      const reviewerList = allUsers.filter(u => u.role === 'reviewer');
      
      setArticles(unassigned);
      setReviewers(reviewerList);
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (articleId, reviewerId) => {
    try {
      setAssigning(articleId);
      const articleRef = doc(db, 'articles', articleId);
      
      await firestoreUpdateDoc(articleRef, {
        assignments: [reviewerId],
        status: 'assigned',
        assignedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Create notification for reviewer
      await createNotification(reviewerId, {
        title: "Penugasan Baru",
        message: "Anda telah ditugaskan untuk mereview naskah baru.",
        type: "assignment",
        link: `/reviewer/workspace/${articleId}`
      });
      
      // Refresh list
      setArticles(prev => prev.filter(a => a.id !== articleId));
      alert("Reviewer successfully assigned!");
    } catch (error) {
      console.error("Assignment error:", error);
      alert("Failed to assign reviewer.");
    } finally {
      setAssigning(null);
    }
  };

  const getSuggestedReviewer = (article) => {
    // Basic recommendation logic: match research field
    return reviewers.find(r => r.researchField === article.researchField) || reviewers[0];
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.researchField?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Papan Penugasan</h1>
          <p className="text-slate-500 text-sm mt-1">Alokasikan naskah baru ke reviewer yang kompeten otomatis atau manual.</p>
        </div>
        
        <div className="flex gap-2">
            <button onClick={fetchData} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2 shadow-primary-500/20 shadow-lg cursor-not-allowed opacity-70">
                <Play size={16} fill="currentColor" />
                Jalankan Auto-Assign AI
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                {articles.length} Naskah Menunggu Penugasan
            </div>
            <div className="relative max-w-sm w-full">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                 <Search size={16} strokeWidth={2} />
               </div>
               <input
                 type="text"
                 className="input-field pl-9 h-10 py-1"
                 placeholder="Cari naskah berdasarkan judul/bidang..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
        </div>

        <div className="divide-y divide-slate-100 min-h-[300px]">
             {loading ? (
                <div className="p-20 text-center text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-2 text-primary-500" size={32} />
                    Memuat naskah...
                </div>
             ) : filteredArticles.length === 0 ? (
                <div className="p-20 text-center text-slate-400">
                    <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                    Tidak ada naskah yang memerlukan penugasan saat ini.
                </div>
             ) : filteredArticles.map(article => {
                 const suggested = getSuggestedReviewer(article);
                 return (
                    <div key={article.id} className="p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">#{article.id.slice(-6).toUpperCase()}</span>
                                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{article.researchField || 'General'}</span>
                                    {article.aiScore && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${article.aiScore > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            AI Score: {article.aiScore}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">{article.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{article.abstract || 'Title match only.'}</p>
                                <div className="text-xs text-slate-400 mt-3 font-medium flex items-center gap-1">
                                    <CornerDownRight size={14}/> Diupload {new Date(article.createdAt?.seconds * 1000).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <div className="lg:w-80 border border-emerald-100 bg-emerald-50/30 rounded-lg p-3 flex flex-col justify-between">
                                {suggested ? (
                                    <>
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 uppercase tracking-wide">
                                                    <Shield size={12}/> Rekomendasi AI
                                                </span>
                                                <span className="text-xs font-bold text-emerald-600">Smart Match</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800">{suggested.fullName}</p>
                                            <p className="text-xs text-slate-500">Keahlian: {suggested.researchField || 'Universal'}</p>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button 
                                                onClick={() => handleAssign(article.id, suggested.id)}
                                                disabled={assigning === article.id}
                                                className="flex-1 btn-primary py-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 gap-1 justify-center flex items-center transition-all"
                                            >
                                                {assigning === article.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14}/>}
                                                Tetapkan
                                            </button>
                                            <button className="btn-secondary py-1.5 px-3 text-xs border-slate-300 gap-1 flex items-center justify-center">
                                                <UserPlus size={14} className="text-slate-500" /> Pilih Lain
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-xs text-slate-400 italic text-center p-4">
                                        No expert reviewers available for this field.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                 );
             })}
        </div>
      </div>
    </div>
  );
};

export default AdminAssignments;
