import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Author Pages
import AuthorDashboard from './pages/author/AuthorDashboard';
import UploadArticle from './pages/author/UploadArticle';
import ArticleDetail from './pages/author/ArticleDetail';
import Submissions from './pages/author/Submissions';

// Reviewer Pages
import ReviewerDashboard from './pages/reviewer/ReviewerDashboard';
import ReviewerWorkspace from './pages/reviewer/ReviewerWorkspace';
import History from './pages/reviewer/History';

// QA Pages
import QADashboard from './pages/qa/QADashboard';
import QAQueue from './pages/qa/QAQueue';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAssignments from './pages/admin/AdminAssignments';
import UserManagement from './pages/admin/UserManagement';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Routes>
        {/* Auth Routes (Public) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        {/* Protected Dashboard Routes based on roles */}
        
        {/* Author Routes */}
        <Route element={<ProtectedRoute allowedRoles={['author']} />}>
          <Route path="/author" element={<DashboardLayout />}>
            <Route index element={<AuthorDashboard />} />
            <Route path="upload" element={<UploadArticle />} />
            <Route path="article/:id" element={<ArticleDetail />} />
            <Route path="submissions" element={<Submissions />} />
          </Route>
        </Route>

        {/* Reviewer Routes */}
        <Route element={<ProtectedRoute allowedRoles={['reviewer']} />}>
          <Route path="/reviewer">
            <Route element={<DashboardLayout />}>
              <Route index element={<ReviewerDashboard />} />
              <Route path="history" element={<History />} />
            </Route>
            <Route path="workspace/:id" element={<ReviewerWorkspace />} />
          </Route>
        </Route>

        {/* QA Routes */}
        <Route element={<ProtectedRoute allowedRoles={['qa']} />}>
          <Route path="/qa" element={<DashboardLayout />}>
            <Route index element={<QADashboard />} />
            <Route path="queue" element={<QAQueue />} />
          </Route>
        </Route>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'super-admin']} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          {/* Alias for super-admin to use the same dashboard */}
          <Route path="/super-admin" element={<Navigate to="/admin" replace />} />
        </Route>
        
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
