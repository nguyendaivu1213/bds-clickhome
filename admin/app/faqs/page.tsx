export default function FaqsPage() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">Hỏi Đáp (FAQ)</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Quản lý và giải đáp những câu hỏi thường gặp cho khách hàng.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all w-full sm:w-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Thêm Câu Hỏi Mới</span>
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 mb-6 sm:mb-8 shadow-sm">
        <div className="w-full">
          <div className="flex w-full items-stretch rounded-lg h-12 bg-slate-50 border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary overflow-hidden">
            <div className="text-slate-400 flex items-center justify-center pl-4">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="flex w-full border-none bg-transparent focus:ring-0 h-full placeholder:text-slate-400 text-slate-700 px-4 text-sm sm:text-base font-normal outline-none" placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..." />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap w-1/3">Câu Hỏi</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider hidden sm:table-cell">Câu Trả Lời</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Trạng Thái</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider text-right whitespace-nowrap">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { question: "Thủ tục vay mua nhà dự án như thế nào?", answer: "Khách hàng cần cung cấp CMND/CCCD, sổ hộ khẩu, giấy đăng ký kết hôn và chứng minh thu nhập...", status: "Hiện", bg: "bg-emerald-50 border border-emerald-100", color: "text-emerald-700", dot: "bg-emerald-500" },
                  { question: "Tiến độ thanh toán chuẩn là gì?", answer: "Thanh toán theo đợt mỗi 2 tháng hoặc theo tiến độ xây dựng của tầng...", status: "Hiện", bg: "bg-emerald-50 border border-emerald-100", color: "text-emerald-700", dot: "bg-emerald-500" },
                  { question: "Người nước ngoài có được mua không?", answer: "Người nước ngoài được sở hữu tối đa 30% số lượng căn hộ trong một toà nhà...", status: "Ẩn", bg: "bg-slate-100 border border-slate-200", color: "text-slate-600", dot: "bg-slate-400" }
                ].map((item, id) => (
                  <tr key={id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold text-sm break-words">{item.question}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 hidden sm:table-cell">
                      <span className="text-slate-500 text-sm line-clamp-2">
                        {item.answer}
                      </span>
                    </td>
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
