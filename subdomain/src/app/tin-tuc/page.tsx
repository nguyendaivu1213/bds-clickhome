"use client";

import { useInvestor } from "@/context/InvestorContext";
import { useEffect, useState } from "react";
import { fetchPosts, fetchCategories, Post, Category } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function NewsPage() {
  const { investor, loading } = useInvestor();
  const investorName = investor?.name || '...';
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category_id');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Tải chuyên mục Tin tức
    fetchCategories('Tin tức').then((data) => {
      // Chỉ giữ lại những danh mục cha có type = Tin tức, thư viện admin API đôi khi không lọc sẵn
      const filtered = data.filter(c => c.data_type === 'Tin tức');
      setCategories(filtered.length > 0 ? filtered : data); // Fallback nếu API không trả đúng data_type
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      if (investor?.id) {
        setFetching(true);
        fetchPosts(undefined, 12, investor.id, undefined, categoryId || undefined).then(data => {
          setPosts(data);
          setFetching(false);
        });
      } else {
        setFetching(false);
      }
    }
  }, [investor, loading, categoryId]);

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
    <>
      <section className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide mb-4">
            Thông tin {loading ? '' : investorName}
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-600 max-w-3xl mx-auto mb-8">
            Cập nhật tin tức mới nhất về các dự án, sự kiện và hoạt động nổi bật từ nhà phát triển bất động sản {investorName}.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          <div className="lg:col-span-3">
            {fetching ? (
              <div className="text-center py-10 text-gray-500">Đang tải tin tức...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">Chưa có bài viết nào.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => {
                  const translation = post.translations?.[0] || {};
                  const title = translation.title || post.title;
                  const excerpt = translation.excerpt || post.excerpt;
                  const dateStr = post.published_at 
                    ? new Date(post.published_at).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' }) 
                    : "";

                  return (
                    <Link href={`/tin-tuc/${post.slug}`} key={post.id} className="group flex h-full">
                      <div className="project-card border border-gray-100 rounded-custom overflow-hidden bg-white shadow-sm flex flex-col h-full w-full transition-all group-hover:shadow-md group-hover:-translate-y-1 duration-300">
                        <div className="relative overflow-hidden w-full h-48">
                          <img
                            alt={title || 'News'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={post.featured_image_url || post.featured_image || `https://placehold.co/400x300?text=${encodeURIComponent(title || 'Tin Tuc')}`}
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/400x300?text=Tin+Tuc" }}
                          />
                        </div>
                        <div className="p-5 flex-grow flex flex-col">
                          <p className="text-primary font-bold mb-3 text-xs tracking-wider uppercase">{dateStr}</p>
                          <h3 className="font-bold text-gray-900 text-[16px] mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {title}
                          </h3>
                          <p className="text-gray-600 text-[14px] line-clamp-3 leading-relaxed flex-grow">{excerpt}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cột phải: Sidebar chuyên mục */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide border-l-4 border-primary pl-4">
                Chuyên mục
              </h3>
              {categories.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có chuyên mục</p>
              ) : (
                renderCategoryMenu(categories)
              )}
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
}
