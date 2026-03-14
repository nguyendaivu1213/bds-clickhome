export default function EditorPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm mb-2 font-medium">
          <a className="hover:text-primary transition-colors" href="#">Bài Viết</a>
          <span className="material-symbols-outlined text-[10px] sm:text-xs">chevron_right</span>
          <span className="text-slate-900">Tạo Mới Bài Viết</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Bài viết Chưa Cập Nhật Tiêu Đề</h1>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none justify-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">visibility</span> <span className="hidden sm:inline">Xem Thử</span>
            </button>
            <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors">
              Lưu Nháp
            </button>
            <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm shadow-primary/20">
              Xuất Bản
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm relative focus-within:ring-2 ring-primary/20 transition-all">
            <label className="block mb-2 text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider">Tiêu Đề Bài Viết</label>
            <input className="w-full text-xl sm:text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-300 text-slate-900 outline-none" placeholder="Nhập một tiêu đề thật thu hút..." type="text" />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px] sm:min-h-[500px] focus-within:ring-2 ring-primary/20 transition-all">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 bg-slate-50 overflow-x-auto scrollbar-hide py-3 sm:py-2">
              <button className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all shrink-0"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
              <button className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all shrink-0"><span className="material-symbols-outlined text-[20px]">format_italic</span></button>
              <button className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all shrink-0"><span className="material-symbols-outlined text-[20px]">format_underlined</span></button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all shrink-0"><span className="material-symbols-outlined text-[20px]">format_h1</span></button>
              <button className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all shrink-0"><span className="material-symbols-outlined text-[20px]">format_h2</span></button>
              <div className="w-px h-6 bg-slate-200 mx-1"></div>
              <button className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all shrink-0"><span className="material-symbols-outlined text-[20px]">link</span></button>
              <button className="p-1.5 sm:p-2 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all shrink-0"><span className="material-symbols-outlined text-[20px]">image</span></button>
            </div>
            <textarea className="flex-1 w-full p-4 sm:p-8 bg-transparent border-none focus:ring-0 text-slate-800 resize-none min-h-[300px] sm:min-h-[400px] leading-relaxed outline-none" placeholder="Bắt đầu gõ kiệt tác của bạn tại đây..."></textarea>
          </div>
        </div>

        <aside className="lg:col-span-4 xl:col-span-3 space-y-4 sm:space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100">Xuất Bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Trạng thái</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 outline-none rounded-lg text-sm p-3 appearance-none transition-colors cursor-pointer text-slate-700 font-medium font-sans block">
                    <option>Bản Nháp (Draft)</option>
                    <option>Đã Đăng (Published)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100">Tổ Chức</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Chuyên Mục</label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 outline-none rounded-lg text-sm p-3 appearance-none transition-colors cursor-pointer text-slate-700 font-medium font-sans block">
                    <option>Chọn Chuyên Mục</option>
                    <option>Dự án nổi bật</option>
                    <option>Tin Thời Sự Đầu Tư</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
