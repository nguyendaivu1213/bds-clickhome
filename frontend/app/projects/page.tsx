import Link from "next/link";

export default function ProjectsPage() {
  const projects = [
    { title: "Masteri Centre Point", location: "Quận 9, TP. Hồ Chí Minh", price: "Từ 5 Tỷ", status: "Đang mở bán", type: "Căn hộ cao cấp", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", tag: "Hot" },
    { title: "The Global City", location: "Quận 2, TP. Hồ Chí Minh", price: "Từ 30 Tỷ", status: "Sắp mở bán", type: "Khu Đô Thị Mới", img: "https://images.unsplash.com/photo-1613490908578-f73ac8f10dd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", tag: "Luxury" },
    { title: "Glory Heights", location: "Quận 9, TP. Hồ Chí Minh", price: "Từ 3.5 Tỷ", status: "Đang mở bán", type: "Căn hộ", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", tag: "" },
    { title: "Vinhomes Grand Park", location: "Quận 9, TP. Hồ Chí Minh", price: "Từ 2 Tỷ", status: "Đã bàn giao", type: "Đại đô thị", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", tag: "" },
    { title: "The River Thủ Thiêm", location: "Quận 2, TP. Hồ Chí Minh", price: "Từ 15 Tỷ", status: "Đã bàn giao", type: "Căn hộ hạng sang", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", tag: "Premium" },
    { title: "Zeit River County 1", location: "Nhà Bè, TP. Hồ Chí Minh", price: "Từ 12 Tỷ", status: "Đang mở bán", type: "Biệt thự, Nhà phố", img: "https://images.unsplash.com/photo-1605276374104-a628b0acaafb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", tag: "Mới" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-light dark:bg-dark">
      {/* Page Header */}
      <section className="bg-secondary dark:bg-black pt-32 pb-20 relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Bộ Sưu Tập Trang Chủ</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-6">
            Dự Án Bất Động Sản <br /> Tuyển Chọn
          </h1>
          <p className="text-slate-300 max-w-2xl text-lg">
            Khám phá danh mục các dự án bất động sản cao cấp, đáp ứng mọi nhu cầu an cư và đánh thức tiềm năng đầu tư mạnh mẽ.
          </p>
        </div>
      </section>

      {/* Filter / Search Bar */}
      <section className="py-8 border-b border-black/5 dark:border-white/5 bg-white dark:bg-dark sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex bg-slate-100 dark:bg-slate-900 rounded-sm overflow-hidden border border-slate-200 dark:border-slate-800">
            <span className="pl-4 flex items-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
            <input type="text" placeholder="Tìm kiếm dự án..." className="w-full bg-transparent px-3 py-3 outline-none text-secondary dark:text-white" />
          </div>
          <div className="flex gap-4">
            <select className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-4 py-3 outline-none text-secondary dark:text-white min-w-[200px]">
              <option>Khu vực</option>
              <option>Quận 2</option>
              <option>Quận 9</option>
              <option>Nhà Bè</option>
            </select>
            <select className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm px-4 py-3 outline-none text-secondary dark:text-white min-w-[200px]">
              <option>Loại hình</option>
              <option>Căn hộ cao cấp</option>
              <option>Biệt thự</option>
              <option>Nhà phố</option>
            </select>
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-20 flex-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((p, idx) => (
              <Link href={`/projects/${p.title.toLowerCase().replace(/ /g, '-')}`} key={idx} className="group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  {p.tag && (
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 text-secondary text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm backdrop-blur-md">{p.tag}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">{p.status}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-secondary dark:text-white mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-slate-500 mb-4 flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {p.location}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                    <div className="text-primary font-bold text-lg">{p.price}</div>
                    <div className="text-sm font-semibold text-secondary dark:text-slate-300">{p.type}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-colors">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-primary text-white font-bold">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-sm border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-colors">3</button>
            <span className="w-10 h-10 flex items-center justify-center text-slate-500">...</span>
          </div>
        </div>
      </section>
    </div>
  );
}
