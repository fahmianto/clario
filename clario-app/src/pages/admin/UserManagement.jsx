import React, { useEffect, useState } from 'react';
import { Search, UserPlus, Filter, MoreVertical, Shield, UserCog, Mail, Loader2, RefreshCcw } from 'lucide-react';
import { getAllUsers, updateUserRole, updateUserStatus } from '../../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      fetchUsers(); // Refresh
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      fetchUsers(); // Refresh
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.institution?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data Author, Reviewer, QA, dan administrator platform.</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={fetchUsers} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <UserPlus size={16} /> Tambah Pengguna Baru
          </button>
        </div>
      </div>

       <div className="bg-white rounded-xl shadow-soft border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} strokeWidth={1.5} />
            </div>
            <input
              type="text"
              className="input-field pl-10 h-10 py-1"
              placeholder="Cari nama, email, atau institusi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
             <select 
               className="input-field h-10 py-1 text-sm bg-white"
               value={filterRole}
               onChange={(e) => setFilterRole(e.target.value)}
             >
               <option value="All">Semua Peran</option>
               <option value="author">Author</option>
               <option value="reviewer">Reviewer</option>
               <option value="qa">QA</option>
               <option value="super-admin">Admin</option>
             </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium pl-6">Pengguna</th>
                <th scope="col" className="px-6 py-4 font-medium">Peran</th>
                <th scope="col" className="px-6 py-4 font-medium">Institusi</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
                    <p className="text-slate-400">Memuat data pengguna...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                   <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                             <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex justify-center items-center text-white font-bold uppercase overflow-hidden border border-slate-200 shadow-inner">
                                 {user.fullName?.charAt(0)}
                             </div>
                             <div className="ml-4">
                                <div className="text-sm font-semibold text-slate-800">{user.fullName}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Mail size={12}/> {user.email}</div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              user.role === 'super-admin' ? 'bg-indigo-100 text-indigo-700' :
                              user.role === 'qa' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'reviewer' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                              {user.role}
                          </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                          {user.institution || '-'}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex h-2.5 w-2.5 rounded-full mr-2 ${user.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {user.isActive !== false ? 'Active' : 'Suspended'}
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-1">
                              <button className="text-slate-400 hover:text-primary-600 p-1.5 transition-colors" title="Ubah Profil">
                                  <UserCog size={18} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(user.id, user.isActive !== false)}
                                className={`p-1.5 transition-colors ${user.isActive !== false ? 'text-slate-400 hover:text-rose-600' : 'text-rose-400 hover:text-emerald-600'}`} 
                                title={user.isActive !== false ? 'Suspend User' : 'Activate User'}
                              >
                                  <Shield size={18} />
                              </button>
                              <button className="text-slate-400 hover:text-slate-700 p-1.5 transition-colors" title="Lainnya">
                                  <MoreVertical size={18} />
                              </button>
                          </div>
                       </td>
                    </tr>
                ))}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
               <div>Menampilkan {filteredUsers.length} dari {users.length} entri</div>
               <div className="flex gap-2">
                   <button className="btn-secondary px-3 py-1 disabled:opacity-50" disabled>Sebelumnya</button>
                   <button className="btn-secondary px-3 py-1 disabled:opacity-50" disabled>Selanjutnya</button>
               </div>
          </div>
        </div>
       </div>
    </div>
  );
};

export default UserManagement;
