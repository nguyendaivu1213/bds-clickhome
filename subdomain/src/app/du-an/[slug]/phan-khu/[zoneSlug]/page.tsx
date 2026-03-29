"use client";

import { use, useEffect, useState } from "react";
import { fetchProject, fetchZone, fetchProjectZones, fetchZoneArticles, Project, ProjectZone, ProjectArticle } from "@/lib/api";
import DynamicArticleRenderer from "@/components/articles/DynamicArticleRenderer";
import Link from "next/link";

const TABS = [
    { id: 'tong-quan', label: 'Tổng quan', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /> },
    { id: 'vi-tri', label: 'Vị trí', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></> },
    { id: 'layout', label: 'Layout tòa nhà', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> },
    { id: 'chinh-sach', label: 'Chính sách bán hàng', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /> },
    { id: 'bang-hang', label: 'Bảng hàng', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 16.125v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 16.125c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m2.25 0c.621 0 1.125.504 1.125 1.125m0 0h7.5" /> },
    { id: 'quy-can', label: 'Quỹ căn', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.003L3.5 3A1.5 1.5 0 002 4.5v15A1.5 1.5 0 003.5 21h13A1.5 1.5 0 0018 19.5v-15A1.5 1.5 0 0016.5 3.003zM6.5 7h5m-5 4h5m-5 4h5m3-8h1m-1 4h1m-1 4h1" /> }
];

export default function ZoneDetailPage({
    params,
}: {
    params: Promise<{ slug: string; zoneSlug: string }>;
}) {
    const { slug, zoneSlug } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [projectZones, setProjectZones] = useState<ProjectZone[]>([]);
    const [zone, setZone] = useState<ProjectZone | null>(null);
    const [articles, setArticles] = useState<ProjectArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('tong-quan');

    useEffect(() => {
        setLoading(true);
        fetchProject(slug).then(proj => {
            setProject(proj);
            if (proj?.id) {
                fetchProjectZones(proj.id).then(setProjectZones);
            }
        });
        
        fetchZone(zoneSlug).then((data) => {
            setZone(data);
            if (data?.id) {
                // Fetch all zone articles
                fetchZoneArticles(data.id, '', 50).then(setArticles).finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        });
    }, [slug, zoneSlug]);

    const zoneTitle = zone?.translations?.[0]?.title || zone?.name;

    if (loading) {
        return (
            <div className="py-20 text-center">
                <p className="text-gray-500">Đang tải thông tin phân khu...</p>
            </div>
        );
    }

    if (!zone) {
        return (
            <div className="py-20 text-center">
                <p className="text-gray-500">Không tìm thấy phân khu.</p>
                <Link href={`/du-an/${slug}/tong-quan`} className="text-[#e2cb83] font-bold mt-4 inline-block hover:underline">
                    Quay lại tổng quan dự án
                </Link>
            </div>
        );
    }

    // Filter articles based on active tab
    // We treat 'tong-quan' as articles with type 'tong-quan' or empty type (legacy)
    const renderContent = () => {
        if (activeTab === 'tong-quan') {
            const overviewArticles = articles.filter(a => !a.type || a.type === 'tong-quan' || a.type === 'overview');
            return (
                <div className="space-y-12">
                    {overviewArticles.length > 0 ? (
                        overviewArticles.map(article => (
                            <DynamicArticleRenderer key={article.id} article={article} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-16 border border-dashed border-gray-200 rounded-lg">
                            Bài viết Thông tin chung đang được cập nhật.
                        </div>
                    )}
                </div>
            );
        }

        if (activeTab === 'vi-tri') {
            const locationArticles = articles.filter(a => a.type === 'vi-tri' || a.type === 'location');
            return (
                <div className="space-y-12">
                    {/* Map Section */}
                    {project && (project.latitude || project.google_map) && (
                        <div className="aspect-w-16 aspect-h-7 rounded-2xl overflow-hidden shadow-md h-[400px] mb-8">
                            {project.latitude && project.longitude ? (
                                <iframe
                                    src={`https://maps.google.com/maps?q=${project.latitude},${project.longitude}&z=15&output=embed`}
                                    title="Google Map"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            ) : project.google_map ? (
                                <div
                                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                                    dangerouslySetInnerHTML={{ __html: project.google_map }}
                                />
                            ) : null}
                        </div>
                    )}

                    {locationArticles.length > 0 ? (
                        locationArticles.map(article => (
                            <DynamicArticleRenderer key={article.id} article={article} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8 italic">
                            Các bài viết chi tiết về Vị trí đang cập nhật.
                        </div>
                    )}
                </div>
            );
        }

        if (activeTab === 'layout' || activeTab === 'chinh-sach') {
            const targetType = activeTab === 'layout' ? 'layout' : 'chinh-sach';
            const targetArticles = articles.filter(a => a.type === targetType);
            
            return (
                <div className="space-y-12">
                    {targetArticles.length > 0 ? (
                        targetArticles.map(article => (
                            <DynamicArticleRenderer key={article.id} article={article} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-16 border border-dashed border-gray-200 rounded-lg">
                            Nội dung chi tiết đang được cập nhật.
                        </div>
                    )}
                </div>
            );
        }

        // Default for Bảng hàng, Quỹ căn
        return (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-300 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-gray-500 text-lg">Hệ thống đang đồng bộ dữ liệu.</p>
                <p className="text-gray-400 text-sm mt-1">Vui lòng quay lại sau.</p>
            </div>
        );
    };

    return (
        <section className="bg-white min-h-screen pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Level 1: Zones Navigation */}
                <div className="flex flex-col gap-2 mb-10">
                    <div className="flex items-center gap-2 text-[#e2cb83] font-medium text-sm">
                        <span className="w-1 h-4 bg-[#e2cb83]"></span>
                        Danh sách tòa nhà :
                    </div>
                    <div className="flex flex-wrap items-center gap-0 border border-gray-200 rounded-md overflow-hidden self-start bg-white">
                        <Link 
                            href={`/du-an/${slug}/tong-quan`}
                            className="px-4 py-2.5 text-xs text-gray-600 font-medium hover:bg-gray-50 transition-colors border-r border-gray-200 flex items-center gap-1.5 uppercase"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                            {project?.name || project?.translations?.[0]?.name || "Dự án"} (Tổng quan)
                        </Link>
                        
                        {projectZones.map((z, idx) => {
                            const slugZ = z.translations?.[0]?.slug || z.id.toString();
                            const titleZ = z.translations?.[0]?.title || z.name;
                            const isActive = slugZ === zoneSlug;
                            return (
                                <Link 
                                    key={z.id}
                                    href={`/du-an/${slug}/phan-khu/${slugZ}`}
                                    className={`px-4 py-2.5 text-xs font-semibold uppercase transition-colors ${idx !== projectZones.length - 1 ? 'border-r border-gray-200' : ''} ${isActive ? 'bg-gray-500 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                                >
                                    {titleZ}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Level 2: Sub-Menu Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 pb-3 border-b border-gray-200/60 max-w-full overflow-x-auto hide-scrollbar">
                        {TABS.map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1.5 pb-2 border-b-2 transition-all whitespace-nowrap text-sm font-medium ${
                                        isActive 
                                            ? 'border-[#e2cb83] text-[#e2cb83]' 
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        {tab.icon}
                                    </svg>
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content rendering */}
                <div className="animate-fade-in-up">
                    {renderContent()}
                </div>
                
            </div>
        </section>
    );
}
