"use client";

import { useInvestor } from "@/context/InvestorContext";

export default function NewsPage() {
  const { investor, loading } = useInvestor();
  const investorName = investor?.name || '...';

  return (
    <>
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">
            Thông tin {loading ? '' : investorName}
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-600 max-w-3xl mx-auto mb-8">
            Cập nhật tin tức mới nhất về các dự án, sự kiện và hoạt động nổi bật từ nhà phát triển bất động sản {investorName}.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* News articles */}
          <div className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full cursor-pointer">
            <img
              alt="News"
              className="w-full h-40 object-cover"
              src="https://masterisehomes.com/images/news-1.jpg"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=Tin+Tuc+1" }}
            />
            <div className="p-4 text-[13px] flex-grow">
              <p className="text-primary font-bold mb-2">12/03/2026</p>
              <h3 className="font-bold text-gray-800 text-[15px] mb-2 leading-tight hover:text-primary transition-colors">
                {investorName} Ký Kết Hợp Tác Giai Đoạn Mới Cùng Các Đối Tác Quốc Tế
              </h3>
              <p className="text-gray-600 line-clamp-3">{investorName} chính thức ký kết hợp tác cùng tập đoàn Foster + Partners để phát triển trung tâm toàn cầu mới The Global City tại TP Thủ Đức.</p>
            </div>
          </div>

          <div className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full cursor-pointer">
            <img
              alt="News"
              className="w-full h-40 object-cover"
              src="https://masterisehomes.com/images/news-2.jpg"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=Tin+Tuc+2" }}
            />
            <div className="p-4 text-[13px] flex-grow">
              <p className="text-primary font-bold mb-2">08/03/2026</p>
              <h3 className="font-bold text-gray-800 text-[15px] mb-2 leading-tight hover:text-primary transition-colors">
                LUMIÈRE Boulevard Khởi Động Chuỗi Sự Kiện Trải Nghiệm Phong Cách Sống Xanh Đẳng Cấp
              </h3>
              <p className="text-gray-600 line-clamp-3">Mảng xanh rộng lớn kiến tạo môi trường sống tuyệt vời hiếm có ngay trung tâm Grand Park, mang đến trải nghiệm 3D độc đáo.</p>
            </div>
          </div>

          <div className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full cursor-pointer">
            <img
              alt="News"
              className="w-full h-40 object-cover"
              src="https://masterisehomes.com/images/news-3.jpg"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=Tin+Tuc+3" }}
            />
            <div className="p-4 text-[13px] flex-grow">
              <p className="text-primary font-bold mb-2">01/03/2026</p>
              <h3 className="font-bold text-gray-800 text-[15px] mb-2 leading-tight hover:text-primary transition-colors">
                Tiến Độ Xây Dựng Dự Án Grand Marina, Saigon Cập Nhật Mới Nhất Tháng 3/2026
              </h3>
              <p className="text-gray-600 line-clamp-3">Cập nhật hình ảnh thi công thực tế tại công trường Grand Marina Saigon, cam kết tiến độ bàn giao đúng hạn cho khách hàng.</p>
            </div>
          </div>

          <div className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full cursor-pointer">
            <img
              alt="News"
              className="w-full h-40 object-cover"
              src="https://masterisehomes.com/images/news-4.jpg"
              onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=Tin+Tuc+4" }}
            />
            <div className="p-4 text-[13px] flex-grow">
              <p className="text-primary font-bold mb-2">25/02/2026</p>
              <h3 className="font-bold text-gray-800 text-[15px] mb-2 leading-tight hover:text-primary transition-colors">
                Vinh Dự Nhận Giải Thưởng Nhà Phát Triển Bất Động Sản Quốc Tế Tốt Nhất
              </h3>
              <p className="text-gray-600 line-clamp-3">{investorName} vượt qua nhiều đối thủ nặng ký để vinh dự nhận giải thưởng cao giá tại Asia Property Awards.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
