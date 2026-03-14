'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';

// --- Config ---
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

// --- Types ---
interface Investor {
  id: number;
  name: string;       // từ translation
  subdomain: string;
  website_link: string | null;
  logo: string | null;
  status: 'active' | 'inactive';
  projects_count: number;
  short_description?: string | null;
  translations?: Array<{ locale: string; name: string; short_description?: string; content?: string }>;
}

interface ApiMeta { current_page: number; last_page: number; total: number; }

const EMPTY_FORM = {
  name: '',
  subdomain: '',
  website_link: '',
  logo: '',
  status: 'active' as 'active' | 'inactive',
  short_description: '',
};

// --- API helpers ---
async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data; // ném để bắt lỗi validation
  return data;
}

// --- Normalise API response → Investor shape ---
function normalise(raw: any): Investor {
  // Astrotomic trả name flatten hoặc qua translations array
  const viTrans = raw.translations?.find((t: any) => t.locale === 'vi') ?? raw.translations?.[0];
  return {
    id:               raw.id,
    name:             raw.name ?? viTrans?.name ?? '(chưa có tên)',
    subdomain:        raw.subdomain ?? '',
    website_link:     raw.website_link ?? null,
    logo:             raw.logo ?? null,
    status:           raw.status ?? 'active',
    projects_count:   raw.projects_count ?? 0,
    short_description: raw.short_description ?? viTrans?.short_description ?? null,
    translations:     raw.translations ?? [],
  };
}

// --- Helper ---
function avatarUrl(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d9488&color=fff&size=128&bold=true`;
}

// --- Modal Add/Edit ---
function InvestorModal({
  mode, investor, onClose, onSaved,
}: {
  mode: 'add' | 'edit';
  investor: typeof EMPTY_FORM & { id?: number };
  onClose: () => void;
  onSaved: (inv: Investor) => void;
}) {
  const [form, setForm] = useState(investor);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const payload = {
        name:              form.name,
        subdomain:         form.subdomain,
        website_link:      form.website_link || null,
        logo:              form.logo || null,
        status:            form.status,
        short_description: form.short_description || null,
      };
      let raw: any;
      if (mode === 'add') {
        raw = await apiFetch('/investors', { method: 'POST', body: JSON.stringify(payload) });
      } else {
        raw = await apiFetch(`/investors/${form.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
      onSaved(normalise(raw));
    } catch (err: any) {
      // Laravel validation errors: { errors: { field: ['msg'] } }
      if (err?.errors) {
        const flat: Record<string, string> = {};
        Object.entries(err.errors).forEach(([k, v]) => { flat[k] = (v as string[])[0]; });
        setErrors(flat);
      } else {
        setErrors({ _global: err?.message ?? 'Lỗi không xác định.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (label: string, key: keyof typeof EMPTY_FORM, placeholder: string, hint?: string) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors[key] ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
        placeholder={placeholder}
        value={(form as any)[key] ?? ''}
        onChange={ev => { setForm({ ...form, [key]: ev.target.value }); setErrors({ ...errors, [key]: '' }); }}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
      {hint && !errors[key] && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">{mode === 'add' ? 'add_business' : 'edit'}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">{mode === 'add' ? 'Thêm Chủ Đầu Tư' : 'Chỉnh Sửa Chủ Đầu Tư'}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition hover:bg-slate-100 rounded-lg p-1.5">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors._global && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{errors._global}</div>
          )}
          {field('Tên chủ đầu tư *', 'name', 'Vd: Tập Đoàn Hưng Thịnh')}
          {field('Subdomain *', 'subdomain', 'Vd: hung-thinh', 'Chữ thường, không dấu, dùng dấu gạch ngang')}
          {field('Website', 'website_link', 'https://example.com')}
          {field('Mô tả ngắn', 'short_description', 'Giới thiệu ngắn về chủ đầu tư...')}
          {field('URL Logo', 'logo', 'https://...', 'Để trống để dùng avatar tự động')}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trạng thái</label>
            <div className="flex gap-3">
              {(['active', 'inactive'] as const).map(s => (
                <label key={s} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer transition text-sm font-medium ${form.status === s ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  <input type="radio" className="hidden" value={s} checked={form.status === s} onChange={() => setForm({ ...form, status: s })} />
                  <span className={`size-2 rounded-full ${s === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                  {s === 'active' ? 'Hoạt Động' : 'Tạm Ngưng'}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition text-sm">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <><span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Đang lưu...</>
              ) : (
                <><span className="material-symbols-outlined text-base">{mode === 'add' ? 'add' : 'save'}</span>{mode === 'add' ? 'Thêm mới' : 'Lưu thay đổi'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Delete Confirm ---
function DeleteConfirm({ investor, onClose, onConfirm }: { investor: Investor; onClose: () => void; onConfirm: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await apiFetch(`/investors/${investor.id}`, { method: 'DELETE' });
      onConfirm();
    } catch (err: any) {
      setError(err?.message ?? 'Không thể xóa. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
        <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-red-500 text-3xl">delete_forever</span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Xóa chủ đầu tư?</h3>
        <p className="text-sm text-slate-500 mb-1">Bạn có chắc muốn xóa <span className="font-semibold text-slate-700">"{investor.name}"</span>?</p>
        <p className="text-xs text-slate-400 mb-5">Hành động này không thể hoàn tác.</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4">{error}</div>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition text-sm">Hủy</button>
          <button onClick={handleConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition text-sm disabled:opacity-60">
            {loading ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Toast ---
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-medium animate-[slideUp_0.3s_ease] ${type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
      <span className="material-symbols-outlined text-base">{type === 'success' ? 'check_circle' : 'error'}</span>
      {message}
    </div>
  );
}

// --- Investor Card Skeleton ---
function Skeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-1 bg-slate-100" />
      <div className="flex flex-col items-center p-6 gap-3">
        <div className="size-20 rounded-2xl bg-slate-100" />
        <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
        <div className="h-3 w-1/2 bg-slate-100 rounded-lg" />
        <div className="h-3 w-2/3 bg-slate-100 rounded-lg mt-2" />
      </div>
      <div className="border-t border-slate-100 h-11 bg-slate-50" />
    </div>
  );
}

// --- Main Page ---
export default function InvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data: typeof EMPTY_FORM & { id?: number } } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Investor | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInvestors = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const params = new URLSearchParams({ per_page: '50' });
      if (search) params.set('search', search);
      if (filterStatus !== 'all') params.set('status', filterStatus);
      const data = await apiFetch(`/investors?${params}`);
      // Laravel pagination: { data: [], meta: {} } hoặc { data: [], current_page, ... }
      const items = data.data ?? data;
      setInvestors((Array.isArray(items) ? items : []).map(normalise));
      setMeta(data.meta ?? { current_page: 1, last_page: 1, total: items.length });
    } catch {
      setFetchError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối đến backend.');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(fetchInvestors, 300);
    return () => clearTimeout(t);
  }, [fetchInvestors]);

  // Client-side filter (khi API đã trả về đủ)
  const filtered = useMemo(() => investors, [investors]);

  const handleSaved = (inv: Investor) => {
    setInvestors(prev => {
      const exists = prev.find(i => i.id === inv.id);
      return exists ? prev.map(i => (i.id === inv.id ? inv : i)) : [inv, ...prev];
    });
    setModal(null);
    showToast(modal?.mode === 'add' ? 'Thêm chủ đầu tư thành công!' : 'Cập nhật thành công!');
  };

  const handleDeleted = () => {
    if (!deleteTarget) return;
    setInvestors(prev => prev.filter(i => i.id !== deleteTarget.id));
    showToast(`Đã xóa "${deleteTarget.name}"`);
    setDeleteTarget(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Chủ Đầu Tư</h1>
          <p className="text-slate-500 mt-1 text-base">Quản lý các đối tác cung cấp, phát triển và chủ sở hữu bất động sản.</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add', data: { ...EMPTY_FORM } })}
          className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Thêm Chủ Đầu Tư</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 lg:p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm outline-none transition"
              placeholder="Tìm kiếm tên hoặc subdomain..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'inactive'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${filterStatus === s ? 'bg-primary text-white border-primary shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
              >
                {s === 'all' ? 'Tất cả' : s === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
              </button>
            ))}
            <button onClick={fetchInvestors} title="Tải lại" className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition">
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && !fetchError && (
        <div className="flex flex-wrap gap-3 mb-6 text-sm text-slate-500">
          <span>Hiển thị <strong className="text-slate-800">{filtered.length}</strong>{meta ? ` / ${meta.total}` : ''} chủ đầu tư</span>
          <span>·</span>
          <span><strong className="text-emerald-600">{investors.filter(i => i.status === 'active').length}</strong> hoạt động</span>
          <span>·</span>
          <span><strong className="text-red-500">{investors.filter(i => i.status === 'inactive').length}</strong> tạm ngưng</span>
        </div>
      )}

      {/* Error */}
      {fetchError && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 flex items-start gap-3">
          <span className="material-symbols-outlined text-amber-500">wifi_off</span>
          <div>
            <p className="font-semibold text-amber-800">{fetchError}</p>
            <p className="text-sm text-amber-600 mt-1">Đảm bảo Laravel backend đang chạy trên <code className="bg-amber-100 px-1 rounded">http://localhost:8000</code></p>
            <button onClick={fetchInvestors} className="mt-3 text-sm text-amber-700 underline hover:text-amber-900">Thử lại</button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 && !fetchError ? (
        <div className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">search_off</span>
          <p className="text-slate-500 font-medium">Không tìm thấy chủ đầu tư nào</p>
          <p className="text-slate-400 text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc nhấn "Thêm" để tạo mới</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {filtered.map(investor => (
            <div key={investor.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col">
              <div className={`h-1 w-full ${investor.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <div className="flex flex-col items-center text-center p-6 flex-1">
                <div className="size-20 rounded-2xl overflow-hidden mb-4 shadow-md ring-4 ring-slate-100">
                  <img src={investor.logo || avatarUrl(investor.name)} alt={investor.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight mb-1">{investor.name}</h3>
                <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 mb-3">@{investor.subdomain}</span>
                {investor.short_description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{investor.short_description}</p>
                )}
                {investor.website_link && (
                  <a href={investor.website_link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mb-3 flex items-center gap-1 truncate max-w-full">
                    <span className="material-symbols-outlined text-sm">link</span>
                    <span className="truncate">{investor.website_link.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                <div className="w-full border-t border-slate-100 pt-4 mt-auto flex justify-between items-center text-sm">
                  <span className="text-slate-500"><span className="font-bold text-slate-800">{investor.projects_count}</span> Dự án</span>
                  <span className={`text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 ${investor.status === 'active' ? 'text-emerald-600' : 'text-red-500'}`}>
                    <span className={`size-1.5 rounded-full ${investor.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                    {investor.status === 'active' ? 'Hoạt Động' : 'Tạm Ngưng'}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100">
                <button
                  onClick={() => setModal({ mode: 'edit', data: { id: investor.id, name: investor.name, subdomain: investor.subdomain, website_link: investor.website_link ?? '', logo: investor.logo ?? '', status: investor.status, short_description: investor.short_description ?? '' } })}
                  className="flex items-center justify-center gap-1.5 py-3 text-slate-500 hover:bg-primary/5 hover:text-primary transition text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>Chỉnh sửa
                </button>
                <button
                  onClick={() => setDeleteTarget(investor)}
                  className="flex items-center justify-center gap-1.5 py-3 text-slate-500 hover:bg-red-50 hover:text-red-500 transition text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <InvestorModal mode={modal.mode} investor={modal.data} onClose={() => setModal(null)} onSaved={handleSaved} />
      )}
      {deleteTarget && (
        <DeleteConfirm investor={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleted} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
