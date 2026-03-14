'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

export default function DeleteCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<{ id: number; title: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Không thể tải thông tin chuyên mục');
      const data = await res.json();
      
      const viTrans = data.translations?.find((t: any) => t.locale === 'vi') ?? data.translations?.[0];
      setCategory({
        id: data.id,
        title: data.title ?? viTrans?.title ?? `Chuyên mục #${data.id}`
      });
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  const handleDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        throw new Error(data.message || 'Lỗi khi xóa chuyên mục');
      }

      router.push('/categories');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa chuyên mục.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 lg:px-6">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link href="/categories" className="flex items-center justify-center size-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">Xóa Chuyên Mục</h1>
          <p className="text-slate-500 text-sm">Xác nhận việc gỡ bỏ chuyên mục khỏi hệ thống.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[40px]">warning</span>
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2">Bạn có chắc chắn muốn xóa?</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Chuyên mục <strong className="text-slate-900">"{category?.title}"</strong> sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
        </p>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex gap-3 text-left">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/categories" className="px-8 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors">
            Hủy Bỏ
          </Link>
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="px-8 py-3.5 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/25 hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {deleting ? (
              <><span className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Đang xóa...</>
            ) : (
              <><span className="material-symbols-outlined text-[20px]">delete</span> Xác Nhận Xóa</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
