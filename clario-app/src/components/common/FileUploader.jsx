import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';

const FileUploader = ({ onFileSelect, maxMb = 10, acceptedTypes = '.pdf,.doc,.docx' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    setError('');
    if (!file) return false;

    // Check size
    if (file.size > maxMb * 1024 * 1024) {
      setError(`File size exceeds ${maxMb}MB limit.`);
      return false;
    }

    // Since acceptedTypes can be fuzzy depending on browser, simple extension check
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      setError(`Invalid file type. Accepted: ${acceptedTypes}`);
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        if (onFileSelect) onFileSelect(file);
      }
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors text-center ${
          dragActive ? 'border-primary-500 bg-primary-50' : 
          selectedFile ? 'border-slate-200 bg-white' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedFile && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes}
          multiple={false}
          onChange={handleChange}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <UploadCloud className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                <span className="text-primary-600 font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Word or PDF documents (max. {maxMb}MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 bg-primary-100 rounded text-primary-600 shrink-0">
                <File className="w-6 h-6" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB 
                  <span className="mx-1">•</span>
                  <span className="flex items-center text-primary-600">
                    <CheckCircle className="w-3 h-3 mr-1" /> Ready
                  </span>
                </p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-2 inline-block"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUploader;
