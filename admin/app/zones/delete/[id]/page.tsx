'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

export default function DeleteZonePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchZone() {
      try {
        const res = await fetch(`${API_BASE}/zones/${id}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error('Không thể tải dữ liệu phân khu');
        const data = await res.json();
        const trans = data.translations?.find((t: any) => t.locale === 'vi') || data.translations?.[0];
        setZoneName(trans?.name || `ID: ${id}`);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchZone();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/zones/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Không thể xóa phân khu này');
      
      router.push('/zones');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Lỗi server');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 lg:px-6 py-10 sm:py-20">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl text-center">
        <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">delete_forever</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Xác Nhận Xóa Phân Khu</h1>
        <p className="text-slate-500 mb-8 text-lg leading-relaxed">
          Bạn có chắc chắn muốn xóa phân khu <span className="font-bold text-slate-800">"{zoneName}"</span>? 
          <br />Thao tác này không thể hoàn tác.
        </p>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/zones" className="px-8 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all order-2 sm:order-1">
            Quay lại
          </Link>
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="px-8 py-4 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-70"
          >
            {deleting ? (
              <><span className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Đang xóa...</>
            ) : (
              'Xác nhận xóa'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
