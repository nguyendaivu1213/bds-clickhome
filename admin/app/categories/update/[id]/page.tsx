'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import MediaPicker from '@/app/components/MediaPicker';
import { slugify } from '@/app/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface Category {
  id: number;
  title: string;
}

export default function UpdateCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  if (!id) return null; // Or some other fallback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const fetchData = useCallback(async () => {
    try {
      // Fetch category data
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error('Không thể tải dữ liệu chuyên mục');
      const data = await res.json();
      
      const viTrans = data.translations?.find((t: any) => t.locale === 'vi') ?? data.translations?.[0];
      
      setForm({
        title: data.title ?? viTrans?.title ?? '',
        url: data.url ?? viTrans?.url ?? '',
        data_type: data.data_type ?? 'Tin tức',
        display_position: data.display_position ?? '',
        status: data.status ?? 'active',
        description: data.description ?? viTrans?.description ?? '',
        parent_id: data.parent_id?.toString() ?? '',
        menu_image: data.menu_image ?? '',
        icon_image: data.icon_image ?? '',
      });

      // Fetch potential parents
      const parentsRes = await fetch(`${API_BASE}/categories?per_page=500`, {
        headers: { 'Accept': 'application/json' }
      });
      if (parentsRes.ok) {
        const parentsData = await parentsRes.json();
        const items = (parentsData.data ?? parentsData) as any[];
        setParentCategories(
          items
            .filter(item => item.id.toString() !== id.toString())
            .map(item => {
              const trans = item.translations?.find((t: any) => t.locale === 'vi') ?? item.translations?.[0];
              return {
                id: item.id,
                title: item.title ?? trans?.title ?? `Category ${item.id}`
              };
            })
        );
      }
      
      // Fetch dynamic selection lists
      const settingsRes = await fetch(`${API_BASE}/settings`, {
        headers: { 'Accept': 'application/json' }
      });
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSelectionLists(settingsData.dynamic_selections || []);
      }

    } catch (err: any) {
      setErrors({ _global: err.message || 'Lỗi khi tải dữ liệu.' });
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
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
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, placeholder: string, type = 'text', hint?: string, extraOnChange?: (val: string) => void) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}`}
          placeholder={placeholder}
          value={(form as any)[key]}
          onChange={e => { 
            const val = e.target.value;
            setForm(prev => ({ ...prev, [key]: val })); 
            setErrors(prev => ({ ...prev, [key]: '' }));
            if (extraOnChange) extraOnChange(val);
          }}
        />
      ) : (
        <input
          type={type}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}`}
          placeholder={placeholder}
          value={(form as any)[key]}
          onChange={e => { 
            const val = e.target.value;
            setForm(prev => ({ ...prev, [key]: val })); 
            setErrors(prev => ({ ...prev, [key]: '' }));
            if (extraOnChange) extraOnChange(val);
          }}
        />
      )}
      {errors[key] && <p className="text-xs text-red-500 font-medium">{errors[key]}</p>}
      {hint && !errors[key] && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );

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
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 lg:px-6">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link href="/categories" className="flex items-center justify-center size-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">Cập Nhật Chuyên Mục</h1>
          <p className="text-slate-500 text-sm">Chỉnh sửa thông tin chuyên mục đã có.</p>
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
            {field('Tên Chuyên Mục *', 'title', 'Vd: Tin Thị Trường', 'text', undefined, (val) => {
              setForm(prev => ({ ...prev, url: slugify(val) }));
            })}
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

        {/* Improved Images Section at the bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 mb-8">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">image</span>
              Ảnh Menu
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="size-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 transition-all hover:bg-slate-100/50">
                {form.menu_image ? (
                  <img src={form.menu_image} className="w-full h-full object-cover" alt="Menu" />
                ) : (
                  <span className="material-symbols-outlined text-slate-300 text-[40px]">add_photo_alternate</span>
                )}
              </div>
              <div className="flex-1 w-full flex flex-col gap-3">
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="URL hình ảnh menu..." 
                  value={form.menu_image}
                  onChange={e => setForm({...form, menu_image: e.target.value})}
                />
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => { setActiveImageField('menu_image'); setPickerOpen(true); }}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">photo_library</span>
                    Chọn từ thư viện
                  </button>
                  {form.menu_image && (
                    <button
                      type="button"
                      onClick={() => setForm({...form, menu_image: ''})}
                      className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">hide_image</span>
                      Loại bỏ hình
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">token</span>
              Ảnh Icon
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="size-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 transition-all hover:bg-slate-100/50">
                {form.icon_image ? (
                  <img src={form.icon_image} className="w-full h-full object-cover" alt="Icon" />
                ) : (
                  <span className="material-symbols-outlined text-slate-300 text-[40px]">add_photo_alternate</span>
                )}
              </div>
              <div className="flex-1 w-full flex flex-col gap-3">
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="URL icon cho chuyên mục..." 
                  value={form.icon_image}
                  onChange={e => setForm({...form, icon_image: e.target.value})}
                />
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => { setActiveImageField('icon_image'); setPickerOpen(true); }}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">photo_library</span>
                    Chọn từ thư viện
                  </button>
                  {form.icon_image && (
                    <button
                      type="button"
                      onClick={() => setForm({...form, icon_image: ''})}
                      className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[20px]">hide_image</span>
                      Loại bỏ hình
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-slate-100">
          <Link href="/categories" className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors text-center">
            Hủy Bỏ
          </Link>
          <button 
            type="submit" 
            disabled={saving}
            className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <><span className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Đang lưu...</>
            ) : (
              <><span className="material-symbols-outlined text-[20px]">save</span> Lưu Thay Đổi</>
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
        title={activeImageField === 'menu_image' ? 'Chọn Ảnh Menu' : activeImageField === 'icon_image' ? 'Chọn Ảnh Icon' : 'Chọn hình ảnh'}
      />
    </div>
  );
}
