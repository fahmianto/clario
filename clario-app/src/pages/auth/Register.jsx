import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Building2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('author');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signup } = useAuth(); // Import signup from context

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      
      // Call Firebase Signup
      await signup(email, password, name, role, institution);
      
      // Success! Redirect to their dashboard based on role
      const dashboardPath = role === 'super-admin' ? 'admin' : role;
      navigate(`/${dashboardPath}`); 
    } catch (err) {
      console.error(err);
      setError('Gagal membuat akun. Pastikan email belum terdaftar dan password minimal 6 karakter.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-800 tracking-tight mb-2">Create Account</h2>
        <p className="text-slate-500 font-light">Join CLARIO to refine your academic works.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 flex items-start gap-3 rounded-r-lg">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
              <User size={18} strokeWidth={1.5} />
            </div>
            <input
              id="name"
              type="text"
              required
              className="input-field pl-11 py-2"
              placeholder="Dr. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Institution */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="institution">Institution</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
              <Building2 size={18} strokeWidth={1.5} />
            </div>
            <input
              id="institution"
              type="text"
              required
              className="input-field pl-11 py-2"
              placeholder="Universitas Indonesia"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
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
                className="input-field pl-11 py-2"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                <Lock size={18} strokeWidth={1.5} />
              </div>
              <input
                id="password"
                type="password"
                required
                className="input-field pl-11 py-2"
                placeholder="••••••"
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="space-y-1.5 pt-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="role">Account Type</label>
          <select
            id="role"
            className="input-field py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="author">Author (Submit Articles)</option>
            <option value="reviewer">Reviewer (Expert Panel)</option>
            <option value="qa">QA (Quality Assurance)</option>
            <option value="admin">Administrator</option>
            <option value="super-admin">Super Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 font-medium transition-all shadow-sm mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 size={18} className="animate-spin mr-2" /> Memproses...</>
          ) : (
            <>Sign Up <ArrowRight size={18} className="ml-2 opacity-80" strokeWidth={1.5} /></>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
