import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Import from context

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      // Call Firebase Login
      const result = await login(email, password);
      
      // Success! Redirect them based on their actual role
      const dashboardPath = result.role === 'super-admin' ? 'admin' : result.role;
      navigate(`/${dashboardPath}`); 
    } catch (err) {
      console.error(err);
      setError('Gagal masuk. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-slate-800 tracking-tight mb-2">Welcome Back</h2>
        <p className="text-slate-500 font-light">Access your workspace to continue.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 animate-in fade-in flex items-start gap-3 rounded-r-lg">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
              <Mail size={18} strokeWidth={1.5} />
            </div>
            <input
              id="email"
              type="email"
              required
              className="input-field pl-11"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">Forgot password?</a>
          </div>
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
              <Lock size={18} strokeWidth={1.5} />
            </div>
            <input
              id="password"
              type="password"
              required
              className="input-field pl-11"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 font-medium transition-all shadow-sm mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 size={18} className="animate-spin mr-2" /> Memproses...</>
          ) : (
            <>Sign In <ArrowRight size={18} className="ml-2 opacity-80" strokeWidth={1.5} /></>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-slate-200 mt-6 hidden">
          {/* Note: Fast access demo buttons are hidden while we implement real Auth */}
          <p className="text-xs text-slate-500 font-medium mb-3 text-center uppercase tracking-wider">Demo / Fast Access</p>
          <div className="grid grid-cols-2 gap-2">
             <button type="button" onClick={() => navigate('/author')} className="btn-secondary py-1.5 text-xs">Author</button>
             <button type="button" onClick={() => navigate('/reviewer')} className="btn-secondary py-1.5 text-xs">Reviewer</button>
             <button type="button" onClick={() => navigate('/qa')} className="btn-secondary py-1.5 text-xs text-purple-700 border-purple-200 hover:bg-purple-50">QA</button>
             <button type="button" onClick={() => navigate('/admin')} className="btn-secondary py-1.5 text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50">Admin</button>
          </div>
        </div>

      <div className="mt-10 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
          Create one now
        </Link>
      </div>
    </div>
  );
};

export default Login;
