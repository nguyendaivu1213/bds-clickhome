export default function DashboardPage() {
  return (
    <>
      {/* Header Section */}
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Bảng Quản Trị Trung Tâm</h2>
        <p className="text-slate-500">Tổng quan hiệu suất toàn bộ danh mục bất động sản trong Quý 3 năm 2024.</p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <span className="material-symbols-outlined">home_work</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Tổng Dự Án</p>
          <h3 className="text-3xl font-black mt-1 text-slate-800">124</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">article</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+5.2%</span>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Bài Viết Hoạt Động</p>
          <h3 className="text-3xl font-black mt-1 text-slate-800">42</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+18.0%</span>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Lượt Truy Cập</p>
          <h3 className="text-3xl font-black mt-1 text-slate-800">1.2M</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="size-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <span className="material-symbols-outlined">leaderboard</span>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">-2.4%</span>
          </div>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Khách Hàng Mới</p>
          <h3 className="text-3xl font-black mt-1 text-slate-800">85</h3>
        </div>
      </div>

      {/* Chart & Side List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Line Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-slate-800">Hiệu Suất Nội Dung</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg">Tuần</button>
              <button className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg shadow-sm shadow-primary/20">Tháng</button>
            </div>
          </div>
          <div className="relative h-64 w-full">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,150 Q50,140 100,80 T200,60 T300,100 T400,30 T500,50 V200 H0 Z" fill="url(#chartGradient)"></path>
              <path d="M0,150 Q50,140 100,80 T200,60 T300,100 T400,30 T500,50" fill="none" stroke="#0d9488" strokeLinecap="round" strokeWidth="4"></path>
            </svg>
            <div className="flex justify-between mt-4 px-2">
              <span className="text-xs text-slate-400 font-medium">Sep 01</span>
              <span className="text-xs text-slate-400 font-medium">Sep 08</span>
              <span className="text-xs text-slate-400 font-medium">Sep 15</span>
              <span className="text-xs text-slate-400 font-medium">Sep 22</span>
              <span className="text-xs text-slate-400 font-medium">Sep 30</span>
            </div>
          </div>
        </div>

        {/* Latest Articles */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800">Bài Viết Mới Nhất</h3>
            <a className="text-primary text-xs font-bold hover:underline" href="#">Xem Tất Cả</a>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[280px] pr-2 scrollbar-thin">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="size-16 rounded-xl bg-cover bg-center shrink-0 shadow-sm" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Tin+Tuc+" + i + "&background=0d9488&color=fff')" }}></div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors line-clamp-2 leading-snug">Quy Hoạch Cảnh Quan Xanh Đô Thị Phía Đông Thời Hiện Đại {i}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">2 giờ trước • 4 phút đọc</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-bold text-lg text-slate-800">Dự Án Gần Đây</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg p-1">
              <button className="px-3 py-1.5 text-xs font-bold bg-white text-primary shadow-sm rounded-md border border-slate-100">Tất Cả</button>
              <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors">Đang Thi Công</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Tên Dự Án</th>
                <th className="px-6 py-4">Vị Trí</th>
                <th className="px-6 py-4">Trạng Thái</th>
                <th className="px-6 py-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <span className="font-bold text-sm text-slate-700">Khu Dân Cư Sinh Thái Hồ Tây</span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-500 font-medium">Hà Nội, VN</td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">Đang Triển Khai</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors p-1 bg-slate-50 rounded-md">more_vert</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
