"use client";

import { use, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { fetchProject, fetchArticlesForProject, fetchProjectZones, Project, ProjectArticle, ProjectZone } from "@/lib/api";
import DynamicArticleRenderer from "@/components/articles/DynamicArticleRenderer";

function getYouTubeEmbedUrl(url: string | null | undefined) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default function ProjectSectionPage({
    params,
}: {
    params: Promise<{ slug: string; section: string }>;
}) {
    const { slug, section } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [articles, setArticles] = useState<ProjectArticle[]>([]);
    const [zones, setZones] = useState<ProjectZone[]>([]);
    const [active360, setActive360] = useState<string | null>(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

    const displayImages = useMemo(() => {
        const slideMedia = project?.slide_images || [];
        return slideMedia.length > 0
            ? slideMedia.map(s => s.image_url || ((s as any).image))
            : [
                "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-2.jpg",
                "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-1.jpg",
                "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/location/img-1.jpg",
                "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-4.jpg",
                "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-3.jpg",
            ];
    }, [project]);

    // Handle auto-slide or initialization if needed
    useEffect(() => {
        if (displayImages.length > 0 && activeSlideIndex >= displayImages.length) {
            setActiveSlideIndex(0);
        }
    }, [displayImages, activeSlideIndex]);

    useEffect(() => {
        fetchProject(slug).then((data) => {
            setProject(data);
            if (data?.id) {
                const sectionToTypeMap: Record<string, string> = {
                    "tong-quan": "overview",
                    "vi-tri": "location",
                    "tien-do": "progress",
                    "chinh-sach": "policy",
                    "tien-ich": "utilities",
                    "layout": "design",
                };
                fetchArticlesForProject(data.id, sectionToTypeMap[section] || section).then(setArticles);

                if (section === "phan-khu") {
                    fetchProjectZones(data.id).then(setZones);
                }

                // Auto-select first 360 link when visiting anh-360 tab
                if (section === "anh-360") {
                    const t = (data.translations?.[0] as any)?.map_360_links || [];
                    if (t.length > 0) {
                        setActive360(t[0].link);
                    }
                }
            }
        });
    }, [slug, section]);

    const projectName = project?.name || slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // Shared translation object used across multiple cases
    const translation = (project?.translations?.[0] as any);

    switch (section) {
        case "tong-quan":
            return (
                <>
                    {/* NEW Full-width Image Slider with Slide Effect */}
                    <section className="py-10 bg-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[500px] lg:h-[600px] group bg-gray-100">
                                <div 
                                    className="flex h-full transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
                                >
                                    {displayImages.map((img, idx) => (
                                        <div key={idx} className="w-full h-full flex-shrink-0">
                                            <img
                                                src={img}
                                                alt={`${projectName} slide ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Prev Button - SVG Icon */}
                                <button 
                                    onClick={() => setActiveSlideIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                
                                {/* Next Button - SVG Icon */}
                                <button 
                                    onClick={() => setActiveSlideIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>

                                {/* Pagination 1, 2, 3... */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-10">
                                    {displayImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveSlideIndex(idx)}
                                            className={`size-7 rounded-full text-[11px] font-bold transition-all flex items-center justify-center border ${
                                                activeSlideIndex === idx 
                                                ? "bg-[#e2cb83] text-white border-[#e2cb83] shadow-md scale-110" 
                                                : "bg-white/80 text-gray-700 border-white/80 hover:bg-white"
                                            }`}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NEW Stat Cards */}
                    <section className="pb-12 bg-white border-b border-gray-100">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Card 1 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 flex items-center gap-5 hover:border-[#e2cb83]/50 transition-colors">
                                    <div className="size-14 rounded-full bg-[#8aa496] flex items-center justify-center shrink-0 shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wide">Quy mô</p>
                                        <p className="text-xl font-bold text-[#62908f]">{project?.scale || translation?.scale || "Đang cập nhật"}</p>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 flex items-center gap-5 hover:border-[#e2cb83]/50 transition-colors">
                                    <div className="size-14 rounded-full bg-[#8aa496] flex items-center justify-center shrink-0 shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wide">Bàn giao</p>
                                        <p className="text-xl font-bold text-[#62908f]">{project?.handoff_time || translation?.handoff_time || project?.handoffTime || translation?.handoffTime || "Đang cập nhật"}</p>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-5 flex items-center gap-5 hover:border-[#e2cb83]/50 transition-colors">
                                    <div className="size-14 rounded-full bg-[#8aa496] flex items-center justify-center shrink-0 shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M18 9l-6-6-6 6M18 15l-6 6-6-6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wide">Pháp lý</p>
                                        <p className="text-xl font-bold text-[#62908f]">{project?.legal || translation?.legal || "Đang cập nhật"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NEW Description with Side Media */}
                    <section className="py-12 bg-white">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-3xl font-bold mb-12 text-gray-800 uppercase tracking-tight leading-tight text-center">
                                TỔNG QUAN DỰ ÁN <br />
                                <span className="text-[#e2cb83]">{projectName}</span>
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                                {/* Left side: Video or Perspective Image */}
                                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-gray-100 border border-gray-100">
                                    {project?.youtube_link && getYouTubeEmbedUrl(project.youtube_link) ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(project.youtube_link)!}
                                            className="w-full h-full border-none"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <img
                                            src={project?.perspective_image_url || displayImages[0]}
                                            alt={projectName}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>

                                {/* Right side: Text description */}
                                <div className="bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
                                    {translation?.overview_description ? (
                                        <div 
                                            className="prose prose-sm prose-slate max-w-none text-gray-700 w-full [&_table]:w-full [&_table]:text-sm [&_td]:border-b [&_td]:border-gray-50 [&_td]:pb-3 [&_td]:pt-3 [&_td:first-child]:font-bold [&_td:first-child]:w-48 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:list-item"
                                            dangerouslySetInnerHTML={{ __html: translation.overview_description }} 
                                        />
                                    ) : (
                                        <p className="text-gray-500 italic">Nội dung đang được cập nhật...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Dynamically Loaded Project Articles for this section */}
                    {articles.length > 0 && (
                        <div className="dynamic-articles-container mt-1">
                            {articles.map(article => (
                                <DynamicArticleRenderer key={article.id} article={article} />
                            ))}
                        </div>
                    )}
                </>
            );
        case "vi-tri":
            return (
                <>
                    <section className="py-20 bg-gray-50">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">vị trí dự án</h2>
                                <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                            </div>
                            {project?.latitude && project?.longitude ? (
                                <div className="aspect-w-16 aspect-h-7 rounded-custom overflow-hidden shadow-md h-[500px]">
                                    <iframe
                                        src={`https://maps.google.com/maps?q=${project.latitude},${project.longitude}&z=15&output=embed`}
                                        title="Google Map"
                                        className="w-full h-full border-none"
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                </div>
                            ) : project?.google_map && project.google_map.includes("<iframe") ? (
                                <div
                                    className="aspect-w-16 aspect-h-7 rounded-custom overflow-hidden shadow-md [&>iframe]:w-full [&>iframe]:h-[500px]"
                                    dangerouslySetInnerHTML={{ __html: project.google_map }}
                                />
                            ) : (
                                <div className="aspect-w-16 aspect-h-7 rounded-custom overflow-hidden shadow-md bg-gray-200 flex items-center justify-center h-[500px]">
                                    <p className="text-gray-500 font-medium">Bản đồ đang được cập nhật</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Dynamically Loaded Project Articles for this section */}
                    {articles.length > 0 && (
                        <div className="dynamic-articles-container mt-1">
                            {articles.map(article => (
                                <DynamicArticleRenderer key={article.id} article={article} />
                            ))}
                        </div>
                    )}
                </>
            );
        case "phan-khu":
            return (
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Các phân khu / Tòa nhà</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                        </div>
                        {zones.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {zones.map(zone => {
                                    const zoneTitle = zone.translations?.[0]?.title || zone.name || "";
                                    const zoneSlug = zone.translations?.[0]?.slug || zone.id;
                                    return (
                                        <Link key={zone.id} href={`/du-an/${slug}/phan-khu/${zoneSlug}`} className="bg-white rounded-custom overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                            <div className="aspect-video relative overflow-hidden bg-gray-100">
                                                <img
                                                    src={project?.perspective_image_url || "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-1.jpg"}
                                                    alt={zoneTitle}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#e2cb83] transition-colors">{zoneTitle}</h3>
                                                <p className="text-[14px] text-gray-500 mb-4 line-clamp-2">Khám phá chi tiết mặt bằng, vị trí và tiện ích riêng của {zoneTitle}.</p>
                                                <div className="mt-auto flex items-center text-[#e2cb83] text-[13px] font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                                                    Xem chi tiết
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-1">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                Đang cập nhật danh sách phân khu...
                            </div>
                        )}
                    </div>
                </section>
            );
        case "layout":
            const masterPlans = translation?.master_plan || [];
            const unitLayouts = translation?.other_layouts || [];

            return (
                <section className="py-20 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Mặt bằng & Layout</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                        </div>

                        {masterPlans.length > 0 && (
                            <div className="mb-20">
                                <h3 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-[#e2cb83] pl-4">Mặt bằng tổng thể</h3>
                                <div className="space-y-12">
                                    {masterPlans.map((plan: any, idx: number) => (
                                        <div key={idx} className="bg-white rounded-custom shadow-sm overflow-hidden border border-gray-100 p-4">
                                            <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden mb-6">
                                                <img src={plan.image} alt={plan.title} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="px-4 pb-4">
                                                <h4 className="text-xl font-bold text-gray-800 mb-2">{plan.title}</h4>
                                                <p className="text-gray-600">{plan.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {unitLayouts.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-[#e2cb83] pl-4">Thiết kế căn hộ</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {unitLayouts.map((layout: any, idx: number) => (
                                        <div key={idx} className="bg-white rounded-custom border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="bg-[#e2cb83]/10 text-[#c7af60] font-bold px-3 py-1 rounded-md text-sm">{layout.type}</span>
                                                <span className="text-gray-500 text-sm font-medium">{layout.area}</span>
                                            </div>
                                            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-6 p-4 flex items-center justify-center">
                                                <img
                                                    src={layout.image}
                                                    alt={layout.title}
                                                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <h4 className="font-bold text-lg text-gray-800 text-center mt-auto">{layout.title}</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {masterPlans.length === 0 && unitLayouts.length === 0 && (
                            <div className="text-center text-gray-500 py-20 bg-white rounded-custom shadow-sm border border-dashed border-gray-200">
                                Dữ liệu mặt bằng đang được cập nhật.
                            </div>
                        )}
                    </div>
                </section>
            );
        case "tien-do":
            const progressHistory = translation?.construction_progress || [];

            return (
                <section className="py-20 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Tiến độ dự án</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Cập nhật liên tục những hình ảnh và thông tin mới nhất về tiến độ thi công của dự án, đảm bảo cam kết chất lượng và thời gian bàn giao.</p>
                        </div>

                        {progressHistory.length > 0 ? (
                            <div className="relative border-l-2 border-[#e2cb83]/30 ml-4 md:ml-10 space-y-12 pb-8">
                                {progressHistory.map((item: any, idx: number) => (
                                    <div key={idx} className="relative pl-8 md:pl-16">
                                        {/* Timeline Dot */}
                                        <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-[#e2cb83] border-4 border-white shadow-sm"></div>

                                        <div className="bg-white rounded-custom p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row gap-8">
                                                <div className="w-full md:w-1/3 shrink-0">
                                                    <div className="aspect-video md:aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative group">
                                                        <img
                                                            src={item.image || "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-1.jpg"}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-white text-4xl">zoom_in</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 font-bold text-xs uppercase tracking-widest rounded-full w-max mb-4">
                                                        {item.date || "Đang cập nhật"}
                                                    </span>
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                                                    <p className="text-gray-600 leading-relaxed text-[15px]">
                                                        {item.desc || "Chi tiết đang được cập nhật..."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-20 bg-white rounded-custom shadow-sm border border-dashed border-gray-200">
                                Dữ liệu tiến độ đang được cập nhật.
                            </div>
                        )}
                    </div>
                </section>
            );
        case "anh-360":
            const tourLinks = translation?.map_360_links || [];

            return (
                <section className="py-20 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Sa bàn ảo / 360 độ</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                        </div>

                        {tourLinks.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {tourLinks.map((tour: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActive360(tour.link)}
                                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${active360 === tour.link
                                                ? "bg-[#e2cb83] text-white"
                                                : "bg-white text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {tour.title}
                                        </button>
                                    ))}
                                </div>
                                <div className="aspect-video w-full rounded-custom overflow-hidden shadow-xl bg-gray-200">
                                    {active360 ? (
                                        <iframe
                                            src={active360}
                                            width="100%"
                                            height="100%"
                                            className="border-none w-full h-full"
                                            allowFullScreen={true}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            Vui lòng chọn một góc nhìn 360.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-20 bg-white rounded-custom shadow-sm border border-dashed border-gray-200">
                                Hình ảnh 360 đang được cập nhật.
                            </div>
                        )}
                    </div>
                </section>
            );
        default:
            if (articles.length === 0) {
                return (
                    <section className="py-20 bg-white text-center min-h-[50vh] flex flex-col justify-center">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-2xl font-bold mb-4 uppercase text-gray-800">{section.replace('-', ' ')}</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto mb-8"></div>
                            <p className="text-gray-500 italic">Nội dung đang được cập nhật cho dự án này...</p>
                        </div>
                    </section>
                );
            }

            // If there's exactly one article, render its HTML directly (or using DynamicArticleRenderer)
            if (articles.length === 1) {
                return (
                    <div className="dynamic-articles-container">
                        <DynamicArticleRenderer article={articles[0]} />
                    </div>
                );
            }

            // If there are multiple articles, render a list view
            return (
                <section className="py-20 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">{section.replace('-', ' ')}</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => {
                                // Fallback slug if actual slug doesn't exist. Usually we'd want a real slug.
                                const articleSlug = article.translations?.[0]?.page_title || article.id;
                                return (
                                    <Link key={article.id} href={`/du-an/${slug}/${section}/${articleSlug}`} className="bg-white rounded-custom overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                                            <img
                                                src={article.banner_image_url || article.banner_image || project?.perspective_image_url || "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-1.jpg"}
                                                alt={article.translations?.[0]?.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#e2cb83] transition-colors line-clamp-2">
                                                {article.translations?.[0]?.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                                                {article.translations?.[0]?.summary || "Đang cập nhật nội dung chi tiết..."}
                                            </p>
                                            <div className="mt-auto flex items-center text-[#e2cb83] text-[13px] font-bold uppercase tracking-wider group-hover:gap-2 transition-all">
                                                Đọc chi tiết <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            );
    }
}
