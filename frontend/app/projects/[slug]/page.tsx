import Link from "next/link";

export default function ProjectDetailPage() {
  return (
    <div className="flex flex-col min-h-screen bg-light dark:bg-dark">
      {/* Project Hero Image */}
      <section className="relative h-[60vh] min-h-[500px]">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Masteri Centre Point" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-6 w-full pb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm">Khu Căn Hộ Cao Cấp</span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider rounded-sm">Đang mở bán</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Masteri Centre Point</h1>
            <p className="text-xl text-slate-200 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Đại đô thị Vinhomes Grand Park, Quận 9, TP Thủ Đức
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Stats Banner */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-sm shadow-sm border border-black/5 dark:border-white/5 flex flex-wrap justify-between gap-8">
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-1">Giá bán</p>
                <div className="text-2xl font-bold text-primary">Từ 5 Tỷ</div>
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-1">Quy mô</p>
                <div className="text-2xl font-bold text-secondary dark:text-white">7.07 ha</div>
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-1">Chủ đầu tư</p>
                <div className="text-2xl font-bold text-secondary dark:text-white">Masterise Homes</div>
              </div>
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-1">Bàn giao</p>
                <div className="text-2xl font-bold text-secondary dark:text-white">Năm 2024</div>
              </div>
            </div>

            {/* Content Text */}
            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:text-secondary dark:prose-headings:text-white prose-a:text-primary">
              <h2 className="text-3xl font-display font-bold text-secondary dark:text-white mb-6">Tổng quan dự án</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Masteri Centre Point là khu căn hộ compound (khép kín) cao cấp bậc nhất tại trung tâm đại đô thị Vinhomes Grand Park. Sở hữu vị trí độc tôn "trái tim" của đại công viên 36ha, dự án mang đến không gian sống đẳng cấp với tầm nhìn không giới hạn và chuỗi tiện ích đặc quyền chuẩn quốc tế.
              </p>
              <h3 className="text-2xl font-display font-bold text-secondary dark:text-white mb-4 mt-8">Vị trí Kim Cương</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Tọa lạc tại vùng lõi trung tâm của Vinhomes Grand Park, Masteri Centre Point kiêu hãnh hưởng trọn tầm nhìn 360 độ ra sông Đồng Nai, sông Tắc, biển hồ cát trắng nhân tạo.
              </p>
              
              <div className="grid grid-cols-2 gap-4 my-8">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Interior" className="rounded-sm w-full h-48 object-cover" />
                <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Pool" className="rounded-sm w-full h-48 object-cover" />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-secondary dark:text-white mb-4 mt-8">Hệ thống tiện ích đặc quyền</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300">
                <li>Hồ bơi phi thuyền Spaceship 2 tầng kết hợp Jacuzzi</li>
                <li>Công viên nội khu thiết kế theo phong cách Futuristic</li>
                <li>Khu vực đọc sách và làm việc thư giãn ngoài trời</li>
                <li>Phòng Gym & Yoga tiêu chuẩn quốc tế với thiết bị hiện đại</li>
                <li>Khu vui chơi trẻ em Kid's Zone tương tác cao</li>
              </ul>
            </article>

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-slate-900 p-8 rounded-sm shadow-lg border-t-4 border-primary">
              <h3 className="text-2xl font-display font-bold text-secondary dark:text-white mb-2">Nhận thông tin dự án</h3>
              <p className="text-sm text-slate-500 mb-6">Để lại thông tin để nhận bảng giá, layout và chính sách ưu đãi mới nhất.</p>
              
              <form className="space-y-4 text-sm">
                <div>
                  <input type="text" placeholder="Họ và tên của bạn *" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-sm px-4 py-3 outline-none focus:ring-1 focus:ring-primary text-secondary dark:text-white" />
                </div>
                <div>
                  <input type="tel" placeholder="Số điện thoại *" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-sm px-4 py-3 outline-none focus:ring-1 focus:ring-primary text-secondary dark:text-white" />
                </div>
                <div>
                  <input type="email" placeholder="Email (Không bắt buộc)" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-sm px-4 py-3 outline-none focus:ring-1 focus:ring-primary text-secondary dark:text-white" />
                </div>
                <div>
                  <textarea placeholder="Ghi chú thêm..." rows={3} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-sm px-4 py-3 outline-none focus:ring-1 focus:ring-primary text-secondary dark:text-white resize-none"></textarea>
                </div>
                <button type="button" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-sm transition-colors text-base shadow-lg shadow-primary/30">
                  GỬI YÊU CẦU TƯ VẤN
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Hotline hỗ trợ 24/7</p>
                  <p className="text-lg font-bold text-secondary dark:text-white">1900 1234 56</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
