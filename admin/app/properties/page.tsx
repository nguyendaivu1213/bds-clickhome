export default function PropertiesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-6 mb-4 lg:mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Sản Phẩm Khối Lẻ (BĐS)</h1>
          <p className="text-slate-500 mt-1 lg:mt-2 text-base lg:text-lg">Quản lý từng unit, quỹ căn, và giá cả thuộc các phân khu dự án.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto">
          <span className="material-symbols-outlined">add</span>
          <span>Thêm Sản Phẩm</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 lg:p-4 mb-6 lg:mb-8 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all" placeholder="Tìm kiếm theo mã căn, toà nhà..." type="text" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Mã Căn Hộ</th>
                  <th className="px-4 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Phân Khu & Dự Án</th>
                  <th className="px-4 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Thông Số</th>
                  <th className="px-4 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Giá Bán</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { code: "S1.01-05.12A", project: "Vinhomes Grand Park", zone: "The Rainbow", type: "2PN+1", area: "68m2", floor: "05", price: "2.8 Tỷ", status: "Còn Hàng", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
                  { code: "S1.01-05.15", project: "Vinhomes Grand Park", zone: "The Rainbow", type: "1PN", area: "45m2", floor: "05", price: "1.9 Tỷ", status: "Đã Bán", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-500" },
                  { code: "BV-09.20", project: "Vinhomes Grand Park", zone: "The Beverly", type: "3PN", area: "100m2", floor: "09", price: "6.5 Tỷ", status: "Giữ Chỗ", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
                ].map((item, id) => (
                  <tr key={id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-slate-900 font-bold">{item.code}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-primary font-semibold text-sm">{item.zone}</span>
                        <span className="text-xs text-slate-500">{item.project}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col text-sm text-slate-700">
                        <span><span className="font-semibold text-slate-400 mr-1">Loại:</span>{item.type}</span>
                        <span><span className="font-semibold text-slate-400 mr-1">DT:</span>{item.area} / Tầng: {item.floor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-red-600">{item.price}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full ${item.bg} px-3 py-1 text-xs font-bold ${item.text} whitespace-nowrap`}>
                        <span className={`size-1.5 rounded-full ${item.dot}`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                       <button className="p-1.5 text-slate-400 hover:text-primary transition-colors bg-white rounded-md shadow-sm border border-slate-200">
                         <span className="material-symbols-outlined text-[20px]">edit</span>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
