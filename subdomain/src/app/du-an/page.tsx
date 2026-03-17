"use client";

import Link from "next/link";
import { useInvestor } from "@/context/InvestorContext";
import { fetchProjects, type Project } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const { investor } = useInvestor();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const investorName = investor?.name || '';

  useEffect(() => {
    if (!investor) return;
    fetchProjects(investor.id, 12).then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, [investor?.id]);

  return (
    <>
      {/* Search / Filter Section */}
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">
            Tất cả dự án {investorName}
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-600 max-w-3xl mx-auto mb-8">
            Khám phá trọn bộ các dự án bất động sản tiêu chuẩn quốc tế từ {investorName} tại Việt Nam.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm">
                <div className="h-56 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-2">
                  <div className="h-5 w-2/3 mx-auto bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-full bg-gray-200 animate-pulse rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-400 py-20 text-lg">Chưa có dự án nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/du-an/${project.slug || project.id}`}
                className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full group"
              >
                <div className="relative h-56 overflow-hidden">
                  {project.perspective_image_url ? (
                    <img
                      alt={project.name || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={project.perspective_image_url}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="text-center py-5 px-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-lg">{project.name}</h3>
                </div>
                <div className="p-6 text-[14px] leading-relaxed text-gray-600 flex-grow space-y-2">
                  {project.location && (
                    <p className="flex items-start">
                      <i className="fas fa-map-marker-alt text-primary mt-1 mr-3 w-4"></i>
                      {project.location}
                    </p>
                  )}
                  {project.product_types && (
                    <p className="flex items-start">
                      <i className="fas fa-building text-primary mt-1 mr-3 w-4"></i>
                      {project.product_types}
                    </p>
                  )}
                  {project.handover_time && (
                    <p className="flex items-start">
                      <i className="fas fa-calendar-alt text-primary mt-1 mr-3 w-4"></i>
                      Bàn giao: {project.handover_time}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
