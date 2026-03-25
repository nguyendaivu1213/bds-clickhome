"use client";

import { use, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { fetchProject, fetchArticlesForProject, fetchProjectZones, Project, ProjectArticle, ProjectZone } from "@/lib/api";
import DynamicArticleRenderer from "@/components/articles/DynamicArticleRenderer";

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
    const [activeSlideImage, setActiveSlideImage] = useState<string | null>(null);

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

    // Set initial active image when displayImages are loaded
    useEffect(() => {
        if (displayImages.length > 0) {
            setActiveImage(displayImages[0]);
        }
    }, [displayImages]);

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
                    <section className="py-10 bg-white border-t border-gray-100">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Left Column: Image Gallery */}
                                <div className="lg:col-span-6">
                                    <div className="space-y-4">
                                        <div className="overflow-hidden rounded-sm shadow-md aspect-video bg-gray-50">
                                            <img
                                                src={activeSlideImage || displayImages[0]}
                                                alt={projectName}
                                                className="w-full h-full object-cover transition-all duration-500"
                                            />
                                        </div>
                                        {displayImages.length > 1 && (
                                            <div className="grid grid-cols-4 gap-4">
                                                {displayImages.slice(0, 8).map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setActiveSlideImage(img)}
                                                        className={`aspect-square overflow-hidden rounded-sm shadow-sm cursor-pointer border-2 transition-all ${(activeSlideImage || displayImages[0]) === img
                                                            ? "border-[#e2cb83] opacity-100 shadow-md"
                                                            : "border-gray-100 opacity-60 hover:opacity-100"
                                                            }`}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`${projectName} thumb ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Detailed Info */}
                                <div className="lg:col-span-6">
                                    <h2 className="text-3xl font-bold mb-8 text-gray-800 uppercase tracking-tight leading-tight">
                                        TỔNG QUAN DỰ ÁN <br />
                                        <span className="text-[#e2cb83]">{projectName}</span>
                                    </h2>

                                    <div className="space-y-5 text-[15px]">
                                        <div className="flex border-b border-gray-50 pb-3 text-sm">
                                            <span className="w-48 flex-shrink-0 font-bold text-gray-700">Chủ đầu tư:</span>
                                            <span className="text-gray-600">Công ty Cổ phần Đầu Tư Và Phát Triển Đô Thị Sài Đồng (Thành viên của Vingroup)</span>
                                        </div>
                                        <div className="flex border-b border-gray-50 pb-3 text-sm">
                                            <span className="w-48 flex-shrink-0 font-bold text-gray-700">Tổng diện tích đất dự án:</span>
                                            <span className="text-gray-600">17.6 ha</span>
                                        </div>
                                        <div className="flex border-b border-gray-50 pb-3 text-sm">
                                            <span className="w-48 flex-shrink-0 font-bold text-gray-700">Mật độ xây dựng:</span>
                                            <span className="text-gray-600">31%</span>
                                        </div>
                                        <div className="flex border-b border-gray-50 pb-3 text-sm">
                                            <span className="w-48 flex-shrink-0 font-bold text-gray-700">Quy mô phát triển:</span>
                                            <span className="text-gray-600">3 tòa căn hộ & 364 căn nhà ở thấp tầng</span>
                                        </div>
                                        <div className="flex border-b border-gray-50 pb-3 h-auto text-sm">
                                            <span className="w-48 flex-shrink-0 font-bold text-gray-700">Loại hình phát triển:</span>
                                            <span className="text-gray-600">
                                                Cao tầng (The Arcadia): 1PN, 2PN, 3PN, 4PN, Duplex <br />
                                                Thấp tầng (The Botanica): Biệt thự đơn lập, biệt thụ song lập, liền kề, shophouse
                                            </span>
                                        </div>
                                        <div className="flex border-b border-gray-50 pb-3 text-sm">
                                            <span className="w-48 flex-shrink-0 font-bold text-gray-700">Thời điểm khởi công:</span>
                                            <span className="text-gray-600">Năm 2015</span>
                                        </div>
                                        <div className="flex border-b border-gray-50 pb-3 text-sm">
                                            <span className="w-48 flex-shrink-0 font-bold text-gray-700">Thời điểm bàn giao:</span>
                                            <span className="text-gray-600">Tháng 11/2017</span>
                                        </div>
                                        <div className="flex border-b border-gray-50 pb-3 text-sm">
                                            <span className="w-48 flex-shrink-0 font-bold text-gray-700">Hình thức sở hữu:</span>
                                            <span className="text-gray-600 font-medium font-bold">Sổ đỏ lâu dài</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Dynamically Loaded Project Articles for this section */}
                    {articles.length > 0 && (
                        <div className="dynamic-articles-container mt-1">
                            {articles.map(article => {
                                const trans = article.translations?.[0] || {};
                                return (
                                    <div key={article.id} className="w-full space-y-10 mb-20">
                                        {article.banner_image_url && (
                                            <div className="w-full h-[50vh] md:h-[70vh] relative">
                                                <img
                                                    src={article.banner_image_url}
                                                    className="w-full h-full object-cover"
                                                    alt={trans.title || "Tổng quan dự án"}
                                                />
                                            </div>
                                        )}
                                        <div className="max-w-7xl mx-auto px-4">
                                            <div className="w-full">
                                                {trans.summary && (
                                                    <div className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed border-l-4 border-[#e2cb83] pl-6 py-2">
                                                        {trans.summary}
                                                    </div>
                                                )}
                                                {trans.html_content && (
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: trans.html_content }}
                                                        className="prose prose-slate max-w-none text-gray-700 leading-loose text-xl [&>p]:mb-8 [&>strong]:text-gray-900"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
                                <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Vị trí đắc địa</h2>
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
                        <div className="dynamic-articles-container">
                            {articles.map(article => {
                                if (section === "vi-tri") {
                                    const trans = article.translations?.[0] || {};
                                    return (
                                        <div key={article.id} className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                                            <div className="w-full">
                                                {trans.summary && (
                                                    <div className="text-xl font-bold text-gray-800 mb-6 leading-relaxed border-l-4 border-[#e2cb83] pl-6 py-2">
                                                        {trans.summary}
                                                    </div>
                                                )}
                                                {trans.html_content && (
                                                    <div
                                                        dangerouslySetInnerHTML={{ __html: trans.html_content }}
                                                        className="prose prose-slate max-w-none text-gray-600 leading-[1.8] text-lg [&>p]:mb-6 [&>strong]:text-gray-900"
                                                    />
                                                )}
                                            </div>
                                            {article.banner_image_url && (
                                                <div className="w-full h-auto rounded-custom overflow-hidden shadow-2xl mt-12">
                                                    <img
                                                        src={article.banner_image_url}
                                                        className="w-full h-auto object-cover"
                                                        alt="Vị trí"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return <DynamicArticleRenderer key={article.id} article={article} />;
                            })}
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
                                                    Xem chi tiết <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
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
