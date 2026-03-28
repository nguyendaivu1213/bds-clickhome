'use client';

import { useState, useEffect, useCallback } from 'react';
import MediaPicker from '@/app/components/MediaPicker';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface Option {
  id: string;
  label: string;
  value: string;
}

interface SelectionList {
  id: string;
  name: string;
  key: string;
  options: Option[];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'smtp' | 'selection_lists'>('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Global settings state
  const [settings, setSettings] = useState<Record<string, any>>({
    site_name: 'ClickHomes Real Estate',
    hotline: '1900 123456',
    support_email: 'support@clickhomes.vn',
    address: '',
    logo: '',
    zalo_phone: '',
    facebook_page_id: '',
    dynamic_selections: []
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          site_name: data.site_name || 'ClickHomes Real Estate',
          hotline: data.hotline || '1900 123456',
          support_email: data.support_email || 'support@clickhomes.vn',
          address: data.address || '',
          logo: data.logo || '',
          zalo_phone: data.zalo_phone || '',
          facebook_page_id: data.facebook_page_id || '',
          dynamic_selections: data.dynamic_selections || []
        });
      }
    } catch (err) {
      console.error('Lỗi khi tải cài đặt:', err);
      showToast('Không thể kết nối đến máy chủ.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        showToast('Đã lưu tất cả thay đổi thành công!');
      } else {
        throw new Error('Lỗi server');
      }
    } catch (err) {
      showToast('Lỗi khi lưu cài đặt.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const [editingList, setEditingList] = useState<SelectionList | null>(null);

  const addNewList = () => {
    const newList: SelectionList = {
      id: Date.now().toString(),
      name: '',
      key: '',
      options: [{ id: 'opt-' + Date.now(), label: '', value: '' }]
    };
    setEditingList(newList);
  };

  const saveList = async () => {
    if (!editingList) return;
    const currentLists = [...(settings.dynamic_selections || [])];
    const index = currentLists.findIndex(l => l.id === editingList.id);
    
    let updatedLists;
    if (index > -1) {
      updatedLists = currentLists.map(l => l.id === editingList.id ? editingList : l);
    } else {
      updatedLists = [...currentLists, editingList];
    }
    
    const updatedSettings = { ...settings, dynamic_selections: updatedLists };
    setSettings(updatedSettings);
    setEditingList(null);

    // Auto-persist to backend
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        showToast('Đã lưu danh sách thành công!');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Lỗi khi lưu. Vui lòng thử lại.', 'error');
    }
  };

  const removeList = async (id: string) => {
    const updatedLists = (settings.dynamic_selections || []).filter((l: any) => l.id !== id);
    const updatedSettings = { ...settings, dynamic_selections: updatedLists };
    setSettings(updatedSettings);

    // Auto-persist to backend
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        showToast('Đã xóa danh sách.');
      } else {
        throw new Error();
      }
    } catch {
      showToast('Lỗi khi xóa. Vui lòng thử lại.', 'error');
    }
  };

  const addOption = () => {
    if (!editingList) return;
    setEditingList({
      ...editingList,
      options: [...editingList.options, { id: 'opt-' + Date.now(), label: '', value: '' }]
    });
  };

  const updateOption = (optId: string, field: 'label' | 'value', val: string) => {
    if (!editingList) return;
    setEditingList({
      ...editingList,
      options: editingList.options.map(o => o.id === optId ? { ...o, [field]: val } : o)
    });
  };

  const removeOption = (optId: string) => {
    if (!editingList) return;
    setEditingList({
      ...editingList,
      options: editingList.options.filter(o => o.id !== optId)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">Cài Đặt Hệ Thống</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Quản lý các tuỳ chọn toàn cục của website, logo và danh sách chọn.</p>
        </div>
        <button 
          onClick={saveAllSettings}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all w-full sm:w-auto disabled:opacity-70"
        >
          {saving ? (
             <span className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
          )}
          <span>{saving ? 'Đang lưu...' : 'Lưu Toàn Bộ Cấu Hình'}</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Menu */}
        <div className="w-full lg:w-1/3 flex flex-col gap-2">
          {[
            { id: 'info', label: 'Thông tin Website', icon: 'info' },
            { id: 'selection_lists', label: 'Danh sách chọn', icon: 'list_alt' },
            { id: 'security', label: 'Bảo mật & Phân quyền', icon: 'security' },
            { id: 'smtp', label: 'Cấu hình Email (SMTP)', icon: 'mail' },
          ].map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${activeTab === tab.id ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' : 'border-transparent bg-white text-slate-600 font-medium hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              {tab.label}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6 min-h-[500px]">
          
          {activeTab === 'info' && (
            <>
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Thông tin Website
              </h2>
              
              <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-slate-700">Tên Website / Thương Hiệu</label>
                 <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-lg h-11 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" 
                  value={settings.site_name}
                  onChange={e => setSettings({...settings, site_name: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold text-slate-700">Logo Website</label>
                 <div className="flex items-center gap-4">
                   <div className="size-20 rounded-lg border border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden shadow-inner">
                      {settings.logo ? (
                        <img src={settings.logo} className="w-full h-full object-contain" alt="Logo" />
                      ) : (
                        <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
                      )}
                   </div>
                   <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setPickerOpen(true)}
                        className="h-10 px-4 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors border border-slate-200 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">photo_library</span>
                        Thay đổi logo
                      </button>
                      {settings.logo && (
                        <button 
                          onClick={() => setSettings({...settings, logo: ''})}
                          className="h-10 px-4 rounded-lg bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors border border-red-100 flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">hide_image</span>
                          Xóa logo
                        </button>
                      )}
                    </div>
                    {settings.logo && (
                      <input 
                        type="text"
                        className="w-full md:w-[400px] border border-slate-200 rounded-lg h-9 px-3 text-xs focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none"
                        value={settings.logo}
                        onChange={e => setSettings({...settings, logo: e.target.value})}
                        placeholder="URL logo..."
                      />
                    )}
                   </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-slate-700">Hotline Tư Vấn</label>
                   <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg h-11 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" 
                    value={settings.hotline}
                    onChange={e => setSettings({...settings, hotline: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-semibold text-slate-700">Email Hỗ Trợ</label>
                   <input 
                    type="email" 
                    className="w-full border border-slate-200 rounded-lg h-11 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700" 
                    value={settings.support_email}
                    onChange={e => setSettings({...settings, support_email: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Địa Chỉ Văn Phòng</label>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 resize-none"
                  placeholder="Vd: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                  value={settings.address}
                  onChange={e => setSettings({...settings, address: e.target.value})}
                />
                <p className="text-xs text-slate-400">Địa chỉ này sẽ hiển thị ở phần Footer của website.</p>
              </div>

              {/* Chat Icon Config */}
              <div className="flex flex-col gap-4 bg-blue-50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-blue-500 text-xl">chat</span>
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide">Cấu Hình Icon Chat (Messenger &amp; Zalo)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-[#0068ff]" />
                      Số Điện Thoại Zalo
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg h-11 px-4 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-slate-700 bg-white"
                      placeholder="Vd: 0901234567"
                      value={settings.zalo_phone}
                      onChange={e => setSettings({...settings, zalo_phone: e.target.value})}
                    />
                    <p className="text-xs text-slate-400">Dùng để tạo link zalo.me/&lt;số&gt; trên widget chat góc phải.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-[#0099ff]" />
                      Facebook Page ID / Username
                    </label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg h-11 px-4 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-slate-700 bg-white"
                      placeholder="Vd: YourPageName hoặc 123456789"
                      value={settings.facebook_page_id}
                      onChange={e => setSettings({...settings, facebook_page_id: e.target.value})}
                    />
                    <p className="text-xs text-slate-400">Page ID hoặc username Facebook dùng để tạo link m.me/&lt;id&gt;.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'selection_lists' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">list_alt</span>
                  Danh sách chọn (Dynamic Lists)
                </h2>
                {!editingList && (
                  <button 
                    onClick={addNewList}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-200"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Thêm danh sách
                  </button>
                )}
              </div>

              {editingList ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tên danh sách</label>
                      <input 
                        className="w-full border border-slate-200 rounded-lg h-11 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 bg-white" 
                        placeholder="Vd: Loại bất động sản"
                        value={editingList.name}
                        onChange={e => setEditingList({...editingList, name: e.target.value})}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase">Key (Định danh)</label>
                      <input 
                        className="w-full border border-slate-200 rounded-lg h-11 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 bg-white" 
                        placeholder="Vd: real_estate_types"
                        value={editingList.key}
                        onChange={e => setEditingList({...editingList, key: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-500 uppercase flex justify-between items-center">
                      Các tùy chọn (Options)
                      <button onClick={addOption} className="text-primary hover:underline text-[11px] flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Thêm Option
                      </button>
                    </label>
                    <div className="space-y-3">
                      {editingList.options.map((opt, oIdx) => (
                        <div key={opt.id} className="flex gap-3 items-start animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex-1">
                            <input 
                              className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                              placeholder="Label (Vd: Căn hộ)"
                              value={opt.label}
                              onChange={e => updateOption(opt.id, 'label', e.target.value)}
                            />
                          </div>
                          <div className="flex-1">
                            <input 
                              className="w-full border border-slate-200 rounded-lg h-10 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white" 
                              placeholder="Value (Vd: apartment)"
                              value={opt.value}
                              onChange={e => updateOption(opt.id, 'value', e.target.value)}
                            />
                          </div>
                          <button 
                            onClick={() => removeOption(opt.id)}
                            className="size-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-200 mt-2">
                    <button onClick={() => setEditingList(null)} className="px-5 h-10 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm bg-white hover:bg-slate-50">Hủy bỏ</button>
                    <button onClick={saveList} className="flex items-center gap-2 px-5 h-10 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all">
                      <span className="material-symbols-outlined text-sm">save</span>
                      Lưu danh sách
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {(settings.dynamic_selections || []).map((list: any) => (
                    <div key={list.id} className="group p-5 border border-slate-100 rounded-2xl bg-white hover:border-primary/30 hover:shadow-md transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                          <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">settings_input_component</span>
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-bold text-slate-800">{list.name}</h3>
                          <code className="text-[11px] text-slate-400">key: {list.key}</code>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Số lượng</span>
                           <span className="text-sm font-bold text-slate-800">{list.options?.length || 0} options</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setEditingList(list)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Chỉnh sửa"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button 
                            onClick={() => removeList(list.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Xóa"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(settings.dynamic_selections || []).length === 0 && (
                    <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">playlist_add</span>
                      <p className="text-slate-500 font-medium">Chưa có danh sách chọn nào</p>
                      <button onClick={addNewList} className="text-primary text-sm font-bold hover:underline mt-2">Bấm để tạo ngay</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <span className="material-symbols-outlined text-5xl mb-3">lock</span>
               <p className="font-medium">Cài đặt Bảo mật sẽ sớm ra mắt.</p>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
               <span className="material-symbols-outlined text-5xl mb-3">mail</span>
               <p className="font-medium">Tính năng cấu hình Email đang được phát triển.</p>
            </div>
          )}

        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
          <span className="material-symbols-outlined text-base">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          {toast.message}
        </div>
      )}

      <MediaPicker 
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          setSettings({ ...settings, logo: url });
          setPickerOpen(false);
        }}
        title="Chọn Logo Website"
      />
    </div>
  );
}
