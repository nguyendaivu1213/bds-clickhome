"use client";

import { use, useEffect, useState } from "react";
import ProjectSubNav from "@/components/projects/ProjectSubNav";
import { fetchProject, Project } from "@/lib/api";

export default function ProjectLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        if (slug) {
            fetchProject(slug).then((data) => {
                setProject(data);
            });
        }
    }, [slug]);

    const projectName = project?.name || slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const projectDesc = project?.short_description || `${projectName} là tổ hợp căn hộ cao cấp, biệt thự, liền kề, shophouse, trường học nằm trong khu đô thị đẳng cấp. Lấy cảm hứng từ hình tượng thiên nhiên tinh khiết mang đến một cuộc sống an lành, ngập tràn hạnh phúc.`;

    return (
        <div className="bg-white">
            <ProjectSubNav slug={slug} />

            {/* Hero Banner Section */}
            <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center overflow-hidden">
                <img
                    src={project?.perspective_image_url || "https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-4.jpg"}
                    alt={projectName}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-20 max-w-7xl mx-auto px-4 w-full">
                    <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 max-w-lg shadow-2xl rounded-sm border-t-4 border-[#e2cb83]">
                        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-6 text-gray-800 border-b border-gray-100 pb-4">
                            {projectName}
                        </h1>
                        <p className="text-gray-600 leading-relaxed text-[15px] mb-8 italic">
                            {projectDesc}
                        </p>
                        <button className="bg-[#e2cb83] hover:bg-[#d4be72] text-[#4d422a] font-bold py-3 px-8 rounded-sm transition-all uppercase tracking-wide text-xs shadow-md">
                            Nhận bảng giá & Tài liệu
                        </button>
                    </div>
                </div>
            </section>

            {children}
        </div>
    );
}
