import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, ChevronRight, Inbox, AlertOctagon, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAssignedArticles } from '../../services/articleService';

const ReviewerDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!currentUser) return;
      try {
        const data = await getAssignedArticles(currentUser.uid);
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [currentUser]);

  // Priority and status logic
  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const target = new Date(deadline);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusInfo = (item) => {
    const daysLeft = getDaysLeft(item.deadline);
    if (item.status === 'reviewed') return { label: 'Completed', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' };
    if (daysLeft !== null && daysLeft <= 3) return { label: 'Urgent', color: 'bg-rose-50 border-rose-100 text-rose-600' };
    return { label: 'In Progress', color: 'bg-blue-50 border-blue-100 text-blue-600' };
  };

  const stats = {
    pending: assignments.filter(a => a.status !== 'reviewed').length,
    urgent: assignments.filter(a => {
        const days = getDaysLeft(a.deadline);
        return a.status !== 'reviewed' && days !== null && days <= 3;
    }).length,
    completed: assignments.filter(a => a.status === 'reviewed').length
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4 animate-in fade-in duration-500">
      
      {/* Welcome Hero Section */}
      <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 mb-8 relative overflow-hidden shadow-lg shadow-slate-900/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-20 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Welcome, {userData?.fullName?.split(' ')[0] || 'Reviewer'}
            </h1>
            <p className="text-slate-400 font-light max-w-lg leading-relaxed text-sm format-sm">
              You have <span className="font-semibold text-white">{stats.pending} pending assignments</span> awaiting your expert analysis.
            </p>
          </div>
          <div className="shrink-0 flex gap-3 text-sm font-medium">
             <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 text-slate-300 flex items-center gap-2">
               <AlertOctagon className="w-4 h-4 text-amber-400" />
               {stats.urgent} Urgent Cases
             </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Inbox className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.pending}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Tasks</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.urgent}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Priority</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{stats.completed}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Reviews</p>
          </div>
        </div>
      </div>

      {/* Review Assignments Table */}
      <div>
        <div className="flex justify-between items-end mb-5 px-1">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Active Assignments</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-5">
           {loading ? (
             <div className="p-20 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-400">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-500" />
               <p className="text-sm">Fetching your assignments...</p>
             </div>
           ) : assignments.length === 0 ? (
             <div className="p-20 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <Inbox className="w-16 h-16 text-slate-100 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No assignments yet</h3>
                <p className="text-slate-500 text-sm max-w-xs">You don't have any manuscripts assigned for review at the moment. We'll notify you when a new one arrives.</p>
             </div>
           ) : assignments.map((assignment) => {
             const status = getStatusInfo(assignment);
             const progress = assignment.reviewProgress || 0;
             return (
               <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-slate-200/70 p-5 hover:border-primary-300 transition-colors group flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  
                  <div className="flex-1 space-y-2">
                     <div className="flex items-center gap-2 mb-1">
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${status.color}`}>
                         {status.label}
                       </span>
                       <span className="text-xs font-mono text-slate-400">...{assignment.id.slice(-6).toUpperCase()}</span>
                     </div>
                     <h3 className="font-semibold text-slate-800 text-base leading-snug line-clamp-2 max-w-2xl">{assignment.title}</h3>
                     <div className="flex items-center gap-5 text-xs text-slate-500 mt-2">
                       <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Field: {assignment.researchField}</span>
                       <span className={`flex items-center gap-1.5 font-medium ${status.label === 'Urgent' ? 'text-rose-600' : ''}`}>
                         <Clock className="w-3.5 h-3.5" /> Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : 'TBD'}
                       </span>
                     </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3 shrink-0">
                    <div className="flex flex-col items-start md:items-end w-full">
                       <div className="flex justify-between w-full md:w-48 mb-1.5">
                         <span className="text-xs font-medium text-slate-500">Progress</span>
                         <span className="text-xs font-bold text-primary-600">{progress}%</span>
                       </div>
                       <div className="w-full md:w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                       </div>
                    </div>
                    
                    <Link 
                      to={`/reviewer/workspace/${assignment.id}`} 
                      className="btn-primary w-full md:w-auto py-2 px-6 flex items-center justify-center gap-2 text-sm mt-2 focus:ring-offset-1 shadow-sm"
                    >
                      {progress > 0 ? 'Continue Review' : 'Start Review'}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default ReviewerDashboard;
