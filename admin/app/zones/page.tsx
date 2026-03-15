'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface ProjectZone {
  id: number;
  project_id: number;
  intro_image?: string;
  is_overview_page: boolean;
  status: string;
  display_order: number;
  project?: {
    id: number;
    translations?: any[];
  };
  translations?: any[];
}

export default function ZonesPage() {
  const [zones, setZones] = useState<ProjectZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchZones = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/zones?per_page=100${search ? `&search=${search}` : ''}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Không thể tải dữ liệu phân khu');
      const data = await res.json();
      setZones(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchZones, 300);
    return () => clearTimeout(t);
  }, [fetchZones]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-6 mb-4 lg:mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Phân Khu Dự Án</h1>
          <p className="text-slate-500 mt-1 lg:mt-2 text-base lg:text-lg">Quản lý các zone, phân khu khu vực nhỏ lẻ trong các siêu dự án Bất Động Sản.</p>
        </div>
        <Link href="/zones/create" className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto">
          <span className="material-symbols-outlined">add</span>
          <span>Thêm Phân Khu</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 lg:p-4 mb-6 lg:mb-8 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all" 
              placeholder="Tìm phân khu bằng tên..." 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex gap-2 items-center">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4">
            <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium">Đang tải phân khu...</p>
          </div>
        ) : zones.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">maps_home_work</span>
            <p className="text-slate-500 font-medium text-lg">Không tìm thấy phân khu nào.</p>
          </div>
        ) : zones.map((zone) => {
          const trans = zone.translations?.find((t: any) => t.locale === 'vi') || zone.translations?.[0];
          const projectTrans = zone.project?.translations?.find((t: any) => t.locale === 'vi') || zone.project?.translations?.[0];
          const isActive = zone.status === 'active';
          
          return (
            <div key={zone.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col relative">
              <div className="relative h-40 overflow-hidden">
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-md ${isActive ? 'bg-emerald-500' : 'bg-slate-400'} text-white text-[10px] font-bold uppercase tracking-widest shadow-md`}>
                    {isActive ? 'Hoạt động' : 'Tạm ngưng'}
                  </span>
                </div>
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src={zone.intro_image || `https://ui-avatars.com/api/?name=${trans?.name || zone.id}&background=334155&color=fff`} 
                  alt={trans?.name} 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link href={`/zones/update/${zone.id}`} className="size-9 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </Link>
                  <Link href={`/zones/delete/${zone.id}`} className="size-9 bg-white rounded-lg flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </Link>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 truncate">
                  {projectTrans?.name || `Project ID: ${zone.project_id}`}
                </p>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2 line-clamp-1">{trans?.name}</h3>
                <div className="mt-auto flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <span className="font-medium text-slate-500">Overview Page:</span>
                  <span className="material-symbols-outlined text-lg" style={{ color: zone.is_overview_page ? '#10b981' : '#cbd5e1' }}>
                    {zone.is_overview_page ? "toggle_on" : "toggle_off"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

