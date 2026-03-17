import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  UploadCloud, 
  CheckSquare, 
  LogOut,
  Users,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({ role: propRole }) => {
  const navigate = useNavigate();
  const { logout, userData } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  
  // Use role from userData if available, otherwise fallback to prop
  const role = userData?.role || propRole || 'author';
  
  const navigation = {
    author: [
      { name: t('dashboard'), href: '/author', icon: Home },
      { name: 'Upload Naskah', href: '/author/upload', icon: UploadCloud },
      { name: t('submissions'), href: '/author/submissions', icon: FileText },
    ],
    reviewer: [
      { name: 'Workspace', href: '/reviewer', icon: CheckSquare },
      { name: 'Riwayat Review', href: '/reviewer/history', icon: FileText },
    ],
    qa: [
      { name: 'QA Dashboard', href: '/qa', icon: Home },
      { name: 'Antrean QA', href: '/qa/queue', icon: CheckSquare },
    ],
    admin: [
      { name: t('dashboard'), href: '/admin', icon: Home },
      { name: 'Assignment Board', href: '/admin/assignments', icon: CheckSquare },
      { name: t('user_management'), href: '/admin/users', icon: Users },
    ],
    'super-admin': [
      { name: t('dashboard'), href: '/admin', icon: Home },
      { name: 'Assignment Board', href: '/admin/assignments', icon: CheckSquare },
      { name: t('user_management'), href: '/admin/users', icon: Users },
    ]
  };

  const navLinks = navigation[role] || [];
  
  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="w-64 flex-shrink-0 bg-slate-900 h-screen flex flex-col z-50 relative border-r border-slate-800">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-lg font-bold tracking-wider">CLARIO</span>
        </div>
      </div>
      
      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="px-3 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          Menu Utama
        </div>
        <nav className="space-y-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary-600/10 text-primary-400 border-l-2 border-primary-500' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'}
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Bottom Footer */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            <span>{t('language')}</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-primary-400">
            {lang}
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
