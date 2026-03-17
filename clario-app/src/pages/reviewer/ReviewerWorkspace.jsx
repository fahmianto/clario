import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send, Bot, ChevronDown, ChevronUp, Maximize2, FileText, AlertCircle, Search, MessageSquare, Loader2, Download } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getArticleById, submitReview } from '../../services/articleService';
import { executePrompt } from '../../services/aiService';
import { generateReviewReport } from '../../services/reportService';

const FRAMEWORK_LABELS = {
  c1: "Keselarasan Judul dan Isi",
  c2: "Kelengkapan Abstrak (BOMRI)",
  c3: "Kekuatan Pendahuluan & Research Gap",
  c4: "Tinjauan Pustaka (Literature Review)",
  c5: "Kekuatan Metodologi",
  c6: "Penyajian Hasil (Results)",
  c7: "Kualitas Diskusi",
  c8: "Kesimpulan & Kontribusi",
  c9: "Kualitas Referensi",
  c10: "Kesesuaian dengan Jurnal Target"
};

const ReviewerWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('framework'); 
  const [expandedSections, setExpandedSections] = useState({ c1: true });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  // AI Assistant State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState({
    similarArticles: null,
    overClaims: null,
    methodologyCritique: null
  });

  // Framework State (C1-C10)
  const [frameworkData, setFrameworkData] = useState({
    c1: { score: 4, comment: "" },
    c2: { score: 3, comment: "" },
    c3: { score: 3, comment: "" },
    c4: { score: 3, comment: "" },
    c5: { score: 3, comment: "" },
    c6: { score: 3, comment: "" },
    c7: { score: 3, comment: "" },
    c8: { score: 3, comment: "" },
    c9: { score: 3, comment: "" },
    c10: { score: 3, comment: "" },
  });

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

  const handleExportPdf = () => {
    if (!article) return;
    setIsExporting(true);
    try {
      // Enrich data with labels for the PDF
      const reportData = {};
      Object.keys(frameworkData).forEach(key => {
        reportData[key] = {
          ...frameworkData[key],
          label: FRAMEWORK_LABELS[key]
        };
      });
      generateReviewReport(article, reportData);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to generate PDF report.");
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const updateFramework = (cid, field, value) => {
    setFrameworkData(prev => ({
      ...prev,
      [cid]: { ...prev[cid], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    try {
      setSubmitting(true);
      await submitReview(id, currentUser.uid, {
        scores: frameworkData,
        reviewerName: currentUser.displayName || 'Expert Reviewer',
        submittedAt: new Date().toISOString()
      });
      alert('Review successfully submitted!');
      navigate('/reviewer');
    } catch (error) {
      console.error("Submission error:", error);
      alert('Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRunAiTool = async (toolId) => {
    if (!article) return;
    setAiLoading(true);
    try {
      const result = await executePrompt(toolId, {
        title: article.title,
        abstract: article.abstract,
        content: "Simulated article content..."
      });
      
      setAiResults(prev => ({
        ...prev,
        [toolId === '2.2' ? 'similarArticles' : toolId === '2.3' ? 'overClaims' : 'methodologyCritique']: result
      }));
    } catch (error) {
      console.error("AI Tool Error:", error);
      alert("Failed to run AI tool.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
     return (
       <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
         <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
         <p className="text-slate-500 font-medium">Loading Workspace...</p>
       </div>
     );
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-slate-50 animate-in fade-in duration-500">
      
      {/* Top Action Bar */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/reviewer" className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">#...{article?.id?.slice(-6).toUpperCase()}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
                {article?.status || 'In Review'}
              </span>
            </div>
            <h1 className="text-sm font-semibold text-slate-800 truncate max-w-md" title={article?.title}>
              {article?.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPdf}
            disabled={isExporting}
            className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-2 text-primary-700 border-primary-100 bg-primary-50/30 hover:bg-primary-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden sm:inline">Download Report</span>
          </button>
          <button className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary py-1.5 px-4 text-sm flex items-center gap-2 shadow-sm shadow-primary-500/20"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Document Viewer (PDF/Text Placeholder) */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-slate-100/50 relative">
          
          {/* Viewer Toolbar */}
          <div className="h-10 bg-white border-b border-slate-200 flex items-center justify-between px-3 shrink-0">
             <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
               <FileText className="w-4 h-4 text-primary-500" />
               Manuscript_Source.pdf
             </div>
             <div className="flex items-center gap-3">
                <a 
                   href={article?.fileUrl} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" /> Open Full PDF
                </a>
             </div>
          </div>

          {/* Actual Viewer Area Placeholder */}
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            {/* Mock PDF Page */}
            <div className="w-full max-w-3xl bg-white shadow-md border border-slate-200 p-12 min-h-[800px]">
              <div className="mb-10 text-center border-b pb-6 border-slate-100">
                 <h2 className="text-xl font-bold text-slate-800 mb-2 uppercase">{article?.title}</h2>
                 <p className="text-slate-400 text-xs font-mono">ID: {article?.id}</p>
                 <p className="text-slate-500 text-sm mt-4 italic">Field: {article?.researchField}</p>
              </div>
              
              <div className="space-y-6">
                <div className="h-4 w-3/4 bg-slate-50 rounded"></div>
                <div className="h-32 w-full bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-300 text-xs uppercase tracking-widest font-bold">
                  PDF Preview Placeholder
                  <br/>[Visualizing fileUrl: {article?.fileUrl?.slice(0, 30)}...]
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-slate-50 rounded"></div>
                  <div className="h-3 w-full bg-slate-50 rounded"></div>
                  <div className="h-3 w-5/6 bg-slate-50 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Workspace (Framework & AI) */}
        <div className="w-1/2 flex flex-col bg-white">
          
          {/* Workspace Tabs */}
          <div className="flex border-b border-slate-200 px-2 pt-2 bg-slate-50 shrink-0">
            <button
              onClick={() => setActiveTab('framework')}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'framework' 
                  ? 'border-primary-500 text-primary-700 bg-white rounded-t-lg' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              10-Component Framework
            </button>
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'ai-assistant' 
                  ? 'border-primary-500 text-primary-700 bg-white rounded-t-lg' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Assistant Panel
            </button>
          </div>

          {/* Workspace Content */}
          <div className="flex-1 overflow-y-auto bg-white p-6 custom-scrollbar">
            
            {/* --- TAB 1: FRAMEWORK --- */}
            {activeTab === 'framework' && (
              <div className="space-y-6 max-w-2xl mx-auto pb-20">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                  <Bot className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">AI Pre-fill Active</h4>
                    <p className="text-sm text-blue-700/80 leading-relaxed">
                      Laporan "Initial Screening Lapis 1" telah digunakan sebagai referensi awal. Silakan modifikasi skor atau catatan sesuai penilaian ahli Anda.
                    </p>
                  </div>
                </div>

                {/* Section C1 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c1')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C1</span>
                      <h3 className="font-semibold text-slate-800 text-base">Keselarasan Judul dan Isi</h3>
                    </div>
                    {expandedSections.c1 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  
                  {expandedSections.c1 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-sm font-medium text-slate-700">Skor Penilaian Ahli</label>
                          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">Current: {frameworkData.c1.score}/5</span>
                        </div>
                        <input 
                           type="range" min="1" max="5" 
                           value={frameworkData.c1.score} 
                           onChange={(e) => updateFramework('c1', 'score', parseInt(e.target.value))}
                           className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                        />
                        <div className="flex justify-between text-xs text-slate-400 font-medium mt-2 px-1">
                          <span>1 (Buruk)</span>
                          <span className="text-slate-700 font-bold text-sm -mt-4 bg-white px-2 rounded-full border border-slate-200 shadow-sm">{frameworkData.c1.score}</span>
                          <span>5 (Sangat Baik)</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Catatan Revisi untuk Author</label>
                        <textarea 
                          className="input-field min-h-[100px] resize-y text-sm leading-relaxed" 
                          placeholder="Masukkan komentar rinci mengenai judul naskah..."
                          value={frameworkData.c1.comment}
                          onChange={(e) => updateFramework('c1', 'comment', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section C2 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c2')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C2</span>
                      <h3 className="font-semibold text-slate-800 text-base">Kelengkapan Abstrak (BOMRI)</h3>
                    </div>
                    {expandedSections.c2 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                   {expandedSections.c2 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-sm font-medium text-slate-700">Skor (Background, Objective, Method, Result, Implication)</label>
                          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">{frameworkData.c2.score}/5</span>
                        </div>
                        <input 
                           type="range" min="1" max="5" 
                           value={frameworkData.c2.score} 
                           onChange={(e) => updateFramework('c2', 'score', parseInt(e.target.value))}
                           className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Komentar Abstrak</label>
                        <textarea 
                          className="input-field min-h-[100px] text-sm" 
                          placeholder="Evaluasi struktur BOMRI..."
                          value={frameworkData.c2.comment}
                          onChange={(e) => updateFramework('c2', 'comment', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  )}
                </div>

                 {/* Section C3 */}
                 <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c3')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C3</span>
                      <h3 className="font-semibold text-slate-800 text-base">Kekuatan Pendahuluan & Research Gap</h3>
                    </div>
                    {expandedSections.c3 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.c3 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-sm font-medium text-slate-700">Skor Pendahuluan</label>
                          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">{frameworkData.c3.score}/5</span>
                        </div>
                        <input 
                           type="range" min="1" max="5" 
                           value={frameworkData.c3.score} 
                           onChange={(e) => updateFramework('c3', 'score', parseInt(e.target.value))}
                           className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                        />
                      </div>
                      <textarea 
                        className="input-field min-h-[100px] text-sm" 
                        placeholder="Evaluasi research gap dan alur pendahuluan..."
                        value={frameworkData.c3.comment}
                        onChange={(e) => updateFramework('c3', 'comment', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>

                {/* Section C4 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c4')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C4</span>
                      <h3 className="font-semibold text-slate-800 text-base">Tinjauan Pustaka (Literature Review)</h3>
                    </div>
                    {expandedSections.c4 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.c4 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <input 
                         type="range" min="1" max="5" 
                         value={frameworkData.c4.score} 
                         onChange={(e) => updateFramework('c4', 'score', parseInt(e.target.value))}
                         className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <textarea 
                        className="input-field min-h-[100px] text-sm" 
                        placeholder="Apakah sitasi relevan dan terkini?"
                        value={frameworkData.c4.comment}
                        onChange={(e) => updateFramework('c4', 'comment', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>

                {/* Section C5 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c5')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C5</span>
                      <h3 className="font-semibold text-slate-800 text-base">Kekuatan Metodologi</h3>
                    </div>
                    {expandedSections.c5 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.c5 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <input 
                         type="range" min="1" max="5" 
                         value={frameworkData.c5.score} 
                         onChange={(e) => updateFramework('c5', 'score', parseInt(e.target.value))}
                         className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <textarea 
                        className="input-field min-h-[100px] text-sm" 
                        placeholder="Evaluasi desain penelitian, sampel, dan instrumen..."
                        value={frameworkData.c5.comment}
                        onChange={(e) => updateFramework('c5', 'comment', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>

                {/* Section C6 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c6')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C6</span>
                      <h3 className="font-semibold text-slate-800 text-base">Penyajian Hasil (Results)</h3>
                    </div>
                    {expandedSections.c6 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.c6 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <input 
                         type="range" min="1" max="5" 
                         value={frameworkData.c6.score} 
                         onChange={(e) => updateFramework('c6', 'score', parseInt(e.target.value))}
                         className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <textarea 
                        className="input-field min-h-[100px] text-sm" 
                        placeholder="Kejelasan tabel, grafik, dan narasi hasil..."
                        value={frameworkData.c6.comment}
                        onChange={(e) => updateFramework('c6', 'comment', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>

                {/* Section C7 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c7')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C7</span>
                      <h3 className="font-semibold text-slate-800 text-base">Kualitas Diskusi</h3>
                    </div>
                    {expandedSections.c7 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.c7 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <input 
                         type="range" min="1" max="5" 
                         value={frameworkData.c7.score} 
                         onChange={(e) => updateFramework('c7', 'score', parseInt(e.target.value))}
                         className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <textarea 
                        className="input-field min-h-[100px] text-sm" 
                        placeholder="Interpretasi temuan dan perbandingan dengan teori..."
                        value={frameworkData.c7.comment}
                        onChange={(e) => updateFramework('c7', 'comment', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>

                {/* Section C8 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c8')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C8</span>
                      <h3 className="font-semibold text-slate-800 text-base">Kesimpulan & Kontribusi</h3>
                    </div>
                    {expandedSections.c8 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.c8 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <input 
                         type="range" min="1" max="5" 
                         value={frameworkData.c8.score} 
                         onChange={(e) => updateFramework('c8', 'score', parseInt(e.target.value))}
                         className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <textarea 
                        className="input-field min-h-[100px] text-sm" 
                        placeholder="Ketajaman kesimpulan dan saran penelitian mendatang..."
                        value={frameworkData.c8.comment}
                        onChange={(e) => updateFramework('c8', 'comment', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>

                {/* Section C9 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c9')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C9</span>
                      <h3 className="font-semibold text-slate-800 text-base">Kualitas Referensi</h3>
                    </div>
                    {expandedSections.c9 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.c9 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <input 
                         type="range" min="1" max="5" 
                         value={frameworkData.c9.score} 
                         onChange={(e) => updateFramework('c9', 'score', parseInt(e.target.value))}
                         className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <textarea 
                        className="input-field min-h-[100px] text-sm" 
                        placeholder="Konsistensi format dan kualitas sumber referensi..."
                        value={frameworkData.c9.comment}
                        onChange={(e) => updateFramework('c9', 'comment', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>

                {/* Section C10 */}
                <div className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm">
                  <button 
                    onClick={() => toggleSection('c10')}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-600 font-mono shrink-0">C10</span>
                      <h3 className="font-semibold text-slate-800 text-base">Kesesuaian dengan Jurnal Target</h3>
                    </div>
                    {expandedSections.c10 ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {expandedSections.c10 && (
                    <div className="p-5 border-t border-slate-200 bg-white space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <input 
                         type="range" min="1" max="5" 
                         value={frameworkData.c10.score} 
                         onChange={(e) => updateFramework('c10', 'score', parseInt(e.target.value))}
                         className="w-full accent-primary-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                      <textarea 
                        className="input-field min-h-[100px] text-sm" 
                        placeholder="Apakah naskah sudah pas dengan scope dan template jurnal target?"
                        value={frameworkData.c10.comment}
                        onChange={(e) => updateFramework('c10', 'comment', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>

                <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                    <p className="text-sm text-slate-400 font-medium">Semua komponen framework telah diisi? Klik Submit Review di atas.</p>
                </div>

              </div>
            )}

            {/* --- TAB 2: AI ASSISTANT --- */}
            {activeTab === 'ai-assistant' && (
              <div className="space-y-6 max-w-2xl mx-auto h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-3">
                    <Bot size={24} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">AI Co-Pilot for Reviewers</h2>
                  <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">Assist in deep analysis. Use specific AI tools to verify claims, find literature gaps, and check contextual validity.</p>
                </div>

                {/* AI Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  
                  {/* Tool 1 */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Similar Article Finder</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                       Identifies highly similar published papers to detect potential self-plagiarism or missing foundational citations (PROMPT 2.2).
                    </p>
                    
                    {aiResults.similarArticles ? (
                      <div className="mt-2 space-y-2 mb-4 animate-in fade-in slide-in-from-top-1">
                        {aiResults.similarArticles.articles.map((art, idx) => (
                          <div key={idx} className="p-2 bg-slate-50 rounded text-[10px] border border-slate-100">
                            <p className="font-bold text-slate-700">{art.title}</p>
                            <p className="text-slate-500">{art.author} ({art.year})</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <button 
                      onClick={() => handleRunAiTool('2.2')}
                      disabled={aiLoading}
                      className="btn-secondary w-full py-2 text-xs font-semibold"
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto"/> : 'Run Query'}
                    </button>
                  </div>

                  {/* Tool 2 */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Over-claim Detector</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                      Analyzes the conclusion against the methods & results section to highlight any exaggerated claims (PROMPT 2.3).
                    </p>

                    {aiResults.overClaims ? (
                      <div className="mt-2 space-y-2 mb-4 animate-in fade-in slide-in-from-top-1">
                        {aiResults.overClaims.findings.map((f, idx) => (
                          <div key={idx} className="p-2 bg-amber-50 rounded text-[10px] border border-amber-100">
                            <p className="font-bold text-amber-800 underline">Issue: {f.issue}</p>
                            <p className="text-amber-700 italic mt-1">Saran: {f.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <button 
                      onClick={() => handleRunAiTool('2.3')}
                      disabled={aiLoading}
                      className="btn-secondary w-full py-2 text-xs font-semibold"
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto"/> : 'Analyze Conclusions'}
                    </button>
                  </div>

                  {/* Tool 3 */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full md:col-span-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">Methodology Critic</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Provides an expert-level critique of the chosen methodology, identifying common pitfalls and suggesting stronger alternatives based on the research field (PROMPT 2.4).
                    </p>

                    {aiResults.methodologyCritique ? (
                      <div className="mt-2 p-3 bg-emerald-50 rounded-lg text-xs border border-emerald-100 mb-4 animate-in fade-in slide-in-from-top-1">
                        <p className="text-emerald-900 font-medium mb-2">{aiResults.methodologyCritique.critique}</p>
                        <div className="flex flex-wrap gap-2">
                          {aiResults.methodologyCritique.alternatives.map((alt, idx) => (
                            <span key={idx} className="bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-700 text-[10px]">
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <button 
                      onClick={() => handleRunAiTool('2.4')}
                      disabled={aiLoading}
                      className="btn-secondary w-full py-2 text-xs font-semibold"
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto"/> : 'Run Critique'}
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewerWorkspace;
