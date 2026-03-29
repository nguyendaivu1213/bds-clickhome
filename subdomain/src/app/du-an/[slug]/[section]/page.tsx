"use client";

import { use, useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { fetchProject, fetchArticlesForProject, fetchProjectZones, fetchProjectProperties, Project, ProjectArticle, ProjectZone, PropertyItem } from "@/lib/api";
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
    const [activePlanIndex, setActivePlanIndex] = useState<number>(0);
    const [properties, setProperties] = useState<PropertyItem[]>([]);
    
    const bannerRef = useRef<HTMLDivElement>(null);
    const productRef = useRef<HTMLDivElement>(null);
    const amenityRef = useRef<HTMLDivElement>(null);

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

    // Desktop Drag-to-Scroll Helper Hook Logic applied functionally
    const applyDragTracker = (ref: React.RefObject<HTMLDivElement | null>) => {
        useEffect(() => {
            const slider = ref.current;
            if (!slider) return;
            
            let isDown = false;
            let startX: number;
            let scrollLeft: number;

            const mouseDown = (e: MouseEvent) => {
                isDown = true;
                slider.style.cursor = 'grabbing';
                // Remove snap class smoothly so dragging isn't jittery
                slider.style.scrollSnapType = 'none';
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            };

            const mouseLeave = () => {
                isDown = false;
                slider.style.cursor = 'grab';
                slider.style.scrollSnapType = 'x mandatory';
            };

            const mouseUp = () => {
                isDown = false;
                slider.style.cursor = 'grab';
                slider.style.scrollSnapType = 'x mandatory';
                
                // Track active index specifically for Banner
                if (ref === bannerRef && slider.children[0]) {
                    const slideWidth = (slider.children[0] as HTMLElement).offsetWidth;
                    const index = Math.round(slider.scrollLeft / slideWidth);
                    setActiveSlideIndex(index);
                }
            };

            const mouseMove = (e: MouseEvent) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX); // scroll speed 1:1
                slider.scrollLeft = scrollLeft - walk;
            };

            slider.addEventListener('mousedown', mouseDown);
            slider.addEventListener('mouseleave', mouseLeave);
            slider.addEventListener('mouseup', mouseUp);
            slider.addEventListener('mousemove', mouseMove);

            // Scroll listener purely for dot updates on Banner
            const handleScroll = () => {
                if (ref === bannerRef && slider.children[0] && !isDown) {
                    const slideWidth = (slider.children[0] as HTMLElement).offsetWidth;
                    const index = Math.round(slider.scrollLeft / slideWidth);
                    if (index !== activeSlideIndex && index >= 0 && index < displayImages.length) {
                        setActiveSlideIndex(index);
                    }
                }
            };
            if (ref === bannerRef) {
                slider.addEventListener('scroll', handleScroll, { passive: true });
            }

            return () => {
                slider.removeEventListener('mousedown', mouseDown);
                slider.removeEventListener('mouseleave', mouseLeave);
                slider.removeEventListener('mouseup', mouseUp);
                slider.removeEventListener('mousemove', mouseMove);
                if (ref === bannerRef) {
                    slider.removeEventListener('scroll', handleScroll);
                }
            };
        }, [displayImages]);
    };

    applyDragTracker(bannerRef);
    applyDragTracker(productRef);
    applyDragTracker(amenityRef);

    // Xử lý scroll mượt cho Banner, Product, Amenity
    const scrollSlider = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (!ref.current || !ref.current.children[0]) return;
        const slideWidth = (ref.current.children[0] as HTMLElement).offsetWidth;
        ref.current.scrollBy({ left: direction === 'left' ? -slideWidth : slideWidth, behavior: 'smooth' });
    };

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

                if (section === "tong-quan") {
                    fetchProjectProperties(data.id).then(setProperties);
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
                    {project?.banner_type === 'slide_banner' && (
                        <section className="py-10 bg-white">
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[500px] lg:h-[600px] group bg-gray-100">
                                    <style>{`
                                        .hide-scrollbar::-webkit-scrollbar { display: none; }
                                        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                                    `}</style>
                                    <div 
                                        ref={bannerRef}
                                        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory flex-nowrap hide-scrollbar cursor-grab active:cursor-grabbing"
                                    >
                                        {displayImages.map((img, idx) => (
                                            <div key={idx} className="w-full h-full min-w-full flex-shrink-0 snap-center relative">
                                                <img
                                                    src={img}
                                                    alt={`${projectName} slide ${idx + 1}`}
                                                    className="w-full h-full object-cover pointer-events-none select-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Prev Button - SVG Icon */}
                                    <button 
                                        onClick={() => scrollSlider(bannerRef, 'left')}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                    
                                    {/* Next Button - SVG Icon */}
                                    <button 
                                        onClick={() => scrollSlider(bannerRef, 'right')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm z-10"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                    
                                    {/* Center Pagination indicators using Banner SVG */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 z-10">
                                        {displayImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setActiveSlideIndex(idx);
                                                    if (bannerRef.current && bannerRef.current.children[0]) {
                                                        const slideW = (bannerRef.current.children[0] as HTMLElement).offsetWidth;
                                                        bannerRef.current.scrollTo({ left: slideW * idx, behavior: 'smooth' });
                                                    }
                                                }}
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
                    )}

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
                                        <p className="text-xl font-bold text-[#62908f]">{(project as any)?.scale || (translation as any)?.scale || "Đang cập nhật"}</p>
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
                                        <p className="text-xl font-bold text-[#62908f]">{(project as any)?.handoff_time || (project as any)?.handover_time || (translation as any)?.handoff_time || (translation as any)?.handover_time || "Đang cập nhật"}</p>
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
                                        <p className="text-xl font-bold text-[#62908f]">{(project as any)?.legal || (project as any)?.legal_status || (translation as any)?.legal || (translation as any)?.legal_status || "Đang cập nhật"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* NEW Description with Side Media - Two layer background */}
                    <section className="relative py-16 lg:py-20 overflow-hidden">
                        {/* Layer 1: Footer image background */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${(project as any)?.footer_image_url || (project as any)?.footer_image || displayImages[0] || ''})` }}
                        />
                        {/* Layer 2: Color overlay */}
                        <div className="absolute inset-0 bg-[#62908f]/90" />

                        <div className="relative max-w-7xl mx-auto px-4 z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                                {/* Left side: Text description */}
                                <div className="lg:col-span-5 text-white">
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#e2cb83] tracking-tight leading-tight">
                                        Tổng quan dự án
                                    </h2>
                                    {translation?.overview_description ? (
                                        <div 
                                            className="prose prose-sm md:prose-base prose-invert prose-p:text-white/90 prose-li:text-white/90 prose-strong:text-white max-w-none w-full [&_table]:w-full [&_td]:border-white/20 [&_td:first-child]:font-bold [&_ul]:list-disc [&_ul]:ml-4 [&_li]:list-item"
                                            dangerouslySetInnerHTML={{ __html: translation.overview_description }} 
                                        />
                                    ) : (
                                        <p className="text-white/70 italic">Nội dung đang được cập nhật...</p>
                                    )}
                                </div>

                                {/* Right side: Video or Perspective Image */}
                                <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/10] bg-black/20 border border-white/20">
                                    {project?.youtube_link && getYouTubeEmbedUrl(project.youtube_link) ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(project.youtube_link)!}
                                            className="w-full h-full border-none"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <img
                                            src={project?.perspective_image_url || displayImages[0] || "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-2.jpg"}
                                            alt={projectName}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Products Section (Sản Phẩm) */}
                    {properties.length > 0 && (() => {
                        return (
                            <section className="py-16 bg-white border-t border-gray-100">
                                <div className="max-w-7xl mx-auto px-4">
                                    <div className="text-center mb-10">
                                        <h2 className="text-3xl font-bold text-[#62908f] tracking-tight mb-1 hover:text-[#e2cb83] transition-colors inline-block">
                                            <Link href={`/du-an/${slug}/san-pham`}>Sản phẩm</Link>
                                        </h2>
                                        <p className="text-gray-400 text-sm">Đa dạng lựa chọn cho mọi nhu cầu</p>
                                        <div className="w-10 h-0.5 bg-[#e2cb83] mx-auto mt-4"></div>
                                    </div>
                                    <div className="relative group">
                                        <button onClick={() => scrollSlider(productRef, 'left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#62908f] transition-all hover:scale-105 opacity-0 group-hover:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                        </button>

                                        <div 
                                            ref={productRef} 
                                            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 cursor-grab active:cursor-grabbing pb-4"
                                        >
                                            {properties.map((prop, idx) => (
                                                <div key={prop.id || idx} className="min-w-[85vw] sm:min-w-[calc(50%-12px)] md:min-w-[calc(33.333%-16px)] shrink-0 snap-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 select-none">
                                                    <div className="relative h-56 bg-gray-50 overflow-hidden flex items-center justify-center pointer-events-none">
                                                        {(prop.main_image_url || prop.main_image) ? (
                                                            <img src={prop.main_image_url || prop.main_image || ''} alt={prop.name || prop.product_type || 'Sản phẩm'} className="w-full h-full object-cover transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#ccc" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21" /></svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-5 pointer-events-none">
                                                        <h3 className="text-[#62908f] font-semibold text-base mb-1.5">{prop.name || prop.product_type || `Sản phẩm #${prop.id}`}</h3>
                                                        {prop.area && <p className="text-gray-500 text-sm">Diện tích: <span className="font-medium text-gray-700">~{prop.area} m²</span></p>}
                                                        {prop.floor && <p className="text-gray-500 text-sm">Tầng: <span className="font-medium text-gray-700">{prop.floor}</span></p>}
                                                        {prop.price && <p className="text-gray-500 text-sm mt-1">Giá: <span className="font-medium text-[#c9b26e]">{new Intl.NumberFormat('vi-VN').format(prop.price)} VNĐ</span></p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button onClick={() => scrollSlider(productRef, 'right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#62908f] transition-all hover:scale-105 opacity-0 group-hover:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        );
                    })()}

                    {/* Floor Plan Section (Mặt Bằng) */}
                    {(() => {
                        const masterPlan: { image: string; title: string; desc: string }[] = (translation?.master_plan as any) || [];
                        if (!masterPlan || masterPlan.length === 0) return null;
                        const activePlan = masterPlan[activePlanIndex] || masterPlan[0];
                        const imageUrl = (activePlan as any).image_url || activePlan.image;
                        return (
                            <section className="py-16 bg-gray-50 border-t border-gray-100">
                                <div className="max-w-7xl mx-auto px-4">
                                    {/* Header */}
                                    <div className="text-center mb-10">
                                        <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-tight mb-2 hover:text-[#e2cb83] transition-colors inline-block">
                                            <Link href={`/du-an/${slug}/layout`}>Mặt Bằng</Link>
                                        </h2>
                                        <p className="text-gray-500 text-sm">Thiết kế chi tiết các tầng</p>
                                        <div className="w-12 h-0.5 bg-[#e2cb83] mx-auto mt-4"></div>
                                    </div>

                                    {/* Button tabs */}
                                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                                        {masterPlan.map((plan, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActivePlanIndex(idx)}
                                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                                                    activePlanIndex === idx
                                                        ? "bg-[#e2cb83] text-white border-[#e2cb83] shadow-md"
                                                        : "bg-white text-gray-600 border-gray-200 hover:border-[#e2cb83] hover:text-[#c9b26e]"
                                                }`}
                                            >
                                                {plan.title || `Mặt bằng ${idx + 1}`}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Active plan image */}
                                    {imageUrl ? (
                                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-100">
                                            <img
                                                key={activePlanIndex}
                                                src={imageUrl}
                                                alt={activePlan.title || 'Mặt bằng dự án'}
                                                className="w-full h-auto object-contain transition-opacity duration-300"
                                            />
                                            {activePlan.desc && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-8 py-6">
                                                    <p className="text-white text-sm font-medium">{activePlan.desc}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-64 rounded-2xl bg-gray-200 flex items-center justify-center">
                                            <p className="text-gray-400">Hình ảnh mặt bằng đang được cập nhật</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })()}

                    {/* Dynamically Loaded Project Articles for this section */}
                    {articles.length > 0 && (
                        <div className="dynamic-articles-container mt-1">
                            {articles.map(article => (
                                <DynamicArticleRenderer key={article.id} article={article} />
                            ))}
                        </div>
                    )}

                    {/* Amenities Section (Tiện Ích) */}
                    {(() => {
                        const amenities: { image: string; image_url?: string; title: string; desc: string; isHighlight?: boolean }[] = (translation?.amenities as any) || [];
                        if (!amenities || amenities.length === 0) return null;

                        return (
                            <section className="py-16 bg-white border-t border-gray-100 overflow-hidden">
                                <div className="max-w-7xl mx-auto px-4">
                                    {/* Header */}
                                    <div className="text-center mb-10">
                                        <h2 className="text-3xl font-bold text-[#62908f] tracking-tight mb-1 hover:text-[#e2cb83] transition-colors inline-block">
                                            <Link href={`/du-an/${slug}/tien-ich`}>Tiện Ích</Link>
                                        </h2>
                                        <p className="text-gray-400 text-sm">Hệ thống tiện ích đẳng cấp phiên bản thượng lưu</p>
                                        <div className="w-10 h-0.5 bg-[#e2cb83] mx-auto mt-4"></div>
                                    </div>

                                    {/* Slider */}
                                    <div className="relative group">
                                        {/* Prev */}
                                        <button onClick={() => scrollSlider(amenityRef, 'left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#62908f] transition-all hover:scale-105 opacity-0 group-hover:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                        </button>

                                        {/* Draggable track */}
                                        <div
                                            ref={amenityRef}
                                            className="flex overflow-x-auto snap-x snap-mandatory gap-4 hide-scrollbar cursor-grab active:cursor-grabbing pb-4"
                                        >
                                            {amenities.map((am, idx) => {
                                                const imgSrc = am.image_url || (am.image && am.image.startsWith('http') ? am.image : am.image ? `/storage/${am.image}` : null);
                                                return (
                                                    <div key={`am-${idx}`} className="min-w-[85vw] sm:min-w-[calc(50%-8px)] md:min-w-[calc(25%-12px)] shrink-0 snap-center rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 bg-white select-none relative group/item">
                                                        <div className="h-48 overflow-hidden bg-gray-100 relative pointer-events-none">
                                                            {imgSrc ? (
                                                                <img src={imgSrc} alt={am.title} className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 3v18" /></svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {am.title && (
                                                            <div className="p-4 pointer-events-none">
                                                                <p className="text-[#62908f] font-semibold text-sm leading-snug">{am.title}</p>
                                                                {am.desc && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{am.desc}</p>}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Next */}
                                        <button onClick={() => scrollSlider(amenityRef, 'right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#62908f] transition-all hover:scale-105 opacity-0 group-hover:opacity-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </section>
                        );
                    })()}
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
            
            // Hàm tạo slug từ string tiếng Việt
            const createSlug = (str: string) => {
                if (!str) return "thang-01";
                return str.toString().toLowerCase()
                    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
                    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
                    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
                    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
                    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
                    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
                    .replace(/đ/gi, 'd')
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9\-]/g, '')
                    .replace(/\-+/g, '-')
                    .replace(/^-|-$/g, '');
            };

            // Gom nhóm theo date
            const groupedProgress = useMemo(() => {
                const groups: { [key: string]: typeof progressHistory } = {};
                progressHistory.forEach((item: any) => {
                    const dateKey = item.date || "Khác";
                    if (!groups[dateKey]) {
                        groups[dateKey] = [];
                    }
                    groups[dateKey].push(item);
                });
                
                return Object.keys(groups).map((date) => {
                    return {
                        date,
                        slug: createSlug(date),
                        items: groups[date],
                        preview: groups[date][0], // Lấy item đầu tiên (mới nhất)
                    };
                });
            }, [progressHistory]);

            return (
                <section className="py-20 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">Tiến độ dự án</h2>
                            <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Cập nhật liên tục những hình ảnh và thông tin mới nhất về tiến độ thi công của dự án, đảm bảo cam kết chất lượng và thời gian bàn giao.</p>
                        </div>

                        {groupedProgress.length > 0 ? (
                            <div className="relative border-l-2 border-[#e2cb83]/30 ml-4 md:ml-10 space-y-12 pb-8">
                                {groupedProgress.map((group, idx: number) => {
                                    const { preview } = group;
                                    const isVideo = preview?.image && (preview.image.endsWith('.mp4') || preview.image.endsWith('.webm'));
                                    
                                    return (
                                        <div key={idx} className="relative pl-8 md:pl-16">
                                            {/* Timeline Dot */}
                                            <div className="absolute top-0 -left-[9px] w-4 h-4 rounded-full bg-[#e2cb83] border-4 border-white shadow-sm"></div>

                                            <div className="bg-white rounded-custom p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-[box-shadow_transform] hover:-translate-y-1 hover:border-[#e2cb83]/30">
                                                <Link href={`/du-an/${slug}/tien-do/${group.slug}`} className="flex flex-col md:flex-row gap-8 relative group">
                                                    <div className="w-full md:w-1/3 shrink-0 relative">
                                                        <div className="aspect-video md:aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative group-hover:shadow-md transition-shadow">
                                                            {isVideo ? (
                                                                <video
                                                                    src={preview.image}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                    muted
                                                                    loop
                                                                    playsInline
                                                                    autoPlay
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={preview.image || "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/progress/img-1.jpg"}
                                                                    alt={preview.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white drop-shadow-lg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                                </svg>
                                                            </div>
                                                            {group.items.length > 1 && (
                                                                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                                    </svg>
                                                                    <span>+{group.items.length - 1} ảnh/video</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <h3 className="text-3xl font-black text-[#e2cb83] mb-4 uppercase tracking-tight group-hover:text-[#c4ae65] transition-colors">{group.date}</h3>
                                                        <h4 className="text-xl font-bold text-gray-800 mb-3">{preview.title}</h4>
                                                        <p className="text-gray-600 leading-relaxed text-[15px] line-clamp-3">
                                                            {preview.desc || "Click để xem chi tiết hình ảnh và video tiến độ..."}
                                                        </p>
                                                        <div className="mt-8">
                                                            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#e2cb83] group-hover:text-[#c4ae65] transition-colors uppercase tracking-widest border border-[#e2cb83]/30 px-5 py-2.5 rounded-full group-hover:bg-[#e2cb83]/5">
                                                                Xem chi tiết
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
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
