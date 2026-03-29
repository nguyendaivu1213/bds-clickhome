"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

export default function RolesPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create"|"update">("create");
  const [formData, setFormData] = useState({ id: "", name: "", selectedPermissions: [] as string[] });

  const getToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; admin_session=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return "";
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/roles`, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` } });
      if (res.ok) {
        const data = await res.json();
        setRoles(data.roles);
        setAllPermissions(data.all_permissions);
      }
    } catch(err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchRoles(); }, []);

  const handleOpenModal = (role?: any) => {
    if (role) {
      setModalMode("update");
      setFormData({
        id: role.id,
        name: role.name,
        selectedPermissions: role.permissions?.map((p:any) => p.name) || []
      });
    } else {
      setModalMode("create");
      setFormData({ id: "", name: "", selectedPermissions: [] });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = modalMode === "create" ? `${API_BASE}/roles` : `${API_BASE}/roles/${formData.id}`;
    const method = modalMode === "create" ? "POST" : "PUT";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${getToken()}` },
        body: JSON.stringify({
           name: formData.name,
           permissions: formData.selectedPermissions
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchRoles();
      } else {
        const err = await res.json();
        alert(err.message || "Có lỗi xảy ra");
      }
    } catch(e) { console.error(e) }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Xoá vai trò này?")) return;
    try {
      const res = await fetch(`${API_BASE}/roles/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${getToken()}` } });
      if(res.ok) fetchRoles();
      else alert("Không thể xoá vai trò Super Admin hoặc có lỗi.");
    } catch(e) { console.error(e) }
  };

  const togglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(perm) 
        ? prev.selectedPermissions.filter(p => p !== perm)
        : [...prev.selectedPermissions, perm]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-8 mb-[200px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Phân quyền (Roles)</h1>
          <p className="text-sm text-slate-500 mt-1">Vai trò thành viên</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm Vai trò
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && <div className="col-span-3 text-center py-10 text-slate-400">Đang tải...</div>}
        {!loading && roles.map((role: any) => (
          <div key={role.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 relative">
                <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">shield_person</span>
                <h3 className="text-lg font-bold text-slate-900">{role.name}</h3>
              </div>
              <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(role)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  {role.name !== 'Super Admin' && (
                    <button onClick={() => handleDelete(role.id)} className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  )}
              </div>
            </div>
            
            <div className="flex-1 mt-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Quyền hạn ({role.permissions?.length || 0})</p>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions?.map((p: any) => (
                  <span key={p.id} className="px-2 py-1 bg-slate-50 text-slate-600 border border-slate-100 text-[10px] uppercase font-bold tracking-widest rounded-lg">
                    {p.name.replace('manage_', '')}
                  </span>
                ))}
                {(!role.permissions || role.permissions.length === 0) && <span className="text-sm text-slate-400 italic">Chưa cấp quyền nào</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">{modalMode === 'create' ? 'Tạo Vai Trò mới' : 'Cập nhật phân quyền'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white shadow-sm p-1.5 rounded-xl border border-slate-100 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tên vai trò <span className="text-red-500">*</span></label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={formData.name === 'Super Admin'} />
                </div>
                
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Cấp Quyền Hạn (Permissions)</label>
                  <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 pb-2">
                     {allPermissions.map((perm: string) => (
                       <label key={perm} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer border-slate-200 hover:border-primary transition-all ${formData.selectedPermissions.includes(perm) ? 'bg-primary/5 border-primary ring-1 ring-primary' : 'bg-white'}`}>
                         <input type="checkbox" className="w-4 h-4 mt-0.5 text-primary rounded border-slate-300 focus:ring-primary"
                           checked={formData.selectedPermissions.includes(perm)}
                           onChange={() => togglePermission(perm)}
                         />
                         <span className="text-sm font-bold text-slate-700 leading-tight">{perm}</span>
                       </label>
                     ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Huỷ</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-sm shadow-primary/30">
                  {modalMode === 'create' ? 'Tạo vai trò' : 'Lưu quyền hạn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
