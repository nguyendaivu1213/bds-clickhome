'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MediaPicker from '@/app/components/MediaPicker';
import { slugify } from '@/app/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface Project {
  id: number;
  name: string;
}

export default function CreateZonePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [form, setForm] = useState({
    name: '',
    project_id: '',
    page_title: '',
    slug: '',
    intro_image: '',
    is_overview_page: false,
    status: 'active',
    display_order: 0,
  });

  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${API_BASE}/projects?per_page=1000`, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const items = (data.data || data) as any[];
          setProjects(items.map(item => {
            const trans = item.translations?.find((t: any) => t.locale === 'vi') || item.translations?.[0];
            return {
              id: item.id,
              name: item.name || trans?.name || `Project ${item.id}`
            };
          }));
        }
      } catch (err) {
        console.error('Lỗi khi tải dự án:', err);
      }
    }
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!form.project_id) {
      setErrors({ project_id: 'Vui lòng chọn dự án' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/zones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          project_id: parseInt(form.project_id),
          display_order: parseInt(form.display_order.toString()),
        })
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) {
        if (data.errors) {
          const flatErrors: Record<string, string> = {};
          Object.entries(data.errors).forEach(([k, v]) => {
            flatErrors[k] = (v as string[])[0];
          });
          setErrors(flatErrors);
          return;
        }
        throw new Error(data.message || 'Lỗi server');
      }

      router.push('/zones');
      router.refresh();
    } catch (err: any) {
      setErrors({ _global: err.message || 'Không thể kết nối đến máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, placeholder: string, type = 'text', hint?: string, extraOnChange?: (val: string) => void) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        type={type}
        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}`}
        placeholder={placeholder}
        value={(form as any)[key]}
        onChange={e => { 
          const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
          setForm(prev => ({ ...prev, [key]: val })); 
          setErrors(prev => ({ ...prev, [key]: '' }));
          if (extraOnChange && typeof val === 'string') extraOnChange(val);
        }}
      />
      {errors[key] && <p className="text-xs text-red-500 font-medium">{errors[key]}</p>}
      {hint && !errors[key] && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 lg:px-6">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link href="/zones" className="flex items-center justify-center size-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">Thêm Phân Khu Mới</h1>
          <p className="text-slate-500 text-sm">Điền thông tin bên dưới để tạo phân khu cho dự án.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {errors._global && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex gap-3">
            <span className="material-symbols-outlined">error</span>
            {errors._global}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Thuộc Dự Án *</label>
              <select
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.project_id ? 'border-red-400' : 'border-slate-200'}`}
                value={form.project_id}
                onChange={e => setForm({ ...form, project_id: e.target.value })}
              >
                <option value="">-- Chọn dự án --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.project_id && <p className="text-xs text-red-500 font-medium">{errors.project_id}</p>}
            </div>

            {field('Tên Phân Khu *', 'name', 'Vd: The Landmark', 'text', undefined, (val) => {
              setForm(prev => ({ ...prev, slug: slugify(val), page_title: val }));
            })}
            {field('Đường Dẫn (URL) *', 'slug', 'Vd: the-landmark', 'text', 'Viết liền không dấu')}
            {field('Tiêu Đề Trang', 'page_title', 'Tiêu đề hiển thị trên trình duyệt')}
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Trạng Thái</label>
              <div className="grid grid-cols-2 gap-3">
                {(['active', 'inactive'] as const).map(s => (
                  <label key={s} className={`flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer transition-all text-sm font-semibold ${form.status === s ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <input type="radio" className="hidden" name="status" value={s} checked={form.status === s} onChange={() => setForm({ ...form, status: s })} />
                    <span className={`size-2 rounded-full ${s === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                    {s === 'active' ? 'Hoạt Động' : 'Tạm Ngưng'}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-700">Là Trang Tổng Quan (Overview)?</label>
              <button 
                type="button"
                onClick={() => setForm({...form, is_overview_page: !form.is_overview_page})}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${form.is_overview_page ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}
              >
                <span className="material-symbols-outlined">{form.is_overview_page ? 'toggle_on' : 'toggle_off'}</span>
                <span className="text-sm font-bold">{form.is_overview_page ? 'Đang bật' : 'Đang tắt'}</span>
              </button>
            </div>

            {field('Thứ Tự Hiển Thị', 'display_order', '0', 'number')}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-8 border-t border-slate-100 mb-8">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">image</span>
            Ảnh Giới Thiệu
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="size-48 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 transition-all hover:bg-slate-100/50">
              {form.intro_image ? (
                <img src={form.intro_image} className="w-full h-full object-cover" alt="Intro" />
              ) : (
                <span className="material-symbols-outlined text-slate-300 text-[60px]">add_photo_alternate</span>
              )}
            </div>
            <div className="flex-1 w-full flex flex-col gap-4">
              <input 
                type="text" 
                className="w-full border border-slate-200 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                placeholder="URL hình ảnh giới thiệu..." 
                value={form.intro_image}
                onChange={e => setForm({...form, intro_image: e.target.value})}
              />
              <div className="flex flex-wrap gap-2">
                <button 
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">photo_library</span>
                  Chọn từ thư viện
                </button>
                {form.intro_image && (
                  <button
                    type="button"
                    onClick={() => setForm({...form, intro_image: ''})}
                    className="px-4 py-3 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                  >
                    Loại bỏ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-slate-100">
          <Link href="/zones" className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors text-center">
            Hủy Bỏ
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <><span className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Đang lưu...</>
            ) : (
              <><span className="material-symbols-outlined text-[20px]">save</span> Lưu Phân Khu</>
            )}
          </button>
        </div>
      </form>

      <MediaPicker 
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          setForm({ ...form, intro_image: url });
          setPickerOpen(false);
        }}
        title="Chọn Ảnh Giới Thiệu"
      />
    </div>
  );
}
