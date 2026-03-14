export default function ZonesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-6 mb-4 lg:mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Phân Khu Dự Án</h1>
          <p className="text-slate-500 mt-1 lg:mt-2 text-base lg:text-lg">Quản lý các zone, phân khu khu vực nhỏ lẻ trong các siêu dự án Bất Động Sản.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto">
          <span className="material-symbols-outlined">add</span>
          <span>Thêm Phân Khu</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 lg:p-4 mb-6 lg:mb-8 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all" placeholder="Tìm phân khu bằng tên hoặc chọn dự án..." type="text" />
          </div>
          <div className="flex overflow-x-auto pb-1 -mx-3 px-3 xl:mx-0 xl:px-0 xl:pb-0 gap-2 shrink-0 scrollbar-hide">
            <button className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold border border-dashed border-slate-300">
              <span className="material-symbols-outlined text-xl">filter_list</span>
              <span>Lọc theo Dự án gốc</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {[
          { name: "The Beverly Solari", project: "Vinhomes Grand Park", status: "Mở Bán", color: "bg-emerald-500", text: "text-emerald-500", imgSuffix: "solari", isOverview: true },
          { name: "The Rainbow", project: "Vinhomes Grand Park", status: "Bàn Giao", color: "bg-blue-500", text: "text-blue-500", imgSuffix: "rainbow", isOverview: false },
          { name: "Miyabe (Nhật Bản)", project: "Vinhomes Grand Park", status: "Đang Thi Công", color: "bg-amber-500", text: "text-amber-500", imgSuffix: "miyabe", isOverview: true },
        ].map((item, idx) => (
          <div key={idx} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col">
            <div className="relative h-40 overflow-hidden">
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-2.5 py-1 rounded-md ${item.color} text-white text-[10px] font-bold uppercase tracking-widest shadow-md`}>{item.status}</span>
              </div>
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={`https://ui-avatars.com/api/?name=${item.imgSuffix}&background=334155&color=fff`} alt={item.name} />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1 truncate">{item.project}</p>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">{item.name}</h3>
              <div className="mt-auto flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                <span className="font-medium text-slate-500">Overview Page:</span>
                <span className="material-symbols-outlined text-lg" style={{ color: item.isOverview ? '#10b981' : '#cbd5e1' }}>{item.isOverview ? "toggle_on" : "toggle_off"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
