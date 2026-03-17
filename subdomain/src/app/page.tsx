"use client";

import Link from "next/link";
import { useInvestor } from "@/context/InvestorContext";
import { fetchProjects, fetchProjectArticles, type Project, type ProjectArticle } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Home() {
  const { investor, loading } = useInvestor();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [articles, setArticles] = useState<ProjectArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const investorName = investor?.name || '...';
  const shortDesc = investor?.short_description || '';

  useEffect(() => {
    if (!investor) return;
    
    setProjectsLoading(true);
    fetchProjects(investor.id, 6).then((data) => {
      setProjects(data);
      setProjectsLoading(false);
    });

    setArticlesLoading(true);
    fetchProjectArticles(investor.id, 6).then((data) => {
      setArticles(data);
      setArticlesLoading(false);
    });
  }, [investor?.id]);

  return (
    <>
      {/* BEGIN: Breadcrumbs - Minimal version */}
      <section className="bg-[#f8f8f8] py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        </div>
      </section>
      {/* END: Breadcrumbs */}

      {/* BEGIN: IntroHero */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          minHeight: '380px',
          backgroundImage: investor?.intro_image_url
            ? `url(${investor.intro_image_url})`
            : 'none',
          backgroundColor: investor?.intro_image_url ? undefined : '#e5e7eb',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {loading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        <div className="relative z-10 flex items-center min-h-[380px] max-w-7xl mx-auto px-8 py-12">
          <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-sm max-w-md p-8">
            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide mb-4">
              {loading ? (
                <span className="inline-block h-6 w-56 bg-gray-200 animate-pulse rounded" />
              ) : (
                investorName
              )}
            </h1>
            {shortDesc ? (
              <p className="text-[14px] leading-relaxed text-gray-600">
                {shortDesc}
              </p>
            ) : loading ? (
              <div className="space-y-2">
                <span className="block h-3 w-full bg-gray-200 animate-pulse rounded" />
                <span className="block h-3 w-5/6 bg-gray-200 animate-pulse rounded" />
                <span className="block h-3 w-4/5 bg-gray-200 animate-pulse rounded" />
              </div>
            ) : null}
          </div>
        </div>
      </section>
      {/* END: IntroHero */}

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* BEGIN: ProjectsGrid */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-2">
            <h2 className="text-xl font-bold text-gray-900 uppercase">Dự án tiêu biểu</h2>
            <Link href="/du-an" className="text-sm font-semibold text-gray-500 hover:text-primary uppercase tracking-wider">Xem tất cả &rarr;</Link>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
                    <div className="h-2.5 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-2.5 w-2/3 bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-400 py-12">Chưa có dự án nào.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/du-an/${project.slug || project.id}`}
                  className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow"
                >
                  {project.perspective_image_url ? (
                    <img
                      alt={project.name || ''}
                      className="w-full h-48 object-cover"
                      src={project.perspective_image_url}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-300">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5 flex-grow">
                    <h3 className="font-bold text-gray-800 text-[16px] mb-3">{project.name}</h3>
                    <div className="text-[13px] leading-relaxed text-gray-600 space-y-1">
                      {project.location && (
                        <p><span className="font-medium text-gray-700">Vị trí:</span> {project.location}</p>
                      )}
                      {project.product_types && (
                        <p><span className="font-medium text-gray-700">Loại hình:</span> {project.product_types}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* END: ProjectsGrid */}

        {/* BEGIN: NewsGrid */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-2">
            <h2 className="text-xl font-bold text-gray-900 uppercase">Thông tin tiêu biểu</h2>
            <Link href="/news" className="text-sm font-semibold text-gray-500 hover:text-primary uppercase tracking-wider">Xem tất cả &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesLoading ? (
               [1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm h-full">
                  <div className="h-40 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-1/3 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 w-4/5 bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
              ))
            ) : articles.length === 0 ? (
              <p className="col-span-full text-center text-gray-400 py-8">Chưa có thông tin nào.</p>
            ) : (
              articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img
                    alt={article.title || (article.translations?.[0]?.title) || 'Article'}
                    className="w-full h-52 object-cover"
                    src={article.banner_image_url || `https://placehold.co/600x400?text=News`}
                  />
                  <div className="p-5 text-[13px] flex-grow">
                    <h3 className="font-bold text-gray-800 text-[16px] mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {article.title || (article.translations?.[0]?.title)}
                    </h3>
                    <p className="text-gray-500 line-clamp-3 text-[13px] font-medium leading-[1.6]">
                      {article.summary || (article.translations?.[0]?.summary)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        {/* END: NewsGrid */}
      </main>
    </>
  );
}
