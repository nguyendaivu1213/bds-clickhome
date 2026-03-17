"use client";

import Image from "next/image";
import ProjectSubNav from "@/components/projects/ProjectSubNav";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  // Mock data for Masteri Centre Point or generic for the slug
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="bg-white">
      {/* Sub Nav specifically for Project Detail */}
      <ProjectSubNav />

      {/* Hero Banner Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-4.jpg" 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl">
          <p className="text-[#e2cb83] font-bold uppercase tracking-widest mb-4 text-sm md:text-base">Kiệt tác không gian sống</p>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 drop-shadow-md">
            {title}
          </h1>
          <p className="text-lg md:text-xl font-light mb-10 text-gray-100 max-w-2xl mx-auto drop-shadow-sm">
            Tận hưởng phong cách sống đẳng cấp quốc tế tại trung tâm thành phố mới, nơi nhịp sống năng động và thiên nhiên giao hòa.
          </p>
          <button className="bg-[#e2cb83] hover:bg-[#d4be72] text-[#4d422a] font-bold py-3 px-8 rounded-sm transition-colors uppercase tracking-wide text-sm">
            Nhận bảng giá
          </button>
        </div>
      </section>

      {/* 2. Tổng quan dự án */}
      <section id="tong-quan" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Tổng quan dự án</h2>
            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-2.jpg" 
                alt="Tổng quan" 
                className="w-full rounded-custom shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Tuyệt tác kiến trúc giữa lòng đô thị</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">
                Khu căn hộ compound (khép kín) cao cấp bậc nhất tại đại đô thị, mang đến đặc quyền riêng tư cho cộng đồng tinh hoa. Với triết lý kinh doanh "Khách hàng là trọng tâm", Masterise Homes kiến tạo nên một chuẩn mực sống quốc tế hoàn toàn mới tại Việt Nam.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start border-b border-gray-100 pb-3">
                  <span className="w-40 flex-shrink-0 text-gray-500 font-medium">Chủ đầu tư:</span>
                  <span className="font-bold text-gray-800">Masterise Homes</span>
                </li>
                <li className="flex items-start border-b border-gray-100 pb-3">
                  <span className="w-40 flex-shrink-0 text-gray-500 font-medium">Vị trí:</span>
                  <span className="font-bold text-gray-800">Trung tâm KĐT Vinhomes Grand Park, TP Thủ Đức</span>
                </li>
                <li className="flex items-start border-b border-gray-100 pb-3">
                  <span className="w-40 flex-shrink-0 text-gray-500 font-medium">Quy mô:</span>
                  <span className="font-bold text-gray-800">7.07 ha, gồm 10 tòa tháp</span>
                </li>
                <li className="flex items-start border-b border-gray-100 pb-3">
                  <span className="w-40 flex-shrink-0 text-gray-500 font-medium">Loại hình:</span>
                  <span className="font-bold text-gray-800">Căn hộ cao cấp, Duplex, Penthouse, Shophouse</span>
                </li>
                <li className="flex items-start border-b border-gray-100 pb-3">
                  <span className="w-40 flex-shrink-0 text-gray-500 font-medium">Bàn giao:</span>
                  <span className="font-bold text-gray-800">Hoàn thiện nội thất cao cấp - 2023</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vị trí dự án */}
      <section id="vi-tri" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Vị trí đắc địa</h2>
            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
          </div>
          <div className="aspect-w-16 aspect-h-7 rounded-custom overflow-hidden shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15673.493902307519!2d106.8373!3d10.8443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317521a00ba8dddd%3A0xe54ef8f20bafda40!2sVinhomes%20Grand%20Park!5e0!3m2!1sen!2svn!4v1628131235123!5m2!1sen!2svn" 
              width="100%" 
              height="500" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* 4. Layout Mặt Bằng */}
      <section id="layout" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Mặt bằng & Layout</h2>
            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-4 rounded-custom">
              <h3 className="text-center font-bold text-lg mb-4">Layout 2 Phòng Ngủ</h3>
              <img 
                src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/apartment/img-3.jpg" 
                alt="Layout 2PN"
                className="w-full cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
            <div className="border border-gray-200 p-4 rounded-custom">
              <h3 className="text-center font-bold text-lg mb-4">Layout 3 Phòng Ngủ</h3>
              <img 
                src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/apartment/img-4.jpg" 
                alt="Layout 3PN"
                className="w-full cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* 5. Tiến độ xây dựng */}
      <section id="tien-do" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Tiến độ dự án</h2>
            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group overflow-hidden rounded-custom shadow-sm">
              <img 
                src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-1.jpg" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Tiến độ 1" 
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400" }}
              />
            </div>
            <div className="group overflow-hidden rounded-custom shadow-sm">
              <img 
                src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-2.jpg" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Tiến độ 2"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400" }} 
              />
            </div>
            <div className="group overflow-hidden rounded-custom shadow-sm">
              <img 
                src="https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-3.jpg" 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Tiến độ 3" 
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x400" }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Other sections can continue to be added here based on requirement */}
      <div className="py-20 text-center text-gray-500 bg-white">
        <p>Còn nhiều phần như Ảnh 360, Chính sách, Thông tin sẽ được hiện thị ở đây và nạp động từ database/API.</p>
      </div>

    </div>
  );
}
