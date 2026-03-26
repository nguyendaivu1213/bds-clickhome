import { fetchInvestor } from "@/lib/api";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts.length >= 3 ? parts[0] : "";

  const investor = await fetchInvestor(subdomain);
  if (!investor) return { title: "Giới thiệu" };

  return {
    title: `Giới thiệu - ${investor.name}`,
    description: investor.short_description || `Thông tin chi tiết về chủ đầu tư ${investor.name}`,
  };
}

export default async function AboutPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const parts = host.split(".");
  const subdomain = parts.length >= 3 ? parts[0] : "";

  const investor = await fetchInvestor(subdomain);

  if (!investor) {
    notFound();
  }

  const stats = investor.stats || [];
  const benefits = investor.benefits || [];

  return (
    <main className="bg-white font-sans text-slate-700 overflow-x-hidden">
      {/* Breadcrumb Section */}
      <div className="bg-[#f5f5f5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center text-[13px] text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="font-medium text-gray-600">Về chúng tôi – {investor.name}</span>
        </div>
      </div>

      {/* Intro Quote */}
      <section className="pt-20 pb-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[17px] md:text-[19px] leading-[1.8] text-gray-800 italic max-w-5xl mx-auto">
            {investor.short_description || `${investor.name} là đơn vị phát triển bất động sản uy tín, mang đến những giá trị sống khác biệt thông qua các dự án chất lượng cao.`}
          </p>
        </div>
      </section>

      {/* Main Content: Circular Image & Text */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left: Circular Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[480px] aspect-square rounded-full overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-gray-100 p-2 bg-white">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={investor.about_image_url || investor.about_image || '/placeholder-investor.jpg'}
                  alt={investor.name}
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>

          {/* Right: Text Details */}
          <div className="lg:col-span-7 pt-4">
            <h2 className="text-[28px] md:text-[34px] font-black text-[#1a1a1a] leading-tight uppercase mb-8 tracking-normal">
              {investor.name} – VÌ CỘNG ĐỒNG NGƯỜI MUA NHÀ
            </h2>

            <div
              className="prose prose-slate max-w-none text-[15px] md:text-[16.5px] text-[#4d4d4d] leading-[1.9] text-justify font-light prose-p:mb-5"
              dangerouslySetInnerHTML={{ __html: investor.content || "" }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section with Resort Background */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 scale-105">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            className="w-full h-full object-cover grayscale-[0.3]"
            alt="Resort View"
          />
          <div className="absolute inset-0 bg-[#163e63]/90"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold uppercase mb-3 tracking-wider">
            {investor.name} & NHỮNG CON SỐ BIẾT NÓI
          </h2>
          <p className="text-[15px] text-sky-100 mb-16 font-light italic">
            Sau hơn 5 năm thành lập, chúng tôi đã cùng nhau:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 max-w-5xl mx-auto">
            {(stats.length > 0 ? stats.slice(0, 3) : [
              { number: '500+', label: 'Giúp hơn 500 khách hàng tìm được căn nhà ưng ý' },
              { number: '100+', label: 'Đào tạo hơn 100 nhân viên có chuyên môn cao trong lĩnh vực bất động sản' },
              { number: '50+', label: 'Chia sẻ hơn 50 kiến thức bổ ích về lĩnh vực bất động sản' }
            ]).map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-[54px] md:text-[64px] font-black leading-none drop-shadow-md">
                    {stat.number}
                  </span>
                </div>
                <p className="text-[14px] md:text-[15px] leading-relaxed text-sky-50 font-light max-w-[280px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Banner Section */}
      <section className="bg-[#245b8d] py-7 px-6">
        <h2 className="text-[20px] md:text-[26px] font-bold text-center text-white uppercase tracking-wider">
          BẠN ĐƯỢC GÌ KHI LÀM VIỆC CÙNG {investor.name}?
        </h2>
      </section>

      {/* Benefits Content Section */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-24">
          {(benefits.length > 0 ? benefits : [
            { title: "ĐƯỢC MUA VỚI GIÁ TỐT NHẤT", description: "Lựa chọn chúng tôi, bạn sẽ được mua các sản phẩm với giá niêm yết từ chủ đầu tư.", icon: "monetization_on" },
            { title: "ĐƯỢC TƯ VẤN CHUYÊN SÂU", description: "Đội ngũ chuyên viên giàu kinh nghiệm, nắm rõ quy hoạch và tiềm năng tăng giá.", icon: "visibility" },
            { title: "HỖ TRỢ TRỌN ĐỜI", description: "Chăm sóc khách hàng tận tâm, hỗ trợ các thủ tục hậu mãi nhanh chóng.", icon: "assignment_turned_in" },
            { title: "HỖ TRỢ BÁN LẠI", description: "Mạng lưới khách hàng rộng khắp, hỗ trợ thanh toán và ra hàng nhanh.", icon: "mail" }
          ]).map((benefit, idx) => (
            <div key={idx} className="relative bg-[#f8f9fa] p-12 pt-16 rounded-sm text-center border border-gray-100 group transition-all">
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 w-[72px] h-[72px] bg-[#4a4a4a] text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors duration-500">
                {idx === 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : idx === 1 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>                  
                ) : idx === 2 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>                  
                )}
              </div>
              <h3 className="text-[18px] md:text-[20px] font-black text-[#333] mb-5 uppercase tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-[14px] md:text-[15.5px] leading-[1.7] text-[#666] font-light">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
