"use client";

import { use, useEffect, useState } from "react";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            const projectData = await fetchProject(slug);
            setProject(projectData);

            if (projectData?.id) {
                const sectionToTypeMap: Record<string, string> = {
                    "tong-quan": "overview",
                    "vi-tri": "location",
                    "tien-do": "progress",
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
            setLoading(false);
        };
        initData();
    }, [slug, section, articleSlug]);

    if (loading) {
        return (
            <div className="py-32 text-center bg-gray-50 min-h-screen">
                <p className="text-gray-500">Đang tải nội dung bài viết...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="py-32 text-center bg-gray-50 min-h-screen">
                <p className="text-gray-500 mb-6">Không tìm thấy bài viết.</p>
                <Link href={`/du-an/${slug}/${section}`} className="px-6 py-2 bg-[#e2cb83] text-white font-bold rounded">
                    Quay lại danh sách {section.replace('-', ' ')}
                </Link>
            </div>
        );
    }

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
                        <span className="material-symbols-outlined text-[14px]">arrow_back</span>
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
