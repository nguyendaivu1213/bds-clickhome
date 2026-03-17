'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface MediaItem {
  id: number;
  name: string;
  url: string;
  thumbnail_url: string;
  preview_url?: string;
  file_type: string;
}

interface FolderItem {
  id: number;
  name: string;
  parent_id: number | null;
  children?: FolderItem[];
  children_count?: number;
  media_count?: number;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
  isManager?: boolean; // If true, behaves like a full page manager
}

export default function MediaPicker({ isOpen, onClose, onSelect, title = 'Chọn hình ảnh', isManager = false }: MediaPickerProps) {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [folderTree, setFolderTree] = useState<FolderItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [currentFolderDepth, setCurrentFolderDepth] = useState(1);
  const [breadcrumbs, setBreadcrumbs] = useState<{id: number | null, name: string, depth: number}[]>([{id: null, name: 'Gốc', depth: 1}]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // States for folder management
  const [isEditingFolder, setIsEditingFolder] = useState<number | null>(null);
  const [folderFormName, setFolderFormName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  // Cache for media items: folderId-search -> MediaItem[]
  const cacheRef = useRef<Record<string, MediaItem[]>>({});

  const fetchFolderTree = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/folders?view=tree`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        setFolderTree(await res.json());
      }
    } catch (err) {
      console.error('Lỗi khi tải thư mục:', err);
    }
  }, []);

  const fetchMedia = useCallback(async (forceRefresh = false) => {
    const cacheKey = `${currentFolderId || 0}-${search}`;
    
    if (!forceRefresh && cacheRef.current[cacheKey]) {
      setMedia(cacheRef.current[cacheKey]);
      return;
    }

    setLoading(true);
    try {
      let url = `${API_BASE}/media?per_page=50`;
      if (currentFolderId) url += `&folder_id=${currentFolderId}`;
      else url += `&folder_id=0`; // Root files

      if (search) url += `&search=${search}`;

      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        const items = data.data || [];
        setMedia(items);
        cacheRef.current[cacheKey] = items;
      }
    } catch (err) {
      console.error('Lỗi khi tải media:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFolderId, search]);

  useEffect(() => {
    if (isOpen) {
      fetchFolderTree();
      fetchMedia(false); // Use cache if available
    }
  }, [isOpen, fetchFolderTree, fetchMedia]);

  const handleCreateFolder = async () => {
    if (!folderFormName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/folders`, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: folderFormName,
          parent_id: currentFolderId
        })
      });
      if (res.ok) {
        setFolderFormName('');
        setShowNewFolderInput(false);
        fetchFolderTree();
      } else {
        const error = await res.json();
        alert(error.message || 'Lỗi khi tạo thư mục');
      }
    } catch (err) {
      console.error('Lỗi khi tạo thư mục:', err);
    }
  };

  const handleUpdateFolder = async (id: number) => {
    if (!folderFormName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/folders/${id}`, {
        method: 'PUT',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: folderFormName })
      });
      if (res.ok) {
        setIsEditingFolder(null);
        setFolderFormName('');
        fetchFolderTree();
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật thư mục:', err);
    }
  };

  const handleDeleteFolder = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thư mục này? Thư mục phải trống mới có thể xóa.')) return;
    try {
      const res = await fetch(`${API_BASE}/folders/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        fetchFolderTree();
      } else {
        const data = await res.json();
        alert(data.message || 'Không thể xóa thư mục');
      }
    } catch (err) {
      console.error('Lỗi khi xóa thư mục:', err);
    }
  };

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    
    // Nếu API_BASE là URL tuyệt đối, lấy origin của nó
    if (API_BASE.startsWith('http')) {
      try {
        const apiOrigin = new URL(API_BASE).origin;
        return `${apiOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
      } catch (e) {
        return url;
      }
    }
    
    // Nếu chạy trên browser và API_BASE là relative
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    return url;
  };

  const handleRefresh = () => {
    fetchFolderTree();
    fetchMedia(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        if (currentFolderId) formData.append('folder_id', currentFolderId.toString());

        try {
          const res = await fetch(`${API_BASE}/media`, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData,
          });
          if (res.ok) {
            const newMedia = await res.json();
            setMedia(prev => [newMedia, ...prev]);
            // Update cache
            const cacheKey = `${currentFolderId || 0}-${search}`;
            cacheRef.current[cacheKey] = [newMedia, ...(cacheRef.current[cacheKey] || [])];
          } else {
            const error = await res.json();
            alert(`Lỗi khi tải lên: ${error.message || 'Có lỗi xảy ra'}`);
          }
        } catch (err) {
          console.error('Lỗi khi tải lên:', err);
          alert('Không thể kết nối đến máy chủ để tải ảnh.');
        }
    }
    setUploading(false);
  };

  const enterFolder = (folder: {id: number | null, name: string}, depth: number = 1) => {
    setCurrentFolderId(folder.id);
    setCurrentFolderDepth(depth);
    if (folder.id === null) {
      setBreadcrumbs([{id: null, name: 'Gốc', depth: 1}]);
    } else {
      // Find breadcrumb path or rebuild it
      // Simple rebuild for now (Gốc -> Selected Folder)
      setBreadcrumbs([{id: null, name: 'Gốc', depth: 1}, {id: folder.id, name: folder.name, depth: depth}]);
    }
  };

  const navigateToBreadcrumb = (index: number) => {
    const target = breadcrumbs[index];
    setCurrentFolderId(target.id);
    setCurrentFolderDepth(target.depth);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const FolderTreeItem = ({ folder, level = 1 }: { folder: FolderItem, level?: number }) => {
    const isActive = currentFolderId === folder.id;
    return (
      <div className="flex flex-col">
        <div 
          className={`group flex items-center justify-between pr-2 rounded-xl transition-all hover:bg-white hover:shadow-sm ${isActive ? 'bg-primary/10 text-primary shadow-sm' : ''}`}
          style={{ paddingLeft: `${(level - 1) * 12}px` }}
        >
          <div 
            onClick={() => enterFolder({id: folder.id, name: folder.name}, level + 1)}
            className={`flex-1 flex items-center gap-3 px-4 py-2.5 cursor-pointer font-medium ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-amber-400'}`}>
              {folder.children && folder.children.length > 0 ? 'folder_open' : 'folder'}
            </span>
            <span className="text-sm truncate">{folder.name}</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); setIsEditingFolder(folder.id); setFolderFormName(folder.name); }} className="size-6 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-400 transition-colors">
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }} className="size-6 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 transition-colors">
              <span className="material-symbols-outlined text-[14px]">delete</span>
            </button>
          </div>
        </div>
        {folder.children && folder.children.length > 0 && (
          <div className="flex flex-col">
            {folder.children.map(child => (
              <FolderTreeItem key={child.id} folder={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(t)) return 'image';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(t)) return 'movie';
    if (['pdf'].includes(t)) return 'picture_as_pdf';
    if (['doc', 'docx'].includes(t)) return 'description';
    if (['xls', 'xlsx', 'csv'].includes(t)) return 'table_view';
    if (['zip', 'rar', '7z'].includes(t)) return 'archive';
    return 'insert_drive_file';
  };

  const getFileColor = (type: string) => {
    const t = type.toLowerCase();
    if (['mp4', 'mov', 'avi', 'mkv'].includes(t)) return 'text-purple-500';
    if (['pdf'].includes(t)) return 'text-red-500';
    if (['doc', 'docx'].includes(t)) return 'text-blue-500';
    if (['xls', 'xlsx', 'csv'].includes(t)) return 'text-emerald-500';
    if (['zip', 'rar', '7z'].includes(t)) return 'text-amber-500';
    return 'text-slate-400';
  };

  const handleDeleteMedia = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Xóa tệp này vĩnh viễn?')) return;
    try {
      // Ensure no double slashes if API_BASE ends with /
      const baseUrl = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
      const res = await fetch(`${baseUrl}/media/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== id));
        // Update cache
        const cacheKey = `${currentFolderId || 0}-${search}`;
        if (cacheRef.current[cacheKey]) {
          cacheRef.current[cacheKey] = cacheRef.current[cacheKey].filter(m => m.id !== id);
        }
      } else {
        const error = await res.json();
        alert(`Lỗi: ${error.message || 'Không thể xóa tệp'}`);
      }
    } catch (err) {
      console.error('Lỗi khi xóa tệp:', err);
      alert('Lỗi kết nối máy chủ.');
    }
  };

  if (!isOpen && !isManager) return null;

  return (
    <div className={isManager ? "w-full h-full flex flex-col" : "fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"}>
      <div className={isManager ? "bg-white w-full h-full flex flex-col" : "bg-white rounded-3xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"}>
        {/* Header */}
        {!isManager && (
          <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{title}</h2>
              <div className="flex items-center gap-1 mt-1">
                 {breadcrumbs.map((b, i) => (
                   <div key={i} className="flex items-center">
                      <button 
                        onClick={() => navigateToBreadcrumb(i)}
                        className={`text-[10px] font-bold uppercase tracking-wider hover:text-primary transition-colors ${i === breadcrumbs.length - 1 ? 'text-slate-400' : 'text-slate-600'}`}
                      >
                        {b.name}
                      </button>
                      {i < breadcrumbs.length - 1 && <span className="material-symbols-outlined text-[12px] text-slate-300 mx-1">chevron_right</span>}
                   </div>
                 ))}
              </div>
            </div>
            <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Thư mục */}
          <div className="w-64 border-r border-slate-100 p-4 overflow-y-auto bg-slate-50/30 hidden md:block">
            <div className="flex items-center justify-between px-4 mb-4">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Thư mục</p>
              {currentFolderDepth < 5 && (
                <button 
                  onClick={() => { setShowNewFolderInput(true); setFolderFormName(''); }}
                  className="size-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">create_new_folder</span>
                </button>
              )}
            </div>

            {showNewFolderInput && (
              <div className="px-4 mb-4 animate-in fade-in slide-in-from-top-2">
                <input 
                  autoFocus
                  className="w-full px-3 py-2 text-sm border border-primary rounded-lg outline-none"
                  placeholder="Tên thư mục..."
                  value={folderFormName}
                  onChange={e => setFolderFormName(e.target.value)}
                  onKeyDown={e => { if(e.key==='Enter') handleCreateFolder(); if(e.key==='Escape') setShowNewFolderInput(false); }}
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleCreateFolder} className="flex-1 py-1 bg-primary text-white text-[10px] font-bold rounded-md">OK</button>
                  <button onClick={() => setShowNewFolderInput(false)} className="flex-1 py-1 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-md">Huỷ</button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {folderTree.map(folder => (
                <FolderTreeItem key={folder.id} folder={folder} />
              ))}
              
              {isEditingFolder && (
                 <div className="fixed inset-0 z-[110] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                       <h3 className="font-bold text-slate-800 mb-4">Đổi tên thư mục</h3>
                       <input 
                         autoFocus
                         className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4"
                         value={folderFormName}
                         onChange={e => setFolderFormName(e.target.value)}
                       />
                       <div className="flex gap-3">
                          <button onClick={() => handleUpdateFolder(isEditingFolder)} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl">Cập nhật</button>
                          <button onClick={() => setIsEditingFolder(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">Huỷ</button>
                       </div>
                    </div>
                 </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
               <div className="flex items-center gap-2">
                  {isManager && (
                    <div className="flex items-center bg-slate-100 px-3 py-2 rounded-xl text-slate-500 mr-2">
                       <span className="material-symbols-outlined text-[20px] mr-2">folder_zip</span>
                       <span className="text-xs font-bold uppercase tracking-wider">{breadcrumbs[breadcrumbs.length - 1].name}</span>
                    </div>
                  )}
                <div className="flex items-center gap-2">
                  <div className="relative w-64 lg:w-80">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm tệp..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleRefresh}
                    className="size-11 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:text-primary hover:border-primary transition-all active:scale-95"
                    title="Làm mới"
                  >
                    <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
                  </button>
                </div>
               </div>

               <div className="flex items-center gap-2">
                 <label className="flex items-center gap-2 h-11 px-5 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 cursor-pointer transition-all shadow-md active:scale-95 group">
                    {uploading ? (
                      <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <span className="material-symbols-outlined text-xl group-hover:bounce">upload_file</span>
                    )}
                    <span>Tải lên tệp</span>
                    <input type="file" className="hidden" multiple onChange={handleUpload} disabled={uploading} />
                 </label>
               </div>
            </div>

            {/* Breadcrumb path for mobile or compact view */}
            <div className="px-5 py-2 flex items-center gap-1 border-b border-slate-50 lg:hidden">
                {breadcrumbs.map((b, i) => (
                  <div key={i} className="flex items-center">
                    <button onClick={() => navigateToBreadcrumb(i)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.name}</button>
                    {i < breadcrumbs.length - 1 && <span className="material-symbols-outlined text-xs text-slate-300">chevron_right</span>}
                  </div>
                ))}
            </div>

            {/* Grid media list */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50/20">
               {loading ? (
                 <div className="flex flex-col items-center justify-center h-full">
                    <div className="size-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-medium">Đang tải tệp tin...</p>
                 </div>
               ) : (media.length > 0) ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5">

                    {/* Media Items */}
                    {media.map(item => {
                      const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(item.file_type.toLowerCase());
                      return (
                        <div 
                          key={item.id}
                          onClick={() => onSelect(getFullUrl(item.url))}
                          className="group relative flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:border-primary hover:shadow-xl transition-all animate-in fade-in"
                        >
                          <div className="aspect-square relative flex items-center justify-center bg-slate-50 overflow-hidden">
                            {isImage ? (
                              <img 
                                src={getFullUrl(item.thumbnail_url || item.url)} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <span className={`material-symbols-outlined text-5xl ${getFileColor(item.file_type)} group-hover:scale-110 transition-transform`}>
                                  {getFileIcon(item.file_type)}
                                </span>
                                <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.file_type}</span>
                              </div>
                            )}
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); window.open(getFullUrl(item.url), '_blank'); }}
                                  className="size-8 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-primary transition-all flex items-center justify-center"
                                  title="Xem trước"
                                >
                                   <span className="material-symbols-outlined text-lg">visibility</span>
                                </button>
                                <button 
                                  onClick={(e) => handleDeleteMedia(item.id, e)}
                                  className="size-8 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-red-500 hover:border-red-500 transition-all flex items-center justify-center"
                                  title="Xoá"
                                >
                                   <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                          </div>
                          
                          <div className="p-3 border-t border-slate-50 bg-white group-hover:bg-slate-50 transition-colors">
                            <p className="text-[11px] font-bold text-slate-700 truncate">{item.name}</p>
                            <p className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">Tệp {item.file_type}</p>
                          </div>
                        </div>
                      );
                    })}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <div className="size-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                       <span className="material-symbols-outlined text-5xl">folder_off</span>
                    </div>
                    <p className="font-bold text-slate-500">Thư mục này còn trống</p>
                    <p className="text-xs max-w-xs text-center mt-2">Hãy tải tệp tin lên hoặc tạo thư mục con để sắp xếp tài liệu của bạn.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
