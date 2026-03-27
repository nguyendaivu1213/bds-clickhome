"use client";

import { useInvestor } from "@/context/InvestorContext";
import { useEffect, useState, use } from "react";
import { fetchPost, fetchPosts, fetchCategories, Post, Category } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { investor } = useInvestor();
  
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost(slug).then((data) => {
      if (!data) return notFound();
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (investor?.id) {
      // Fetch latest posts for the sidebar
      fetchPosts(undefined, 5, investor.id).then((data) => {
        setLatestPosts(data.filter(p => p.slug !== slug));
      });
      // Fetch related posts (same type if we had type, or just more latest posts) for the bottom
      fetchPosts(undefined, 6, investor.id).then((data) => {
        setRelatedPosts(data.filter(p => p.slug !== slug).sort(() => 0.5 - Math.random()).slice(0, 3));
      });
    }
  }, [investor, slug]);

  useEffect(() => {
    // Tải chuyên mục Tin tức
    fetchCategories('Tin tức').then((data) => {
      const filtered = data.filter(c => c.data_type === 'Tin tức');
      setCategories(filtered.length > 0 ? filtered : data);
    });
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Đang tải bài viết...</div>;
  }

  if (!post) return null;

  const translation = post.translations?.[0] || {};
  const title = translation.title || post.title;
  const content = translation.content || "";
  const dateStr = post.published_at 
    ? new Date(post.published_at).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' }) 
    : "";

  // Đệ quy hiển thị chuyên mục con
  const renderCategoryMenu = (cats: Category[]) => {
    return (
      <ul className="space-y-2 mt-2">
        {cats.map(cat => {
          const catTitle = cat.translations?.[0]?.title || cat.title || "Chuyên mục";
          return (
            <li key={cat.id}>
              <Link href={`/tin-tuc?category_id=${cat.id}`} className="block text-gray-700 hover:text-primary hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors font-medium border border-transparent hover:border-gray-100">
                {catTitle}
              </Link>
              {cat.children && cat.children.length > 0 && (
                <div className="pl-4 border-l border-gray-100 ml-3">
                  {renderCategoryMenu(cat.children)}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <Link href="/tin-tuc" className="hover:text-primary transition-colors">Tin tức</Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 line-clamp-1">{title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-10 overflow-hidden">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{dateStr}</span>
                </div>
              </div>
              
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-l-4 border-primary pl-4">
                  Bài Viết Liên Quan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(rp => {
                    const rpTrans = rp.translations?.[0] || {};
                    const rpTitle = rpTrans.title || rp.title;
                    const rpImg = rp.featured_image_url || rp.featured_image || `https://placehold.co/400x300?text=${encodeURIComponent(rpTitle || 'Tin Tuc')}`;
                    return (
                      <Link href={`/tin-tuc/${rp.slug}`} key={rp.id} className="group">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full transition-transform duration-300 group-hover:-translate-y-1">
                          <div className="h-32 overflow-hidden bg-gray-100">
                            <img src={rpImg} alt={rpTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {rpTitle}
                            </h4>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-10">
              
              {/* Chuyên mục Block */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-l-4 border-primary pl-4">
                  Chuyên mục
                </h3>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">Chưa có chuyên mục</p>
                ) : (
                  renderCategoryMenu(categories)
                )}
              </div>

              {/* Tags Block */}
              {post.tags && post.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-l-4 border-primary pl-4">
                    Thẻ bài viết
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => {
                      const tagName = tag.translations?.[0]?.name || tag.name || "Tag";
                      return (
                        <span key={tag.id} className="inline-block bg-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-colors text-xs px-3 py-1.5 rounded-full cursor-default">
                          #{tagName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mới nhất Block */}
              {latestPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-l-4 border-primary pl-4">
                    Tin Tức Mới Nhất
                  </h3>
                  <div className="space-y-6">
                    {latestPosts.map(lp => {
                      const lpTrans = lp.translations?.[0] || {};
                      const lpTitle = lpTrans.title || lp.title;
                      const lpImg = lp.featured_image_url || lp.featured_image || `https://placehold.co/150x150?text=Tin+Tuc`;
                      
                      return (
                        <Link href={`/tin-tuc/${lp.slug}`} key={lp.id} className="group flex gap-4 items-start">
                          <div className="flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <img src={lpImg} alt={lpTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-[14px] leading-snug group-hover:text-primary transition-colors line-clamp-3">
                              {lpTitle}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                               {lp.published_at ? new Date(lp.published_at).toLocaleDateString("vi-VN") : ""}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
