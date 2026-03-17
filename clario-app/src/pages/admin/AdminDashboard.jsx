import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Activity, PlayCircle, Settings, ClipboardList, Loader2 } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { getAllUsers } from '../../services/userService';
import { getAllArticles } from '../../services/articleService';
import { useAuth } from '../../context/AuthContext';
import MarketHotspots from '../../components/dashboard/MarketHotspots';

const CHART_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    activeReviewers: 0
  });
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [users, articles] = await Promise.all([
        getAllUsers(),
        getAllArticles()
      ]);
      
      // Calculate basic stats
      const reviewers = users.filter(u => u.role === 'reviewer');
      const activeReviewers = reviewers.filter(u => u.isActive !== false).length;
      
      setStats({
        users: users.length,
        articles: articles.length,
        activeReviewers: activeReviewers
      });

      // 1. Process Trend Data (Last 6 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendMap = {};
      
      articles.forEach(art => {
        if (art.createdAt) {
          const date = new Date(art.createdAt.seconds * 1000);
          const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
          trendMap[monthYear] = (trendMap[monthYear] || 0) + 1;
        }
      });

      // Convert to array and sort (very basic sort)
      const trendArray = Object.entries(trendMap).map(([name, total]) => ({ name, total }));
      setChartData(trendArray.length > 0 ? trendArray : [{ name: 'No data', total: 0 }]);

      // 2. Process Category Data
      const categoryMap = {};
      articles.forEach(art => {
        const field = art.researchField || 'General';
        categoryMap[field] = (categoryMap[field] || 0) + 1;
      });

      const catArray = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
      setCategoryData(catArray);

    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isSuperAdmin = userData?.role === 'super-admin';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistem informasi utama dan kontrol seluruh platform CLARIO.</p>
        </div>
        <div className="flex gap-2">
            <button className="btn-secondary text-sm px-4 py-2">Unduh Laporan</button>
            <Link to="/admin/assignments" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
              <ClipboardList size={16} /> Kelola Penugasan
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 rounded-xl text-white shadow-soft relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                 <Users size={120} strokeWidth={1} />
             </div>
             <div className="relative z-10">
                 <p className="text-indigo-100 font-medium mb-1">Total Pengguna Terdaftar</p>
                 <h3 className="text-4xl font-bold tracking-tight mb-4">
                   {loading ? <Loader2 className="animate-spin inline" size={24} /> : stats.users.toLocaleString()}
                 </h3>
                 <Link to="/admin/users" className="flex items-center text-sm font-medium gap-1 text-indigo-50 hover:text-white transition-colors cursor-pointer">
                     Kelola Pengguna <PlayCircle size={16} className="ml-1" />
                 </Link>
             </div>
        </div>

        {/* Total Manuscripts */}
        <div className="bg-gradient-to-br from-sky-500 to-sky-700 p-6 rounded-xl text-white shadow-soft relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                 <BookOpen size={120} strokeWidth={1} />
             </div>
             <div className="relative z-10">
                 <p className="text-sky-100 font-medium mb-1">Total Naskah Diproses</p>
                 <h3 className="text-4xl font-bold tracking-tight mb-4">
                    {loading ? <Loader2 className="animate-spin inline" size={24} /> : stats.articles.toLocaleString()}
                 </h3>
                 <div className="flex items-center text-sm font-medium gap-1 text-sky-50 transition-colors">
                     Data Naskah Dinamis <Activity size={16} className="ml-1" />
                 </div>
             </div>
        </div>

        {/* Active Reviewers */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-xl text-white shadow-soft relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                 <Activity size={120} strokeWidth={1} />
             </div>
             <div className="relative z-10">
                 <p className="text-emerald-100 font-medium mb-1">Reviewer Aktif</p>
                 <h3 className="text-4xl font-bold tracking-tight mb-4">
                    {loading ? <Loader2 className="animate-spin inline" size={24} /> : stats.activeReviewers.toLocaleString()}
                 </h3>
                 <div className="flex items-center text-sm font-medium gap-1 text-emerald-50 transition-colors">
                     Pantau Kinerja <PlayCircle size={16} className="ml-1" />
                 </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MarketHotspots />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 h-96 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="font-bold text-slate-800">Tren Pengiriman Naskah</h2>
                 <button className="text-slate-400 hover:text-slate-600"><Settings size={18} /></button>
            </div>
            <div className="flex-1 p-6">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-300"><Loader2 className="animate-spin" /></div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 'bold' }}
                            />
                            <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-xl shadow-soft border border-slate-100 h-96 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="font-bold text-slate-800">Distribusi Kategori Jurnal</h2>
                 <button className="text-slate-400 hover:text-slate-600"><Settings size={18} /></button>
            </div>
            <div className="flex-1 p-6">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-slate-300"><Loader2 className="animate-spin" /></div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
       </div>
    </div>
  );
};

export default AdminDashboard;
