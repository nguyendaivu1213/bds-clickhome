"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create"|"update">("create");
  const [formData, setFormData] = useState({ id: "", name: "", email: "", password: "", selectedRoles: [] as string[] });
  
  // API requests Need tokens
  const getToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; admin_session=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return "";
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`, { 
         headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` } 
      });
      if (res.ok) setUsers(await res.json());
    } catch(err) { console.error(err); }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_BASE}/roles`, { 
         headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` } 
      });
      if (res.ok) setRoles((await res.json()).roles);
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleOpenModal = (user?: any) => {
    if (user) {
      setModalMode("update");
      setFormData({
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        password: "",
        selectedRoles: user.roles?.map((r:any) => r.name) || []
      });
    } else {
      setModalMode("create");
      setFormData({ id: "", name: "", email: "", password: "", selectedRoles: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalMode === "create" ? `${API_BASE}/users` : `${API_BASE}/users/${formData.id}`;
    const method = modalMode === "create" ? "POST" : "PUT";
    
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
           name: formData.name,
           email: formData.email,
           password: formData.password || undefined,
           roles: formData.selectedRoles
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.message || "Có lỗi xảy ra");
      }
    } catch(e) { console.error(e) }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Xoá quản trị viên này?")) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` }
      });
      if(res.ok) fetchUsers();
      else alert("Không thể xoá tài khoản này.");
    } catch(e) { console.error(e) }
  };

  const toggleRole = (roleName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: prev.selectedRoles.includes(roleName) 
        ? prev.selectedRoles.filter(r => r !== roleName)
        : [...prev.selectedRoles, roleName]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Quản lý Quản trị viên</h1>
          <p className="text-sm text-slate-500 mt-1">Vai trò & tài khoản hệ thống</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm Quản trị viên
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100 font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Tên</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Vai trò (Roles)</th>
                <th className="px-6 py-4 text-right">Lưu vết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {loading && <tr><td colSpan={4} className="p-8 text-center text-slate-400">Đang tải...</td></tr>}
              {!loading && users.map((user: any) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.roles?.map((r: any) => (
                        <span key={r.id} className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md">
                          {r.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(user)} className="text-primary hover:text-primary-dark font-medium mr-4">Sửa</button>
                    {user.id !== 1 && <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700 font-medium">Xoá</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">{modalMode === 'create' ? 'Thêm Quản trị viên mới' : 'Cập nhật thông tin'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white shadow-sm p-1.5 rounded-xl border border-slate-100 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Họ tên</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                  <input required type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mật khẩu {modalMode === 'update' && '(Bỏ trống nếu không đổi)'}</label>
                  <input type="password" required={modalMode === 'create'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 mt-6">Phân quyền (Vai trò)</label>
                  <div className="flex flex-wrap gap-2">
                     {roles.map((role: any) => (
                       <label key={role.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer border-slate-200 hover:border-primary transition-all ${formData.selectedRoles.includes(role.name) ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-white'}`}>
                         <input type="checkbox" className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                           checked={formData.selectedRoles.includes(role.name)}
                           onChange={() => toggleRole(role.name)}
                         />
                         <span className="text-sm font-bold text-slate-700">{role.name}</span>
                       </label>
                     ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Huỷ</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-sm shadow-primary/30">
                  {modalMode === 'create' ? 'Tạo tài khoản' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
