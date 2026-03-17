import { useState, useEffect, useRef } from 'react';
import { Bell, Search, FileText, User, Loader2, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { searchArticles, searchUsers } from '../../services/searchService';
import { subscribeToNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';

const Header = ({ title }) => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  
  const user = {
    name: userData?.fullName || 'User',
    role: userData?.role || 'Guest',
    initials: userData?.fullName 
      ? userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : 'U'
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Subscribe to notifications
  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = subscribeToNotifications(currentUser.uid, (data) => {
      setNotifications(data);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Debounced search
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowResults(true);
      try {
        const [articles, users] = await Promise.all([
          searchArticles(searchTerm),
          searchUsers(searchTerm)
        ]);
        setResults([...articles, ...users]);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchTerm('');
    if (result.type === 'article') {
      const path = userData?.role === 'reviewer' ? `/reviewer/workspace/${result.id}` : `/author/submissions/${result.id}`;
      navigate(path);
    } else if (result.type === 'user' && userData?.role === 'admin') {
      navigate(`/admin/users?query=${result.fullName}`);
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(currentUser.uid, notif.id);
    }
    setShowNotifications(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center justify-between px-6 lg:px-8 z-50 sticky top-0">
      <div className="flex-1">
        <h1 className="text-lg font-medium text-slate-800 tracking-tight">{title || 'Dashboard'}</h1>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="hidden md:flex relative group" ref={searchRef}>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            {isSearching ? <Loader2 className="h-4 w-4 text-primary-500 animate-spin" /> : <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" strokeWidth={2} />}
          </div>
          <input
            id="search"
            className="block w-64 lg:w-80 rounded-full border-0 py-1.5 pl-10 pr-10 text-slate-700 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary-500/30 sm:text-sm sm:leading-6 bg-slate-50 focus:bg-white transition-all duration-300"
            placeholder="Search naskah atau user..."
            type="search"
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"><X size={14} /></button>}

          {showResults && (searchTerm.length >= 2) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-[350px] overflow-y-auto p-2">
                {results.length > 0 ? results.map((result) => (
                  <button key={result.id} onClick={() => handleResultClick(result)} className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors text-left">
                    <div className={`p-2 rounded-lg ${result.type === 'article' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {result.type === 'article' ? <FileText size={16} /> : <User size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{result.type === 'article' ? result.title : result.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{result.type === 'article' ? `Author: ${result.authorName || 'Unknown'}` : result.email}</p>
                    </div>
                  </button>
                )) : !isSearching ? (
                  <div className="p-8 text-center text-sm text-slate-500">No results found.</div>
                ) : (
                  <div className="p-8 text-center"><Loader2 size={24} className="animate-spin text-primary-500 mx-auto" /></div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-1.5 rounded-full transition-colors focus:outline-none ${showNotifications ? 'bg-slate-100 text-primary-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notifikasi</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllAsRead(currentUser.uid, notifications)}
                    className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full p-4 flex gap-3 text-left transition-colors border-b border-slate-50 last:border-0 ${notif.isRead ? 'opacity-60 bg-white' : 'bg-blue-50/20'}`}
                    >
                      <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notif.isRead ? 'bg-slate-200' : 'bg-primary-500 animate-pulse'}`}></div>
                      <div>
                        <p className={`text-sm ${notif.isRead ? 'text-slate-600' : 'text-slate-900 font-semibold'}`}>{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                          {notif.createdAt ? new Date(notif.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400 font-medium">Belum ada notifikasi baru</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button className="flex items-center gap-3 focus:outline-none group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700 leading-none">{user.name}</p>
              <p className="text-xs text-slate-400 mt-1 capitalize">{user.role}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm border border-primary-300/30 shadow-sm group-hover:shadow transition-shadow">
              {user.initials}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
