"use client";

import { use, useEffect, useState } from "react";
import { fetchProject, fetchZone, fetchZoneArticles, Project, ProjectZone, ProjectArticle } from "@/lib/api";
import DynamicArticleRenderer from "@/components/articles/DynamicArticleRenderer";
import Link from "next/link";

export default function ZoneDetailPage({
    params,
}: {
    params: Promise<{ slug: string; zoneSlug: string }>;
}) {
    const { slug, zoneSlug } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [zone, setZone] = useState<ProjectZone | null>(null);
    const [articles, setArticles] = useState<ProjectArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchProject(slug).then(setProject);
        fetchZone(zoneSlug).then((data) => {
            setZone(data);
            if (data?.id) {
                // Fetch all zone articles sequentially
                fetchZoneArticles(data.id).then(setArticles).finally(() => setLoading(false));
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
                <Link href={`/du-an/${slug}/phan-khu`} className="text-[#e2cb83] font-bold mt-4 inline-block hover:underline">
                    Quay lại danh sách phân khu
                </Link>
            </div>
        );
    }

    return (
        <section className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-6">
                    <Link href={`/du-an/${slug}/phan-khu`} className="text-sm text-gray-500 hover:text-[#e2cb83] flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Trở về danh sách phân khu
                    </Link>
                </div>
                
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">
                        Phân khu {zoneTitle}
                    </h2>
                    <div className="w-16 h-1 bg-[#e2cb83] mx-auto"></div>
                </div>

                {articles.length > 0 ? (
                    <div className="dynamic-articles-container space-y-12">
                        {articles.map(article => (
                            <DynamicArticleRenderer key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-16 border border-dashed border-gray-200 rounded-lg">
                        Không có dữ liệu bài viết cho phân khu này.
                    </div>
                )}
            </div>
        </section>
    );
}
