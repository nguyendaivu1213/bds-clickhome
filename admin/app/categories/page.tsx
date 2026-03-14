'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface Category {
  id: number;
  title: string;
  url: string;
  status: 'active' | 'inactive';
  data_type?: string | null;
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

function normaliseCategory(raw: any): Category {
  const viTrans = raw.translations?.find((t: any) => t.locale === 'vi') ?? raw.translations?.[0];
  return {
    id: raw.id,
    title: raw.title ?? viTrans?.title ?? '(chưa có tên)',
    url: raw.url ?? viTrans?.url ?? '',
    status: raw.status ?? 'active',
    data_type: raw.data_type,
  };
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await apiFetch(`/categories?per_page=500${search ? `&search=${search}` : ''}`);
      const items = data.data ?? data;
      setCategories((Array.isArray(items) ? items : []).map(normaliseCategory));
    } catch {
      setFetchError('Không thể tải dữ liệu chuyên mục từ máy chủ.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchCategories, 300);
    return () => clearTimeout(t);
  }, [fetchCategories]);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">Quản Lý Chuyên Mục</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Quản lý và sắp xếp các thẻ và danh mục bài viết cho hệ thống.</p>
        </div>
        <Link href="/categories/create" className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all w-full sm:w-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Thêm Chuyên Mục</span>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 mb-6 sm:mb-8 shadow-sm">
        <div className="w-full">
          <div className="flex w-full items-stretch rounded-lg h-12 bg-slate-50 border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary overflow-hidden">
            <div className="text-slate-400 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="flex w-full border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-400 text-slate-700 px-4 text-sm sm:text-base font-normal outline-none" 
              placeholder="Tìm tên chuyên mục..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3 text-amber-800">
          <span className="material-symbols-outlined">warning</span>
          <p className="font-medium text-sm">{fetchError}</p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Tên Chuyên Mục</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider hidden sm:table-cell whitespace-nowrap">Đường Dẫn (URL)</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Trạng Thái</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider text-right whitespace-nowrap">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 bg-slate-50/50">Không tìm thấy chuyên mục nào.</td>
                  </tr>
                ) : categories.map((item) => {
                  const isActive = item.status === 'active';
                  const bg = isActive ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100";
                  const color = isActive ? "text-emerald-700" : "text-red-700";
                  const dot = isActive ? "bg-emerald-500" : "bg-red-500";
                  
                  return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4 sm:py-5 max-w-[200px] sm:max-w-none">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold text-sm truncate">{item.title}</span>
                        {item.data_type && <span className="text-slate-400 text-xs mt-0.5">{item.data_type}</span>}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 hidden sm:table-cell">
                      <span className="text-slate-500 text-sm font-mono truncate max-w-xs block">
                        /{item.url}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <span className={`inline-flex items-center border gap-1.5 rounded-full ${bg} px-3 py-1 text-xs font-bold ${color} whitespace-nowrap`}>
                        <span className={`size-1.5 rounded-full ${dot}`}></span>
                        {isActive ? 'Hoạt Động' : 'Tạm Ngưng'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Link href={`/categories/update/${item.id}`} className="p-1 sm:p-1.5 text-slate-400 hover:text-primary transition-colors bg-white rounded-md shadow-sm border border-slate-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">edit</span>
                        </Link>
                        <Link href={`/categories/delete/${item.id}`} className="p-1 sm:p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-md shadow-sm border border-slate-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">delete</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
