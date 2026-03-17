import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  id: {
    // Nav
    'dashboard': 'Dashboard',
    'submissions': 'Naskah Saya',
    'reviewer_workspace': 'Workspace Reviewer',
    'admin_dashboard': 'Admin Panel',
    'user_management': 'Manajemen Pengguna',
    'assignments': 'Penugasan',
    'logout': 'Keluar',
    
    // Header
    'search_placeholder': 'Cari naskah atau user...',
    'notifications': 'Notifikasi',
    'mark_read': 'Tandai sudah dibaca',
    'no_notifications': 'Belum ada notifikasi baru',
    
    // Common
    'save': 'Simpan',
    'cancel': 'Batal',
    'loading': 'Memuat...',
    'settings': 'Pengaturan',
    'language': 'Bahasa'
  },
  en: {
    // Nav
    'dashboard': 'Dashboard',
    'submissions': 'My Submissions',
    'reviewer_workspace': 'Reviewer Workspace',
    'admin_dashboard': 'Admin Panel',
    'user_management': 'User Management',
    'assignments': 'Assignments',
    'logout': 'Sign Out',
    
    // Header
    'search_placeholder': 'Search articles or users...',
    'notifications': 'Notifications',
    'mark_read': 'Mark as read',
    'no_notifications': 'No new notifications',
    
    // Common
    'save': 'Save',
    'cancel': 'Cancel',
    'loading': 'Loading...',
    'settings': 'Settings',
    'language': 'Language'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('clario_lang') || 'id');

  useEffect(() => {
    localStorage.setItem('clario_lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'id' ? 'en' : 'id');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
