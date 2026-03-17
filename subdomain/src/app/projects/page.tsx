"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProjectsPage() {
  return (
    <>
      {/* Search / Filter Section */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">
            Tất cả dự án Masterise Homes
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-600 max-w-3xl mx-auto mb-8">
            Khám phá trọn bộ các dự án bất động sản hàng hiệu tiêu chuẩn quốc tế từ Masterise Homes tại Việt Nam, trải dài từ các trung tâm kinh tế lớn như TP.Hồ Chí Minh và Hà Nội.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold shadow-sm">
              Tất cả
            </button>
            <button className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
              TP.Hồ Chí Minh
            </button>
            <button className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
              Hà Nội
            </button>
            <button className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
              Sắp mở bán
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Card 1 */}
          <Link href="/projects/grand-marina-saigon" className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full group">
            <div className="relative h-56 overflow-hidden">
              <img 
                alt="Grand Marina" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://masterisehomes.com/grand-marina-saigon/assets/images/home_slider01.jpg" 
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-bold text-primary">
                Đang mở bán
              </div>
            </div>
            <div className="text-center py-5 px-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Grand Marina, Saigon</h3>
            </div>
            <div className="p-6 text-[14px] leading-relaxed text-gray-600 flex-grow">
              <p className="mb-3 flex items-start"><i className="fas fa-map-marker-alt text-primary mt-1 mr-3 w-4"></i> Tôn Đức Thắng, Quận 1, TP.HCM</p>
              <p className="mb-3 flex items-start"><i className="fas fa-building text-primary mt-1 mr-3 w-4"></i> Căn hộ hạng sang</p>
              <p className="flex items-start"><i className="fas fa-calendar-alt text-primary mt-1 mr-3 w-4"></i> Bàn giao: 2024</p>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/projects/the-global-city" className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full group">
            <div className="relative h-56 overflow-hidden">
              <img 
                alt="The Global City" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://masterisehomes.com/the-global-city/images/1_homepage/S1_A2.jpg" 
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-bold text-primary">
                Đang mở bán
              </div>
            </div>
            <div className="text-center py-5 px-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">The Global City</h3>
            </div>
            <div className="p-6 text-[14px] leading-relaxed text-gray-600 flex-grow">
              <p className="mb-3 flex items-start"><i className="fas fa-map-marker-alt text-primary mt-1 mr-3 w-4"></i> An Phú, TP Thủ Đức, TP.HCM</p>
              <p className="mb-3 flex items-start"><i className="fas fa-building text-primary mt-1 mr-3 w-4"></i> Khu đô thị phức hợp</p>
              <p className="flex items-start"><i className="fas fa-calendar-alt text-primary mt-1 mr-3 w-4"></i> Bàn giao: 2024-2025</p>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/projects/masteri-centre-point" className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full group">
            <div className="relative h-56 overflow-hidden">
              <img 
                alt="Masteri Centre Point" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-4.jpg" 
              />
              <div className="absolute top-4 left-4 bg-gray-600/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-bold text-white">
                Đã bàn giao
              </div>
            </div>
            <div className="text-center py-5 px-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Masteri Centre Point</h3>
            </div>
            <div className="p-6 text-[14px] leading-relaxed text-gray-600 flex-grow">
              <p className="mb-3 flex items-start"><i className="fas fa-map-marker-alt text-primary mt-1 mr-3 w-4"></i> Vinhomes Grand Park, TP Thủ Đức</p>
              <p className="mb-3 flex items-start"><i className="fas fa-building text-primary mt-1 mr-3 w-4"></i> Căn hộ cao cấp</p>
              <p className="flex items-start"><i className="fas fa-calendar-alt text-primary mt-1 mr-3 w-4"></i> Bàn giao: 2023</p>
            </div>
          </Link>
          
          {/* Card 4 */}
          <Link href="/projects/lumiere-boulevard" className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full group">
            <div className="relative h-56 overflow-hidden">
              <img 
                alt="Lumiere Boulevard" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://masterisehomes.com/lumiere-boulevard/images/LumiereBLVD-Phoidiem.jpg" 
                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600?text=Lumiere+Boulevard" }}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-bold text-primary">
                Đang mở bán
              </div>
            </div>
            <div className="text-center py-5 px-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">LUMIÈRE Boulevard</h3>
            </div>
            <div className="p-6 text-[14px] leading-relaxed text-gray-600 flex-grow">
              <p className="mb-3 flex items-start"><i className="fas fa-map-marker-alt text-primary mt-1 mr-3 w-4"></i> Vinhomes Grand Park, TP Thủ Đức</p>
              <p className="mb-3 flex items-start"><i className="fas fa-building text-primary mt-1 mr-3 w-4"></i> Căn hộ cao cấp</p>
              <p className="flex items-start"><i className="fas fa-calendar-alt text-primary mt-1 mr-3 w-4"></i> Bàn giao: 2024</p>
            </div>
          </Link>

          {/* Card 5 */}
          <Link href="/projects/masteri-west-heights" className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full group">
            <div className="relative h-56 overflow-hidden">
              <img 
                alt="Masteri West Heights" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://masterisehomes.com/masteri-west-heights/images/Home/S2.jpg" 
                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600?text=Masteri+West+Heights" }}
              />
              <div className="absolute top-4 left-4 bg-gray-600/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-bold text-white">
                Đã bàn giao
              </div>
            </div>
            <div className="text-center py-5 px-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Masteri West Heights</h3>
            </div>
            <div className="p-6 text-[14px] leading-relaxed text-gray-600 flex-grow">
              <p className="mb-3 flex items-start"><i className="fas fa-map-marker-alt text-primary mt-1 mr-3 w-4"></i> Vinhomes Smart City, Tây Mỗ, Hà Nội</p>
              <p className="mb-3 flex items-start"><i className="fas fa-building text-primary mt-1 mr-3 w-4"></i> Căn hộ cao cấp</p>
              <p className="flex items-start"><i className="fas fa-calendar-alt text-primary mt-1 mr-3 w-4"></i> Bàn giao: 2023</p>
            </div>
          </Link>
          
          {/* Card 6 */}
          <Link href="/projects/masteri-waterfront" className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full group">
            <div className="relative h-56 overflow-hidden">
              <img 
                alt="Masteri Waterfront" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://masterisehomes.com/masteri-waterfront/images/homepage/m1.jpg" 
                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x600?text=Masteri+Waterfront" }}
              />
              <div className="absolute top-4 left-4 bg-gray-600/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-bold text-white">
                Đã bàn giao
              </div>
            </div>
            <div className="text-center py-5 px-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">Masteri Waterfront</h3>
            </div>
            <div className="p-6 text-[14px] leading-relaxed text-gray-600 flex-grow">
              <p className="mb-3 flex items-start"><i className="fas fa-map-marker-alt text-primary mt-1 mr-3 w-4"></i> Vinhomes Ocean Park, Gia Lâm, Hà Nội</p>
              <p className="mb-3 flex items-start"><i className="fas fa-building text-primary mt-1 mr-3 w-4"></i> Căn hộ cao cấp</p>
              <p className="flex items-start"><i className="fas fa-calendar-alt text-primary mt-1 mr-3 w-4"></i> Bàn giao: 2023</p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
