import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Clock, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getArticlesByAuthor } from '../../services/articleService';

const AuthorDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!currentUser) return;
      try {
        const data = await getArticlesByAuthor(currentUser.uid);
        // Sort by date descending
        setSubmissions(data.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [currentUser]);

  // Dynamic status styling
  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-slate-100 text-slate-700 border-slate-200',
      'screening': 'bg-blue-50 text-blue-700 border-blue-100',
      'assigned': 'bg-indigo-50 text-indigo-700 border-indigo-100',
      'reviewed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'qa-review': 'bg-purple-50 text-purple-700 border-purple-100',
      'published': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'rejected': 'bg-rose-50 text-rose-700 border-rose-100'
    };
    
    const label = {
      'pending': 'Queued',
      'screening': 'AI Initial Screening',
      'assigned': 'In Review',
      'reviewed': 'Expert Reviewed',
      'qa-review': 'Final QA',
      'published': 'Published',
      'rejected': 'Needs Revision'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[status] || styles.pending}`}>
        {status === 'screening' ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
            AI Analyzing...
          </span>
        ) : (
          <>
            {status === 'assigned' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse"></span>
            ) : null}
            {label[status] || status}
          </>
        )}
      </span>
    );
  };

  // Stats calculation
  const stats = {
    total: submissions.length,
    inReview: submissions.filter(s => ['screening', 'assigned'].includes(s.status)).length,
    completed: submissions.filter(s => s.status === 'published').length,
    revision: submissions.filter(s => s.status === 'rejected').length
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4 animate-in fade-in duration-500">
      
      {/* Welcome Hero Section */}
      <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 mb-8 relative overflow-hidden shadow-lg shadow-slate-900/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-20 w-60 h-60 bg-primary-600/10 rounded-full blur-2xl -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Welcome back, {userData?.fullName?.split(' ')[0] || 'Author'}
            </h1>
            <p className="text-slate-400 font-light max-w-lg leading-relaxed text-sm format-sm">
              Ready to refine your next publication? Upload a new manuscript for an instant AI screening or check the status of your current reviews.
            </p>
          </div>
          <Link to="/author/upload" className="shrink-0 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-primary-600/20 flex items-center gap-2 group border border-primary-500/50">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2} />
            New Submission
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.total}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Submissions</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.inReview}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Review</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.completed}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.revision}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Needs Revision</p>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      <div>
        <div className="flex justify-between items-end mb-5 px-1">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Submissions</h2>
          <Link to="/author/submissions" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-100/80 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
                <p className="text-sm">Loading your submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-2">
                 <FileText className="w-12 h-12 opacity-20" />
                 <p className="text-sm font-medium">Belum ada naskah yang diunggah.</p>
                 <Link to="/author/upload" className="text-primary-600 text-sm hover:underline mt-2">Mulai upload naskah pertama Anda</Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">ID</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Manuscript Title</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                  {submissions.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-xs font-mono font-medium text-slate-400">...{item.id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-slate-800 line-clamp-2 max-w-lg">{item.title}</p>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                        {item.createdAt?.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) || '-'}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(item.status)}
                            
                            {item.aiScore && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-xs font-bold text-slate-600" title="AI Base Score">
                                {item.aiScore}
                              </span>
                            )}
                          </div>
                          {item.status === 'screening' && item.aiProgress > 0 && (
                            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-500" 
                                style={{ width: `${item.aiProgress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/author/article/${item.id}`} className="text-primary-600 hover:text-primary-800 transition-colors flex justify-end items-center gap-1">
                          View Details <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
