"use client";

import { use, useEffect, useState, useMemo } from "react";
import { fetchProject, fetchArticlesForProject, Project, ProjectArticle } from "@/lib/api";
import DynamicArticleRenderer from "@/components/articles/DynamicArticleRenderer";
import Link from "next/link";

export default function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string; section: string; articleSlug: string }>;
}) {
    const { slug, section, articleSlug } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [article, setArticle] = useState<ProjectArticle | null>(null);
    const [progressGroup, setProgressGroup] = useState<{ date: string; items: any[] } | null>(null);
    const [loading, setLoading] = useState(true);

    // Lightbox state
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            const projectData = await fetchProject(slug);
            setProject(projectData);

            if (projectData?.id) {
                if (section === "tien-do") {
                    // Logic for Progress (Tiến độ) grouping
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

                    const progressHistory = projectData.translations?.[0]?.construction_progress || [];
                    const groups: { [key: string]: typeof progressHistory } = {};
                    progressHistory.forEach((item: any) => {
                        const dateKey = item.date || "Khác";
                        if (!groups[dateKey]) {
                            groups[dateKey] = [];
                        }
                        groups[dateKey].push(item);
                    });

                    // Search for matching group by slug
                    let foundGroup = null;
                    for (const date in groups) {
                        if (createSlug(date) === articleSlug) {
                            foundGroup = {
                                date: date,
                                items: groups[date],
                            };
                            break;
                        }
                    }

                    setProgressGroup(foundGroup);
                } else {
                    const sectionToTypeMap: Record<string, string> = {
                        "tong-quan": "overview",
                        "vi-tri": "location",
                        "chinh-sach": "policy",
                        "tien-ich": "utilities",
                        "layout": "design",
                    };
                    const articleType = sectionToTypeMap[section] || section;
                    const articles = await fetchArticlesForProject(projectData.id, articleType);
                    
                    // Find matching article. If id matches, use it. Otherwise, match by page_title
                    const targetArticle = articles.find(a => 
                        a.id.toString() === articleSlug || 
                        a.translations?.[0]?.page_title === articleSlug
                    );

                    setArticle(targetArticle || null);
                }
            }
            setLoading(false);
        };
        initData();
    }, [slug, section, articleSlug]);

    // Handle Lightbox Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null || !progressGroup) return;
            
            if (e.key === "Escape") {
                setLightboxIndex(null);
            } else if (e.key === "ArrowLeft") {
                setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : progressGroup.items.length - 1));
            } else if (e.key === "ArrowRight") {
                setLightboxIndex((prev) => (prev! < progressGroup.items.length - 1 ? prev! + 1 : 0));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, progressGroup]);

    if (loading) {
        return (
            <div className="py-32 text-center bg-gray-50 min-h-screen">
                <p className="text-gray-500">Đang tải nội dung bài viết...</p>
            </div>
        );
    }

    if (!article && !progressGroup) {
        return (
            <div className="py-32 text-center bg-gray-50 min-h-screen">
                <p className="text-gray-500 mb-6">Không tìm thấy nội dung.</p>
                <Link href={`/du-an/${slug}/${section}`} className="px-6 py-2 bg-[#e2cb83] text-white font-bold rounded">
                    Quay lại danh sách {section.replace('-', ' ')}
                </Link>
            </div>
        );
    }

    if (progressGroup) {
        return (
            <section className="bg-gray-50 min-h-screen pb-20">
                {/* Header for Progress Detail */}
                <div className="w-full h-48 md:h-64 relative flex items-center justify-center p-6 text-center bg-white shadow-sm border-b border-gray-100">
                    <div className="relative z-10 max-w-4xl mt-10">
                        <Link href={`/du-an/${slug}/tien-do`} className="text-gray-500 hover:text-[#e2cb83] uppercase text-xs font-bold tracking-widest flex items-center justify-center gap-1 mb-4 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            Trở về
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-black text-[#e2cb83] uppercase tracking-tight">
                            {progressGroup.date}
                        </h1>
                        <p className="text-gray-500 mt-4 font-medium">Chi tiết hình ảnh và video thi công</p>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="max-w-7xl mx-auto px-4 mt-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {progressGroup.items.map((item, idx) => {
                            const isVideo = item.image && (item.image.endsWith('.mp4') || item.image.endsWith('.webm'));
                            
                            return (
                                <div 
                                    key={idx} 
                                    className="relative group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white"
                                    onClick={() => setLightboxIndex(idx)}
                                >
                                    <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-gray-100 overflow-hidden">
                                        {isVideo ? (
                                            <>
                                                <video
                                                    src={item.image}
                                                    className="w-full h-full object-contain"
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                                <div className="absolute inset-0 bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                                    <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-md">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white ml-0.5">
                                                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    src={item.image}
                                                    alt={item.title || "Hình ảnh tiến độ"}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white transform scale-50 group-hover:scale-100 transition-transform duration-300 drop-shadow-lg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                                    </svg>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    {(item.title || item.desc) && (
                                        <div className="p-4 bg-white">
                                            {item.title && <h3 className="text-gray-800 font-bold text-sm leading-tight mb-1">{item.title}</h3>}
                                            {item.desc && <p className="text-gray-500 text-xs line-clamp-2">{item.desc}</p>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Lightbox Modal */}
                {lightboxIndex !== null && (
                    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center opacity-100 transition-opacity backdrop-blur-sm">
                        {/* Close button */}
                        <button 
                            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-2 rounded-full transition-all z-10"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Prev button */}
                        <button 
                            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/30 hover:bg-black/80 w-14 h-14 rounded-full flex items-center justify-center transition-all z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : progressGroup.items.length - 1));
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 ml-[-2px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        {/* Next button */}
                        <button 
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/30 hover:bg-black/80 w-14 h-14 rounded-full flex items-center justify-center transition-all z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLightboxIndex((prev) => (prev! < progressGroup.items.length - 1 ? prev! + 1 : 0));
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 ml-[2px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>

                        {/* Content Area */}
                        <div className="w-full h-full p-4 md:p-12 flex flex-col items-center justify-center" onClick={() => setLightboxIndex(null)}>
                            <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                                {(() => {
                                    const currentItem = progressGroup.items[lightboxIndex];
                                    const isVid = currentItem.image && (currentItem.image.endsWith('.mp4') || currentItem.image.endsWith('.webm'));
                                    
                                    return isVid ? (
                                        <video
                                            src={currentItem.image}
                                            className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl bg-black"
                                            controls
                                            autoPlay
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={currentItem.image}
                                            alt={currentItem.title || "Hình ảnh"}
                                            className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
                                        />
                                    );
                                })()}
                                
                                {/* Info Box */}
                                {(progressGroup.items[lightboxIndex].title || progressGroup.items[lightboxIndex].desc) && (
                                    <div className="absolute bottom-[-60px] md:bottom-auto md:top-full left-0 right-0 p-4 text-center">
                                        <h3 className="text-white font-bold text-xl">{progressGroup.items[lightboxIndex].title}</h3>
                                        <p className="text-gray-300 mt-2 text-sm">{progressGroup.items[lightboxIndex].desc}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thumbnail strips (Optional indicator) */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {progressGroup.items.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-2 h-2 rounded-full transition-all ${idx === lightboxIndex ? 'bg-white scale-125' : 'bg-white/30'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        );
    }

    if (!article) return null;

    return (
        <section className="bg-white min-h-screen">
            {/* Header/Banner for Article */}
            <div 
                className="w-full h-64 md:h-80 bg-gray-900 relative flex items-center justify-center p-6 text-center"
                style={{
                    backgroundImage: article.banner_image_url || article.banner_image 
                        ? `url(${article.banner_image_url || article.banner_image})` 
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 max-w-4xl">
                    <Link href={`/du-an/${slug}/${section}`} className="text-gray-300 hover:text-white uppercase text-xs font-bold tracking-widest flex items-center justify-center gap-1 mb-6 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Danh sách {section.replace('-', ' ')}
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {article.translations?.[0]?.title}
                    </h1>
                </div>
            </div>

            {/* Render the actual content via DynamicArticleRenderer or HTML directly */}
            <div className="py-12 max-w-7xl mx-auto px-4">
                {/* Wrap in DynamicArticleRenderer to support layout_type properly */}
                <DynamicArticleRenderer article={article} />
            </div>
        </section>
    );
}
