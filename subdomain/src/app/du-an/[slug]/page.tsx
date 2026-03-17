"use client";

import { use } from "react";
import ProjectSubNav from "@/components/projects/ProjectSubNav";

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const title = slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="bg-white">
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
          <button className="bg-[#e2cb83] hover:bg-[#d4be72] text-[#4d422a] font-bold py-3 px-8 rounded-sm transition-colors uppercase tracking-wide text-sm">
            Nhận bảng giá
          </button>
        </div>
      </section>

      {/* Tổng quan dự án */}
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
                  <span className="w-40 flex-shrink-0 text-gray-500 font-medium">Vị trí:</span>
                  <span className="font-bold text-gray-800">Trung tâm KĐT Vinhomes Grand Park, TP Thủ Đức</span>
                </li>
                <li className="flex items-start border-b border-gray-100 pb-3">
                  <span className="w-40 flex-shrink-0 text-gray-500 font-medium">Loại hình:</span>
                  <span className="font-bold text-gray-800">Căn hộ cao cấp, Duplex, Penthouse</span>
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
    </div>
  );
}
