import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

// Static title map for demonstration purposes
const getPageTitle = (pathname) => {
  if (pathname.includes('/author/upload')) return 'Upload Naskah';
  if (pathname.includes('/author/submissions')) return 'Naskah Saya';
  if (pathname.includes('/author')) return 'Author Dashboard';
  
  if (pathname.includes('/reviewer/history')) return 'Riwayat Review';
  if (pathname.includes('/reviewer')) return 'Reviewer Workspace';
  
  if (pathname.includes('/qa/queue')) return 'Antrean QA';
  if (pathname.includes('/qa')) return 'Master Reviewer Dashboard';
  
  if (pathname.includes('/admin/assignments')) return 'Assignment Board';
  if (pathname.includes('/admin/users')) return 'Manajemen Pengguna';
  if (pathname.includes('/admin')) return 'Admin Dashboard';
  
  return 'Dashboard';
};

const DashboardLayout = () => {
  const location = useLocation();
  const { userData } = useAuth();
  const pageTitle = getPageTitle(location.pathname);
  
  // Safeguard: use role from context, fallback to path if needed
  const role = userData?.role || (location.pathname.startsWith('/admin') ? 'admin' : 'author');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar role={role} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title={pageTitle} />
        
        {/* Main Workspace content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
