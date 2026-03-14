export default function PostsPage() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">Quản Lý Bài Viết</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Tạo dựng, chỉnh sửa và tổ chức danh mục nội dung bất động sản.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all w-full sm:w-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Thêm Bài Mới</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 mb-6 sm:mb-8 shadow-sm">
        <div className="w-full">
          <div className="flex w-full items-stretch rounded-lg h-12 bg-slate-50 border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary overflow-hidden">
            <div className="text-slate-400 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="flex w-full border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-400 text-slate-700 px-4 text-sm sm:text-base font-normal outline-none" placeholder="Tìm tên bài, tác giả hoặc từ khoá..." />
          </div>
        </div>
        {/* Scroll ngang trên mobile */}
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 items-center gap-2 scrollbar-hide shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">Bộ lọc:</span>
          <div className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-5 cursor-pointer text-sm font-semibold shrink-0">Tất Cả</div>
          <div className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 px-5 cursor-pointer text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all shrink-0">Tin Thị Trường</div>
          <div className="flex h-9 items-center justify-center gap-x-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 px-5 cursor-pointer text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all shrink-0">Nội Thất</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Tiêu đề</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider hidden sm:table-cell whitespace-nowrap">Danh Mục</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider hidden md:table-cell whitespace-nowrap">Đăng Ngày</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Trạng Thái</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider text-right whitespace-nowrap">Sửa/Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { title: "Xu hướng Bất động sản Đô thị 2024", cat: "Tin Thị Trường", status: "Đã Đăng", bg: "bg-emerald-50 border border-emerald-100", color: "text-emerald-700", dot: "bg-emerald-500", date: "12 Th10, 2023" },
                  { title: "Top 10 Nội Thất Tối Giản 2024", cat: "Nội Thất", status: "Bản Nháp", bg: "bg-slate-100 border border-slate-200", color: "text-slate-600", dot: "bg-slate-400", date: "05 Th10, 2023" },
                  { title: "Cập Nhật Tiến Độ Toà Tháp Chọc Trời", cat: "Cập nhật", status: "Đã Đăng", bg: "bg-emerald-50 border border-emerald-100", color: "text-emerald-700", dot: "bg-emerald-500", date: "22 Th09, 2023" }
                ].map((item, id) => (
                  <tr key={id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4 sm:py-5 max-w-[200px] sm:max-w-none">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold text-sm truncate">{item.title}</span>
                        <span className="text-xs text-slate-400 truncate">slug: /article-{id}</span>
                        {/* Xuất hiện Cat/Date trên mobile nếu bị ẩn trên table head */}
                        <div className="flex sm:hidden gap-2 mt-1">
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{item.cat}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 hidden sm:table-cell">
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700 border border-teal-100">
                        {item.cat}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-slate-500 text-sm hidden md:table-cell whitespace-nowrap">{item.date}</td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full ${item.bg} px-3 py-1 text-xs font-bold ${item.color} whitespace-nowrap`}>
                        <span className={`size-1.5 rounded-full ${item.dot}`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button className="p-1 sm:p-1.5 text-slate-400 hover:text-primary transition-colors bg-white rounded-md shadow-sm border border-slate-200">
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">edit</span>
                        </button>
                        <button className="p-1 sm:p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-md shadow-sm border border-slate-200">
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">delete</span>
                        </button>
                      </div>
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
