export default function MediaPage() {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-theme(spacing.24))]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đa Phương Tiện</h1>
          <p className="text-slate-500 text-sm mt-1">Lưu trữ, quản lý tệp hình ảnh, video, tài liệu cho toàn bộ hệ thống.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all">
          <span className="material-symbols-outlined">upload</span>
          <span>Tải tệp lên</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Sidebar thư mục */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 overflow-y-auto">
          <div className="flex items-center gap-2 text-slate-800 font-bold bg-slate-100 px-4 py-3 rounded-xl">
             <span className="material-symbols-outlined text-primary">folder_open</span>
             Home
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium hover:bg-slate-50 cursor-pointer px-4 py-2 rounded-lg ml-4">
             <span className="material-symbols-outlined">folder</span>
             Dự án
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium hover:bg-slate-50 cursor-pointer px-4 py-2 rounded-lg ml-8 text-sm">
             <span className="material-symbols-outlined text-lg">folder</span>
             Vinhomes Grand Park
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium hover:bg-slate-50 cursor-pointer px-4 py-2 rounded-lg ml-8 text-sm">
             <span className="material-symbols-outlined text-lg">folder</span>
             The Privia
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-medium hover:bg-slate-50 cursor-pointer px-4 py-2 rounded-lg ml-4 mt-2">
             <span className="material-symbols-outlined">folder</span>
             Bài viết
          </div>
          <div className="flex items-center gap-2 text-primary bg-primary/10 font-medium cursor-pointer px-4 py-2 rounded-lg mt-4">
             <span className="material-symbols-outlined">create_new_folder</span>
             Tạo thư mục mới
          </div>
        </div>

        {/* Nội dung Files */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col min-w-0">
          <div className="flex justify-between items-center mb-6 shrink-0 border-b border-slate-100 pb-4">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <span className="material-symbols-outlined text-slate-400">home</span> / Dự án / Vinhomes Grand Park
             </h2>
             <div className="flex items-center gap-2">
                 <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input className="w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm outline-none transition-all" placeholder="Tìm tệp..." type="text" />
                 </div>
                 <button className="size-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500">
                    <span className="material-symbols-outlined">grid_view</span>
                 </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 pb-4 content-start">
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
               {[1, 2, 3, 4, 5, 6, 7].map((id) => (
                  <div key={id} className="relative group rounded-xl bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-primary/30 transition-all flex flex-col">
                     <div className="h-32 bg-slate-200 relative">
                        <img src={`https://ui-avatars.com/api/?name=IMAGE+${id}&background=cbd5e1&color=fff`} className="w-full h-full object-cover" alt="media" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button className="size-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                             <span className="material-symbols-outlined text-[18px]">visibility</span>
                           </button>
                        </div>
                     </div>
                     <div className="p-2 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-700 truncate">vinhomes-grand-park-view-${id}.jpg</p>
                        <span className="text-[10px] text-slate-400">1.2 MB • Oct 10, 2026</span>
                     </div>
                  </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
