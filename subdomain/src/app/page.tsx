"use client";

import Link from "next/link";
import { useInvestor } from "@/context/InvestorContext";
import { fetchProjects, fetchPosts, type Project, type Post } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Home() {
  const { investor, loading } = useInvestor();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const investorName = investor?.name || '...';
  const shortDesc = investor?.short_description || '';

  useEffect(() => {
    if (!investor) return;
    
    setProjectsLoading(true);
    fetchProjects(investor.id, 6).then((data) => {
      setProjects(data);
      setProjectsLoading(false);
    });

    setPostsLoading(true);
    fetchPosts(undefined, 6, investor.id).then((data) => {
      setPosts(data);
      setPostsLoading(false);
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
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide border-l-4 border-primary pl-4">Dự án tiêu biểu</h2>
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
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide border-l-4 border-primary pl-4">Thông tin tiêu biểu</h2>
            <Link href="/tin-tuc" className="text-sm font-semibold text-gray-500 hover:text-primary uppercase tracking-wider">Xem tất cả &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsLoading ? (
               [1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm h-full">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
                    <div className="h-5 w-full bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
              ))
            ) : posts.length === 0 ? (
              <p className="col-span-full text-center text-gray-400 py-12 border border-dashed border-gray-200 rounded-xl">Chưa có thông tin nào.</p>
            ) : (
              posts.map((post) => {
                const translation = post.translations?.[0] || {};
                const title = translation.title || post.title;
                const excerpt = translation.excerpt || post.excerpt;
                const dateStr = post.published_at 
                  ? new Date(post.published_at).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' }) 
                  : "";

                return (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="relative overflow-hidden h-52">
                      <img
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={post.featured_image_url || post.featured_image || `https://placehold.co/400x300?text=${encodeURIComponent(title || 'Tin Tuc')}`}
                        onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=Tin+Tuc" }}
                      />
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <p className="text-primary font-bold mb-3 text-xs tracking-wider uppercase">{dateStr}</p>
                      <h3 className="font-bold text-gray-900 text-[16px] mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-gray-600 text-[14px] line-clamp-3 leading-relaxed flex-grow">
                        {excerpt}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
        {/* END: NewsGrid */}
      </main>
    </>
  );
}
