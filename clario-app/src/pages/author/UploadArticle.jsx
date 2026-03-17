import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, FileText, UploadCloud, Loader2 } from 'lucide-react';
import FileUploader from '../../components/common/FileUploader';
import { useAuth } from '../../context/AuthContext';
import { uploadArticleWithFile } from '../../services/articleService';

const UploadArticle = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [metadata, setMetadata] = useState({
    title: '',
    targetJournal: '',
    researchField: 'social'
  });
  
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !currentUser) return;

    try {
      setIsUploading(true);
      
      const articleMetadata = {
        ...metadata,
        authorId: currentUser.uid,
        authorName: userData?.fullName || currentUser.displayName || 'Unknown Author',
        authorEmail: currentUser.email,
      };

      await uploadArticleWithFile(file, articleMetadata, (progress) => {
        setUploadProgress(progress);
      });

      alert('Naskah berhasil diunggah! AI Sedang memproses Initial Screening...');
      navigate('/author');
    } catch (error) {
      console.error("Upload error:", error);
      alert('Gagal mengunggah naskah. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-800 tracking-tight">Upload Manuscript</h1>
        <p className="text-slate-500 mt-2 font-light text-lg">Provide details and upload your document for AI-assisted initial screening.</p>
      </div>

      {/* Elegant Stepper */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {/* Step 1 */}
        <div className={`flex flex-col items-center gap-3 transition-colors duration-300 ${currentStep >= 1 ? 'text-primary-700' : 'text-slate-400'}`}>
          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-medium text-lg transition-all shadow-sm ${currentStep >= 1 ? 'border-primary-500 bg-primary-50 shadow-primary-500/10' : 'border-slate-200 bg-slate-50'}`}>
            {currentStep > 1 ? <CheckCircle2 className="w-6 h-6 text-primary-600" /> : '1'}
          </div>
          <span className="font-medium text-sm tracking-wide">Manuscript Details</span>
        </div>
        
        <div className={`flex-1 mx-4 h-px transition-colors duration-500 ${currentStep > 1 ? 'bg-primary-500' : 'bg-slate-200'}`}></div>
        
        {/* Step 2 */}
        <div className={`flex flex-col items-center gap-3 transition-colors duration-300 ${currentStep >= 2 ? 'text-primary-700' : 'text-slate-400'}`}>
          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-medium text-lg transition-all shadow-sm ${currentStep >= 2 ? 'border-primary-500 bg-primary-50 shadow-primary-500/10' : 'border-slate-200 bg-slate-50'}`}>
            2
          </div>
          <span className="font-medium text-sm tracking-wide">Document Upload</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          
          {/* Step 1 Content */}
          {currentStep === 1 && (
            <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 tracking-wide">Working Title</label>
                <input
                  type="text"
                  required
                  value={metadata.title}
                  onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                  className="input-field text-base placeholder-slate-300 py-3"
                  placeholder="Enter the title of your manuscript"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 tracking-wide flex justify-between">
                  <span>Target Journal</span>
                  <span className="text-slate-400 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  value={metadata.targetJournal}
                  onChange={(e) => setMetadata({...metadata, targetJournal: e.target.value})}
                  className="input-field text-base placeholder-slate-300 py-3"
                  placeholder="e.g. Journal of Academic Research"
                />
                <p className="text-xs text-slate-500 leading-relaxed pt-1">Providing a target journal helps the AI tailor its formatting and depth analysis specifically for that publication's standards.</p>
              </div>

              <div className="space-y-2 relative">
                <label className="text-sm font-semibold text-slate-700 tracking-wide">Primary Field of Study</label>
                <div className="relative">
                  <select
                    value={metadata.researchField}
                    onChange={(e) => setMetadata({...metadata, researchField: e.target.value})}
                    className="input-field text-base py-3 appearance-none cursor-pointer"
                  >
                    <option value="social">Social Sciences & Humanities</option>
                    <option value="science">Science & Mathematics</option>
                    <option value="medical">Health & Medicine</option>
                    <option value="engineering">Engineering & Computer Science</option>
                    <option value="education">Education</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!metadata.title}
                  className="btn-primary py-3 px-6 flex items-center gap-2 text-base w-full sm:w-auto justify-center"
                >
                  Continue to Upload
                  <ChevronRight className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 Content */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-5 bg-primary-50/50 text-slate-700 rounded-xl border border-primary-100 flex items-start gap-4">
                <div className="p-2 bg-primary-100 rounded-lg shrink-0 mt-0.5">
                  <FileText className="w-5 h-5 text-primary-700" strokeWidth={1.5} />
                </div>
                <p className="text-sm leading-relaxed">
                  For optimal AI screening results, ensure your document conforms to the standard <span className="font-semibold text-slate-800">IMRAD structure</span> (Introduction, Methods, Results, and Discussion) including an Abstract and References.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 tracking-wide">Manuscript File</label>
                <FileUploader onFileSelect={(f) => setFile(f)} maxMb={10} acceptedTypes=".pdf,.docx" />
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-4 justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  disabled={isUploading}
                  className="btn-secondary py-3 px-6 text-base w-full sm:w-auto disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!file || isUploading}
                  className="btn-primary py-3 px-6 flex items-center justify-center gap-2 text-base w-full sm:w-auto group relative overflow-hidden"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading {Math.round(uploadProgress)}%</span>
                      {/* Inner Progress bar */}
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
                      <span>Submit & Screen via AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default UploadArticle;
