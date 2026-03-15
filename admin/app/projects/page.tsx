"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface Project {
  id: number;
  status: string | null;
  perspective_image: string | null;
  translations?: {
    locale: string;
    name: string;
    location: string;
  }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/projects?per_page=100${search ? `&search=${search}` : ''}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Không thể tải dữ liệu dự án');
      const data = await res.json();
      setProjects(data.data || (Array.isArray(data) ? data : []));
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchProjects, 300);
    return () => clearTimeout(t);
  }, [fetchProjects]);

  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case 'Planning': return { label: 'Lên Kế Hoạch', color: 'bg-amber-500', text: 'text-amber-500' };
      case 'Under Construction': return { label: 'Đang Thi Công', color: 'bg-blue-500', text: 'text-blue-500' };
      case 'Completed': return { label: 'Đã Hoàn Thành', color: 'bg-emerald-500', text: 'text-emerald-500' };
      default: return { label: status || 'Chưa xác định', color: 'bg-slate-500', text: 'text-slate-500' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dự án Bất động sản</h1>
          <p className="text-slate-500 mt-2 text-lg">Giám sát, theo dõi và quản lý danh mục thi công dự án hiện tại</p>
        </div>
        <Link 
          href="/projects/create"
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-primary/20 w-full md:w-auto"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Thêm Dự Án Mới</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all" 
              placeholder="Tìm bằng tên, vị trí hoặc ID..." 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex overflow-x-auto pb-1 -mx-2 px-2 lg:mx-0 lg:px-0 lg:pb-0 gap-2 shrink-0 scrollbar-hide">
            <button className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-sm font-semibold whitespace-nowrap">
              <span>Tất cả Dự án</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-colors whitespace-nowrap border border-slate-200">
              <span className="material-symbols-outlined text-xl">event_upcoming</span>
              <span>Lên Kế Hoạch</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-colors whitespace-nowrap border border-slate-200">
              <span className="material-symbols-outlined text-xl">construction</span>
              <span>Đang Thi Công</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-colors whitespace-nowrap border border-slate-200">
              <span className="material-symbols-outlined text-xl">check_circle</span>
              <span>Đã Hoàn Thành</span>
            </button>
            <div className="h-10 w-px bg-slate-200 mx-2 hidden lg:block"></div>
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold hover:bg-primary/5 transition-colors whitespace-nowrap border border-dashed border-slate-300">
              <span className="material-symbols-outlined text-xl">filter_list</span>
              <span>Bộ Lọc</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex gap-2 items-center">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
             <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <p className="text-slate-500 font-medium">Đang tải dự án...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <span className="material-symbols-outlined text-slate-200 text-7xl mb-4">apartment</span>
             <p className="text-slate-500 font-medium text-xl">Không tìm thấy dự án nào.</p>
             <Link href="/projects/create" className="text-primary font-bold hover:underline mt-2 inline-block">Thêm dự án đầu tiên của bạn</Link>
          </div>
        ) : projects.map((project) => {
          const vi = project.translations?.find(t => t.locale === 'vi') || project.translations?.[0];
          const status = getStatusDisplay(project.status);
          
          return (
            <div key={project.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded-full ${status.color} text-white text-[10px] font-bold uppercase tracking-widest shadow-lg`}>
                    {status.label}
                  </span>
                </div>
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  src={project.perspective_image || `https://ui-avatars.com/api/?name=${vi?.name || project.id}&background=0d9488&color=fff`} 
                  alt={vi?.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                  <Link 
                    href={`/projects/update/${project.id}`}
                    className="flex-1 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg font-bold text-sm border border-white/30 text-center hover:bg-white/40 transition-colors"
                  >
                    Chỉnh sửa
                  </Link>
                  <button className="p-2 bg-red-500/20 backdrop-blur-md text-white rounded-lg border border-red-500/30 hover:bg-red-500/40 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{vi?.name || 'Chưa đặt tên'}</h3>
                  <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-6">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span className="line-clamp-1">{vi?.location || 'Chưa cập nhật vị trí'}</span>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-600">ID Dự án</span>
                    <span className={`font-bold ${status.text}`}>#{project.id}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${status.color} rounded-full`} style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
