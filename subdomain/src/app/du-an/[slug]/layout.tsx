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
            <section
                className="relative w-full overflow-hidden"
                style={{
                    minHeight: '380px',
                    backgroundImage: project?.perspective_image_url
                        ? `url(${project.perspective_image_url})`
                        : 'url(https://masterisehomes.com/masteri-centre-point/themes/mcp/assets/images/overview/img-4.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="relative z-10 flex items-center min-h-[380px] max-w-7xl mx-auto px-8 py-12">
                    <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-sm max-w-md p-8">
                        <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-4">
                            {projectName}
                        </h1>
                        <p className="text-[14px] leading-relaxed text-gray-600">
                            {projectDesc}
                        </p>
                    </div>
                </div>
            </section>

            {children}
        </div>
    );
}
