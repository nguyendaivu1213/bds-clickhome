'use client';

import { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface MediaItem {
  id: number;
  name: string;
  url: string;
  thumbnail_url: string;
  file_type: string;
}

interface FolderItem {
  id: number;
  name: string;
  children?: FolderItem[];
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export default function MediaPicker({ isOpen, onClose, onSelect, title = 'Chọn hình ảnh' }: MediaPickerProps) {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/folders`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        setFolders(await res.json());
      }
    } catch (err) {
      console.error('Lỗi khi tải thư mục:', err);
    }
  }, []);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/media?per_page=50`;
      if (selectedFolder) url += `&folder_id=${selectedFolder}`;
      if (search) url += `&search=${search}`;

      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setMedia(data.data || []);
      }
    } catch (err) {
      console.error('Lỗi khi tải media:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder, search]);

  useEffect(() => {
    if (isOpen) {
      fetchFolders();
      fetchMedia();
    }
  }, [isOpen, fetchFolders, fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (selectedFolder) formData.append('folder_id', selectedFolder.toString());

    try {
      const res = await fetch(`${API_BASE}/media`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      if (res.ok) {
        const newMedia = await res.json();
        setMedia(prev => [newMedia, ...prev]);
      }
    } catch (err) {
      console.error('Lỗi khi tải lên:', err);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Thư viện ảnh BuildPro</p>
          </div>
          <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Thư mục */}
          <div className="w-64 border-r border-slate-100 p-4 overflow-y-auto bg-slate-50/30 hidden md:block">
            <div 
              onClick={() => setSelectedFolder(null)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all mb-2 ${selectedFolder === null ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <span className="material-symbols-outlined">home</span>
              <span className="font-bold text-sm">Tất cả ảnh</span>
            </div>
            
            <div className="mt-6">
              <p className="px-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Thư mục</p>
              {folders.map(f => (
                <div 
                  key={f.id}
                  onClick={() => setSelectedFolder(f.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all mb-1 ${selectedFolder === f.id ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{selectedFolder === f.id ? 'folder_open' : 'folder'}</span>
                  <span className="text-sm">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4 shrink-0">
               <div className="flex-1 relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm tệp..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                  />
               </div>
               <label className="flex items-center gap-2 h-10 px-4 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 cursor-pointer transition-all shadow-sm">
                  {uploading ? (
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-lg">upload</span>
                  )}
                  <span>Tải lên</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
               </label>
            </div>

            {/* Grid ảnh */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200">
               {loading ? (
                 <div className="flex items-center justify-center h-full">
                    <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                 </div>
               ) : media.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {media.map(item => (
                      <div 
                        key={item.id}
                        onClick={() => onSelect(item.url)}
                        className="group relative aspect-square rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                      >
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-white/90 backdrop-blur-sm border-t border-slate-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                           <p className="text-[10px] font-bold text-slate-700 truncate">{item.name}</p>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <span className="material-symbols-outlined text-6xl mb-2">image_search</span>
                    <p className="font-medium">Chưa có hình ảnh nào</p>
                    <p className="text-xs">Hãy tải tệp lên hoặc chuyển thư mục</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
