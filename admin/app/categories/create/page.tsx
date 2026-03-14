'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MediaPicker from '@/app/components/MediaPicker';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface Category {
  id: number;
  title: string;
}

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [selectionLists, setSelectionLists] = useState<any[]>([]);
  
  const [form, setForm] = useState({
    title: '',
    url: '',
    data_type: 'Tin tức',
    display_position: '',
    status: 'active',
    description: '',
    parent_id: '',
    menu_image: '',
    icon_image: '',
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeImageField, setActiveImageField] = useState<'menu_image' | 'icon_image' | null>(null);

  useEffect(() => {
    async function fetchParents() {
      try {
        const res = await fetch(`${API_BASE}/categories?per_page=500`, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const items = (data.data ?? data) as any[];
          setParentCategories(items.map(item => {
            const trans = item.translations?.find((t: any) => t.locale === 'vi') ?? item.translations?.[0];
            return {
              id: item.id,
              title: item.title ?? trans?.title ?? `Category ${item.id}`
            };
          }));
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách chuyên mục cha:', err);
      }
    }
    async function fetchSettings() {
      try {
        const res = await fetch(`${API_BASE}/settings`, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          setSelectionLists(data.dynamic_selections || []);
        }
      } catch (err) {
        console.error('Lỗi khi tải cài đặt:', err);
      }
    }
    fetchParents();
    fetchSettings();
  }, []);

  const dataTypeList = selectionLists.find(l => l.key === 'category_data_type')?.options || [
    { label: 'Tin tức', value: 'Tin tức' },
    { label: 'Dự án', value: 'Dự án' },
    { label: 'Giới thiệu', value: 'Giới thiệu' },
    { label: 'Khác', value: 'Khác' },
  ];

  const positionList = selectionLists.find(l => l.key === 'display_position')?.options || [
    { label: 'Đầu trang (Top)', value: 'top' },
    { label: 'Chân trang (Footer)', value: 'footer' },
    { label: 'Thanh bên (Sidebar)', value: 'sidebar' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          parent_id: form.parent_id === '' ? null : parseInt(form.parent_id)
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

      router.push('/categories');
      router.refresh();
    } catch (err: any) {
      setErrors({ _global: err.message || 'Không thể kết nối đến máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof form, placeholder: string, type = 'text', hint?: string) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}`}
          placeholder={placeholder}
          value={(form as any)[key]}
          onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
        />
      ) : (
        <input
          type={type}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}`}
          placeholder={placeholder}
          value={(form as any)[key]}
          onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
        />
      )}
      {errors[key] && <p className="text-xs text-red-500 font-medium">{errors[key]}</p>}
      {hint && !errors[key] && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 lg:px-6">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link href="/categories" className="flex items-center justify-center size-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">Thêm Chuyên Mục Mới</h1>
          <p className="text-slate-500 text-sm">Điền thông tin bên dưới để tạo chuyên mục hiển thị trên website.</p>
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
            {field('Tên Chuyên Mục *', 'title', 'Vd: Tin Thị Trường')}
            {field('Đường Dẫn (URL) *', 'url', 'Vd: tin-thi-truong', 'text', 'Viết liền không dấu, dùng dấu gạch ngang phân cách')}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Loại Dữ Liệu</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={form.data_type}
                onChange={e => setForm({ ...form, data_type: e.target.value })}
              >
                {dataTypeList.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Chuyên Mục Cha</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={form.parent_id}
                onChange={e => setForm({ ...form, parent_id: e.target.value })}
              >
                <option value="">-- Không có --</option>
                {parentCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
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

            {/* Images Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">image</span>
                  Ảnh Menu
                </label>
                <div className="flex items-start gap-4">
                  <div className="size-24 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 transition-all">
                    {form.menu_image ? (
                      <img src={form.menu_image} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300">add_photo_alternate</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                      placeholder="URL hình ảnh..." 
                      value={form.menu_image}
                      onChange={e => setForm({...form, menu_image: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => { setActiveImageField('menu_image'); setPickerOpen(true); }}
                      className="w-fit px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                      Chọn từ thư viện
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">token</span>
                  Ảnh Icon
                </label>
                <div className="flex items-start gap-4">
                  <div className="size-24 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 transition-all">
                    {form.icon_image ? (
                      <img src={form.icon_image} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-slate-300">add_photo_alternate</span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <input 
                      type="text" 
                      className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                      placeholder="URL icon..." 
                      value={form.icon_image}
                      onChange={e => setForm({...form, icon_image: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => { setActiveImageField('icon_image'); setPickerOpen(true); }}
                      className="w-fit px-4 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                      Chọn từ thư viện
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-slate-700">Vị Trí Hiển Thị</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={form.display_position}
                onChange={e => setForm({ ...form, display_position: e.target.value })}
              >
                <option value="">-- Mặc định --</option>
                {positionList.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {field('Mô Tả Ngắn (Tuỳ chọn)', 'description', 'Nhập mô tả cho chuyên mục...', 'textarea')}
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-slate-100">
          <Link href="/categories" className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors text-center">
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
              <><span className="material-symbols-outlined text-[20px]">save</span> Lưu Chuyên Mục</>
            )}
          </button>
        </div>
      </form>

      <MediaPicker 
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          if (activeImageField) {
            setForm({ ...form, [activeImageField]: url });
          }
          setPickerOpen(false);
          setActiveImageField(null);
        }}
        title={activeImageField === 'menu_image' ? 'Chọn Ảnh Menu' : 'Chọn Ảnh Icon'}
      />
    </div>
  );
}
