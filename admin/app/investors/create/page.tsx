'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MediaPicker from '@/app/components/MediaPicker';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/app/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-xl border border-slate-200" />
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

export default function CreateInvestorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [form, setForm] = useState({
    name: '',
    website_link: '',
    subdomain: '',
    logo: '',
    intro_image: '',
    footer_image: '',
    about_image: '',
    short_description: '',
    content: '',
    stats: [] as { number: string; label: string }[],
    benefits: [] as { icon: string; title: string; description: string }[],
    status: 'active' as 'active' | 'inactive',
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeImageField, setActiveImageField] = useState<'logo' | 'intro_image' | 'footer_image' | 'about_image' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_BASE}/investors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form)
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

      router.push('/investors');
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
          rows={3}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}`}
          placeholder={placeholder}
          value={form[key] as string}
          onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
        />
      ) : (
        <input
          type={type}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-700 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200'}`}
          placeholder={placeholder}
          value={form[key] as string}
          onChange={e => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
        />
      )}
      {errors[key] && <p className="text-xs text-red-500 font-medium">{errors[key]}</p>}
      {hint && !errors[key] && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );

  const imageField = (label: string, key: 'logo' | 'intro_image' | 'footer_image' | 'about_image', hint: string) => (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">
          {key === 'logo' ? 'business' : key === 'intro_image' ? 'image' : key === 'about_image' ? 'perm_media' : 'bottom_panel_open'}
        </span>
        {label}
      </label>
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="size-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden shrink-0 transition-all hover:bg-slate-100/50 relative">
          {form[key] ? (
            <img src={form[key]} className="w-full h-full object-cover" alt={label} />
          ) : (
            <span className="material-symbols-outlined text-slate-300 text-[40px]">add_photo_alternate</span>
          )}
        </div>
        <div className="flex-1 w-full flex flex-col gap-3">
          <input 
            type="text" 
            className="w-full border border-slate-200 rounded-xl h-12 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-text font-mono text-xs text-slate-600 truncate" 
            placeholder={`URL ${label.toLowerCase()}...`} 
            value={form[key]}
            onChange={e => setForm({...form, [key]: e.target.value})}
          />
          <div className="flex flex-wrap gap-2">
            <button 
              type="button"
              onClick={() => { setActiveImageField(key); setPickerOpen(true); }}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">photo_library</span>
              Chọn từ thư viện
            </button>
            {form[key] && (
              <button
                type="button"
                onClick={() => setForm({ ...form, [key]: '' })}
                className="px-4 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">hide_image</span>
                Loại bỏ hình
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">{hint}</p>
        </div>
      </div>
    </div>
  );

  const renderStatsBuilder = () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">Những Con Số Biết Nói (Stats)</label>
        <button
          type="button"
          onClick={() => setForm({ ...form, stats: [...(form.stats || []), { number: '', label: '' }] })}
          className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20 transition-colors"
        >
          + Thêm Chỉ Số
        </button>
      </div>
      {(!form.stats || form.stats.length === 0) && <p className="text-sm text-slate-400 italic">Chưa có chỉ số nào.</p>}
      <div className="space-y-3">
        {(form.stats || []).map((stat, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Số (Vd: 000)"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary"
                value={stat.number}
                onChange={e => {
                  const newStats = [...form.stats];
                  newStats[idx].number = e.target.value;
                  setForm({ ...form, stats: newStats });
                }}
              />
              <input
                type="text"
                placeholder="Nhãn (Vd: Đại lý phân phối)"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary"
                value={stat.label}
                onChange={e => {
                  const newStats = [...form.stats];
                  newStats[idx].label = e.target.value;
                  setForm({ ...form, stats: newStats });
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const newStats = [...form.stats];
                newStats.splice(idx, 1);
                setForm({ ...form, stats: newStats });
              }}
              className="mt-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBenefitsBuilder = () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">Lợi Ích Của Khách Hàng (Benefits)</label>
        <button
          type="button"
          onClick={() => setForm({ ...form, benefits: [...(form.benefits || []), { icon: 'star', title: '', description: '' }] })}
          className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-bold hover:bg-primary/20 transition-colors"
        >
          + Thêm Lợi Ích
        </button>
      </div>
      {(!form.benefits || form.benefits.length === 0) && <p className="text-sm text-slate-400 italic">Chưa có lợi ích nào.</p>}
      <div className="space-y-3">
        {(form.benefits || []).map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex-1 flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-3">
                <input
                  type="text"
                  placeholder="Icon code"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary font-mono text-slate-500"
                  value={benefit.icon}
                  title="Nhập tên Material Icon. Ví dụ: verified, verified_user, star, check_circle"
                  onChange={e => {
                    const newBenefits = [...form.benefits];
                    newBenefits[idx].icon = e.target.value;
                    setForm({ ...form, benefits: newBenefits });
                  }}
                />
                <input
                  type="text"
                  placeholder="Tiêu đề (Vd: Được mua với giá tốt nhất)"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary"
                  value={benefit.title}
                  onChange={e => {
                    const newBenefits = [...form.benefits];
                    newBenefits[idx].title = e.target.value;
                    setForm({ ...form, benefits: newBenefits });
                  }}
                />
              </div>
              <textarea
                placeholder="Mô tả lợi ích..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-primary resize-none"
                value={benefit.description}
                onChange={e => {
                  const newBenefits = [...form.benefits];
                  newBenefits[idx].description = e.target.value;
                  setForm({ ...form, benefits: newBenefits });
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const newBenefits = [...form.benefits];
                newBenefits.splice(idx, 1);
                setForm({ ...form, benefits: newBenefits });
              }}
              className="mt-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 lg:px-6">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link href="/investors" className="flex items-center justify-center size-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-slate-900 text-2xl sm:text-3xl font-extrabold tracking-tight">Thêm Chủ Đầu Tư</h1>
          <p className="text-slate-500 text-sm">Điền thông tin bên dưới để tạo hồ sơ chủ đầu tư đối tác.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {errors._global && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex gap-3">
            <span className="material-symbols-outlined">error</span>
            {errors._global}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            {field('Tên Chủ Đầu Tư *', 'name', 'Vd: Tập Đoàn Hưng Thịnh')}
            {field('Link Website', 'website_link', 'Vd: https://hungthinhcorp.com.vn')}
            {field('Subdomain *', 'subdomain', 'Vd: hung-thinh', 'text', 'Viết liền không dấu, dùng cho đường dẫn riêng')}
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
            {field('Mô Tả Ngắn', 'short_description', 'Nhập mô tả ngắn về chủ đầu tư...', 'textarea')}
          </div>
        </div>

        <div className="mb-8 overflow-hidden">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">Bài Viết Chi Tiết</label>
            <RichTextEditor 
              content={form.content}
              onChange={(html) => setForm({ ...form, content: html })}
            />
            {errors.content && <p className="text-xs text-red-500 font-medium">{errors.content}</p>}
          </div>
        </div>

        <div className="space-y-8 pt-8 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {imageField('Logo Chủ Đầu Tư', 'logo', 'Ảnh logo chính thức')}
             {imageField('Ảnh Giới Thiệu (Hero)', 'intro_image', 'Ảnh bìa hoặc ảnh đại diện trang chủ')}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {imageField('Ảnh trang Giới Thiệu (About)', 'about_image', 'Ảnh tròn hoặc bo góc hiển thị ở trang About')}
             {imageField('Ảnh Footer', 'footer_image', 'Ảnh nền hiển thị dưới chân trang')}
          </div>
        </div>

        <div className="space-y-8 pt-8 mt-8 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 border-l-4 border-primary pl-3">Thông Tin Mở Rộng Trang About</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderStatsBuilder()}
            {renderBenefitsBuilder()}
          </div>
        </div>

        <div className="flex gap-4 pt-8 mt-8 border-t border-slate-100">
          <Link href="/investors" className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors text-center">
            Hủy Bỏ
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <><span className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Đang tạo...</>
            ) : (
              <><span className="material-symbols-outlined text-[20px]">save</span> Lưu Chủ Đầu Tư</>
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
        title={`Chọn ${activeImageField === 'logo' ? 'Logo' : activeImageField === 'intro_image' ? 'Ảnh Giới Thiệu' : 'Ảnh Footer'}`}
      />
    </div>
  );
}
