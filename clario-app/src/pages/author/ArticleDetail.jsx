import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, ChevronRight, FileText, ArrowRight, Loader2, Upload, History } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getArticleById, submitRevision } from '../../services/articleService';
import FileUploader from '../../components/common/FileUploader';
import { useAuth } from '../../context/AuthContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const { userData } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRevising, setIsRevising] = useState(false);
  const [revFile, setRevFile] = useState(null);
  const [revNotes, setRevNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleRevisionSubmit = async () => {
    if (!revFile || !article) return;
    setUploading(true);
    try {
      await submitRevision(id, revFile, {
        authorId: article.authorId,
        title: article.title,
        revisionNotes: revNotes
      });
      alert("Revision submitted successfully!");
      window.location.reload(); // Refresh to see latest version
    } catch (error) {
      console.error("Revision error:", error);
      alert("Failed to submit revision.");
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': case 'processing': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'danger': case 'rejected': return <XCircle className="w-5 h-5 text-rose-500" />;
      default: return null;
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
    </div>
  );

  if (!article) return <div className="p-20 text-center">Article not found.</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <Link to="/author" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-primary-600 mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-amber-100/50 text-amber-800 text-xs font-semibold rounded-md border border-amber-200/60 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                {article.status === 'reviewed' ? 'Revision Requested' : article.status.charAt(0).toUpperCase() + article.status.slice(1)}
              </span>
              <span className="text-sm font-mono text-slate-400 font-medium">#{article.id.slice(-6).toUpperCase()}</span>
              {article.version && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded border border-slate-200">
                  Version {article.version}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-snug max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: AI Report & Revision */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Revision UI (Conditional) */}
          {(article.status === 'reviewed' || isRevising) && (
            <div className="bg-white rounded-2xl shadow-xl border-2 border-primary-100 p-8 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                  <Upload size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Submit Revision</h2>
                  <p className="text-sm text-slate-500">Upload your updated manuscript and mention key changes.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Revised Manuscript (PDF/Word)</label>
                  <FileUploader onFileSelect={(file) => setRevFile(file)} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Revision Notes for Reviewer</label>
                  <textarea 
                    className="input-field min-h-[120px] text-sm"
                    placeholder="E.g., Added more references in Section 2, updated Table 1..."
                    value={revNotes}
                    onChange={(e) => setRevNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setIsRevising(false)}
                    className="btn-secondary px-6 shrink-0"
                  >
                    Cancel
                  </button>
                  <button 
                    disabled={!revFile || uploading}
                    onClick={handleRevisionSubmit}
                    className="btn-primary px-8 flex items-center gap-2"
                  >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    Submit Version { (article.version || 1) + 1 }
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-6">
                <div>
                  <h2 className="text-xl font-bold tracking-wide flex items-center gap-2 mb-2">
                    <span className="text-primary-300">AI Screening</span> Analysis
                  </h2>
                  <p className="text-slate-400 text-sm font-light max-w-md leading-relaxed">
                    Preliminary quality assessment. Result: {article.aiScreeningStatus === 'completed' ? 'Success' : 'Pending'}.
                  </p>
                </div>
                <div className="text-right shrink-0 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="text-4xl font-extrabold text-white flex items-baseline gap-1">
                    {article.aiScore || '--'}<span className="text-slate-400 text-xl font-medium">/100</span>
                  </div>
                  <p className="text-xs text-primary-300 uppercase tracking-wider font-semibold mt-1">Quality Index</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 text-center text-slate-500 italic text-sm">
                Expert reviewer comments will be visible here once the review process is complete. 
                AI analysis has flagged {article.aiScore < 70 ? 'some critical' : 'minor'} issues in your manuscript.
            </div>
          </div>
        </div>

        {/* Right Column: Metadata */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100/60 sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Document Info</h3>
            
            <div className="space-y-5">
              <div>
                <p className="text-xs text-slate-500 mb-1 font-medium">Current Status</p>
                <div className="flex items-center gap-2 font-semibold text-slate-700 capitalize">
                  {getStatusIcon(article.status)}
                  {article.status.replace('_', ' ')}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1 font-medium">Research Field</p>
                <p className="text-sm font-bold text-slate-800">{article.researchField || 'General'}</p>
              </div>

              {article.version > 1 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                    <History size={12} /> Revision History
                  </h4>
                  <p className="text-xs text-slate-600 mb-2">Previous versions are archived.</p>
                </div>
              )}
              
              <div className="pt-5 border-t border-slate-100 space-y-3">
                <a 
                  href={article.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-slate-200 shadow-sm text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group"
                >
                  <FileText className="w-4 h-4 mr-2 text-slate-400 group-hover:text-primary-600 transition-colors" />
                  View Manuscript (v{article.version || 1})
                </a>
                
                {article.status !== 'reviewed' && (
                  <button 
                    onClick={() => setIsRevising(true)}
                    className="w-full flex justify-center items-center py-2.5 px-4 bg-slate-900 border border-transparent shadow-sm text-sm font-semibold rounded-lg text-white hover:bg-slate-800 transition-all"
                  >
                    Submit New Version
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
