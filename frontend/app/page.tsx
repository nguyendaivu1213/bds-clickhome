import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" 
            alt="Luxury Home Desktop" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pt-20">
          <div className="max-w-2xl text-white space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/50 text-primary text-sm font-semibold tracking-wide uppercase backdrop-blur-md">
              Bộ Sưu Tập Mới Nhất 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1]">
              Khám Phá <br /> Không Gian <span className="text-primary italic">Tuyệt Tác</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-xl">
              Nền tảng giao dịch bất động sản cao cấp hàng đầu Việt Nam. Nơi kiến tạo giá trị sống đích thực và cơ hội đầu tư bền vững.
            </p>
            
            {/* Search Box */}
            <div className="mt-8 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 flex flex-col md:flex-row gap-2 max-w-3xl">
              <input 
                type="text" 
                placeholder="Nhập tên dự án, khu vực..." 
                className="flex-1 bg-transparent text-white placeholder:text-white/60 px-4 py-3 outline-none focus:ring-0"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Tìm Kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-light dark:bg-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Bộ Sưu Tập</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-white leading-tight">
                Dự Án Nổi Bật
              </h2>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold group transition-colors">
              Xem tất cả dự án
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Project Card 1 */}
            <Link href="/projects/masteri-centre-point" className="group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 text-secondary text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm backdrop-blur-md">Hot</span>
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">Đang mở bán</span>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Masteri Centre Point" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors">Masteri Centre Point</h3>
                <p className="text-slate-500 mb-4 flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Quận 9, TP. Hồ Chí Minh
                </p>
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div className="text-primary font-bold text-lg">Từ 5Tỷ / Căn</div>
                  <div className="text-sm font-semibold text-secondary dark:text-slate-300">Căn hộ cao cấp</div>
                </div>
              </div>
            </Link>

            {/* Project Card 2 */}
            <Link href="/projects/the-global-city" className="group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 text-secondary text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm backdrop-blur-md">Luxury</span>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1613490908578-f73ac8f10dd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="The Global City" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors">The Global City</h3>
                <p className="text-slate-500 mb-4 flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Quận 2, TP. Hồ Chí Minh
                </p>
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div className="text-primary font-bold text-lg">Từ 30Tỷ / Căn</div>
                  <div className="text-sm font-semibold text-secondary dark:text-slate-300">Khu Đô Thị Mới</div>
                </div>
              </div>
            </Link>

            {/* Project Card 3 */}
            <Link href="/projects/glory-heights" className="group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Glory Heights" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors">Glory Heights</h3>
                <p className="text-slate-500 mb-4 flex items-center gap-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Quận 9, TP. Hồ Chí Minh
                </p>
                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <div className="text-primary font-bold text-lg">Từ 3.5Tỷ / Căn</div>
                  <div className="text-sm font-semibold text-secondary dark:text-slate-300">Căn hộ tiện nghi</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-secondary to-dark" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 text-center">
            <div className="px-4">
              <div className="text-5xl font-display font-bold text-primary mb-2">12+</div>
              <div className="text-sm uppercase tracking-wider font-semibold text-slate-400">Năm Kinh Nghiệm</div>
            </div>
            <div className="px-4">
              <div className="text-5xl font-display font-bold text-primary mb-2">5K+</div>
              <div className="text-sm uppercase tracking-wider font-semibold text-slate-400">Khách Hàng</div>
            </div>
            <div className="px-4">
              <div className="text-5xl font-display font-bold text-primary mb-2">45+</div>
              <div className="text-sm uppercase tracking-wider font-semibold text-slate-400">Dự Án Lớn</div>
            </div>
            <div className="px-4">
              <div className="text-5xl font-display font-bold text-primary mb-2">150</div>
              <div className="text-sm uppercase tracking-wider font-semibold text-slate-400">Chuyên Gia</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-white dark:bg-slate-900 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary dark:text-white mb-6">Bạn Cần Tư Vấn Bất Động Sản?</h2>
          <p className="text-lg text-slate-500 mb-10">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn tìm kiếm không gian sống lý tưởng và đầu tư hiệu quả nhất.
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-sm font-bold text-lg transition-all shadow-lg shadow-primary/30">
            Liên Hệ Ngay
          </button>
        </div>
      </section>
    </div>
  );
}
