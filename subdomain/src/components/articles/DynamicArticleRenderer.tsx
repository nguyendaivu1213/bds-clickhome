import { ProjectArticle } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DynamicArticleRenderer({ article }: { article: ProjectArticle }) {
  const trans = article.translations?.[0] || {};
  const { title, summary, html_content } = trans;
  const layout = article.layout_type || "basic_image";
  const targetLink = article.target_link;

  const LinkWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    if (targetLink) {
      return <Link href={targetLink} className={`block group ${className || ""}`}>{children}</Link>;
    }
    return <div className={className}>{children}</div>;
  };

  switch (layout) {
    case "location":
      return (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4 hover:text-[#e2cb83] transition-colors">{title}</h2>
              <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
              {summary && <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{summary}</p>}
            </div>
            <LinkWrapper>
              <div className="aspect-w-16 aspect-h-7 rounded-custom overflow-hidden shadow-md bg-white">
                {html_content ? (
                  <div dangerouslySetInnerHTML={{ __html: html_content }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:min-h-[500px]" />
                ) : (
                  <div className="w-full h-[500px] flex items-center justify-center bg-gray-200">Bản đồ đang cập nhật</div>
                )}
              </div>
              {targetLink && (
                  <div className="text-center mt-8">
                      <span className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-colors">Xem chi tiết</span>
                  </div>
              )}
            </LinkWrapper>
          </div>
        </section>
      );

    case "horizontal_slide":
      // Render a simple horizontal slide mockup (CSS only or simple flex)
      return (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 overflow-hidden">
             <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4 hover:text-[#e2cb83] transition-colors">{title}</h2>
              <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
              {summary && <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{summary}</p>}
            </div>
            
            <LinkWrapper>
                <div className="flex justify-center items-center gap-4 py-8">
                  {/* Mock 3 images based on banner_image, scaled */}
                  <div className="w-1/4 h-48 bg-gray-100 rounded-lg overflow-hidden opacity-50 shadow-sm hidden md:block transition-all group-hover:opacity-75">
                    <img src={article.banner_image_url || "https://placehold.co/600x400/eeeeee/999999"} className="w-full h-full object-cover" alt="Slide 1" />
                  </div>
                  <div className="w-full md:w-1/2 h-80 bg-gray-100 rounded-xl overflow-hidden shadow-xl z-10 transition-transform group-hover:scale-[1.02]">
                    <img src={article.banner_image_url || "https://placehold.co/800x600/cccccc/666666"} className="w-full h-full object-cover" alt="Main Slide" />
                  </div>
                  <div className="w-1/4 h-48 bg-gray-100 rounded-lg overflow-hidden opacity-50 shadow-sm hidden md:block transition-all group-hover:opacity-75">
                    <img src={article.banner_image_url || "https://placehold.co/600x400/eeeeee/999999"} className="w-full h-full object-cover" alt="Slide 3" />
                  </div>
                </div>
                {targetLink && (
                  <div className="text-center mt-6">
                      <span className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-dark transition-colors">Khám phá ngay</span>
                  </div>
                )}
            </LinkWrapper>
          </div>
        </section>
      );

    case "news_list":
      return (
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
             <div className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4">
              <div>
                 <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-2 pointer-events-auto">{title}</h2>
                 {summary && <p className="text-gray-600">{summary}</p>}
              </div>
              {targetLink && (
                  <Link href={targetLink} className="hidden md:inline-block px-6 py-2 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">Liệt kê tất cả</Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
              {/* Render placeholders for news list layout since we only have one article's data here */}
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                   <div className="h-48 bg-gray-200">
                      <img src={article.banner_image_url || `https://placehold.co/600x400?text=Tin+tức+${i}`} className="w-full h-full object-cover" alt="News" />
                   </div>
                   <div className="p-6">
                      <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">Tin tức nổi bật liên quan dự án phần {i}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3">Đây là tóm tắt danh sách tin ví dụ được render theo layout của loại danh sách tin.</p>
                   </div>
                </div>
              ))}
            </div>
            {targetLink && (
                <div className="text-center mt-8 md:hidden pointer-events-auto">
                    <Link href={targetLink} className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-md">Xem tất cả</Link>
                </div>
            )}
          </div>
        </section>
      );

    case "price_list":
    case "floor_plan_slide":
      return (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <LinkWrapper>
              <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row group-hover:shadow-primary/20 transition-all">
                  <div className="md:w-1/2 p-12 flex flex-col justify-center text-white">
                      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#e2cb83] leading-tight">{title}</h2>
                      {summary && <p className="text-gray-300 text-lg mb-8 leading-relaxed opacity-90">{summary}</p>}
                      {targetLink ? (
                           <div><span className="inline-flex items-center gap-2 font-bold text-white border-b-2 border-primary pb-1 group-hover:text-primary transition-colors">Xem chi tiết bảng giá / Layout <span className="material-symbols-outlined text-sm">arrow_forward</span></span></div>
                      ) : (
                          <div className="text-gray-400 italic text-sm">(Chưa có dữ liệu liên kết)</div>
                      )}
                  </div>
                  <div className="md:w-1/2 bg-slate-800 min-h-[400px] relative">
                      <img src={article.banner_image_url || "https://placehold.co/800x800/1e293b/475569"} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="Price List/Layout" />
                  </div>
              </div>
            </LinkWrapper>
          </div>
        </section>
      );

    case "blue_background":
      return (
        <section className="py-24 bg-[#1a365d] text-white my-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8 tracking-tight">{title}</h2>
            {summary && <p className="text-xl text-blue-100 mb-12 leading-relaxed opacity-90 font-light">{summary}</p>}
            
            {html_content && (
              <div className="prose prose-invert prose-lg mx-auto mb-12 text-blue-50" dangerouslySetInnerHTML={{ __html: html_content }} />
            )}
            
            {targetLink && (
                <Link href={targetLink} className="inline-block px-10 py-4 bg-white text-[#1a365d] font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Khám Phá Chi Tiết
                </Link>
            )}
          </div>
        </section>
      );

    case "full_image":
      return (
        <section className="py-20 bg-white">
          <div className="w-full">
            <div className="text-center mb-12 max-w-7xl mx-auto px-4">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 uppercase tracking-wide mb-6">{title}</h2>
              {summary && <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">{summary}</p>}
            </div>
            
            <LinkWrapper className="block w-full">
              {article.banner_image_url && (
                <div className="w-full relative">
                  <img src={article.banner_image_url} className="w-full h-auto object-cover" alt={title} />
                </div>
              )}
              {html_content && (
                <div className="max-w-7xl mx-auto px-4 mt-12">
                  <div className="prose prose-slate max-w-none text-gray-700 leading-loose text-lg" dangerouslySetInnerHTML={{ __html: html_content }} />
                </div>
              )}
              {targetLink && (
                  <div className="text-center mt-12">
                      <span className="inline-block px-10 py-4 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-primary-dark transition-colors">Xem chi tiết</span>
                  </div>
              )}
            </LinkWrapper>
          </div>
        </section>
      );

    case "basic_image":
    default:
      return (
        <section className="py-16 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <LinkWrapper className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/3 group-hover:shadow-2xl transition-all">
                  <img src={article.banner_image_url || "https://placehold.co/800x600"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={title} />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 group-hover:text-primary transition-colors">{title}</h2>
                <div className="w-20 h-1 bg-primary"></div>
                {summary && <p className="text-gray-600 text-lg leading-relaxed">{summary}</p>}
                {html_content && (
                   <div className="prose prose-slate max-w-none line-clamp-4 text-gray-500" dangerouslySetInnerHTML={{ __html: html_content }} />
                )}
                {targetLink && (
                    <div className="pt-4">
                        <span className="inline-flex items-center gap-2 font-bold text-primary group-hover:text-primary-dark transition-colors">
                            Tìm hiểu thêm <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                    </div>
                )}
              </div>
            </LinkWrapper>
          </div>
        </section>
      );
  }
}
