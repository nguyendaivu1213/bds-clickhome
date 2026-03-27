"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminApi } from "../../../lib/api";
import Link from "next/link";
import RichTextEditor from "../../../components/RichTextEditor";
import MediaPicker from "../../../components/MediaPicker";

export default function UpdatePostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [categories, setCategories] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category_id: "",
    investor_id: "",
    type: "Tin tức",
    status: "draft",
    excerpt: "",
    content: "",
    featured_image: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    tags: "",
  });

  useEffect(() => {
    const initData = async () => {
      setFetching(true);
      const [postData, catData, invData] = await Promise.all([
        fetchAdminApi(`/posts/${id}`),
        fetchAdminApi("/categories"),
        fetchAdminApi("/investors")
      ]);

      if (catData) setCategories(catData.data || catData);
      if (invData) setInvestors(invData.data || invData);
      
      if (postData) {
        const translation = postData.translations[0] || {};
        setFormData({
          title: translation.title || "",
          slug: postData.slug || "",
          category_id: postData.category_id?.toString() || "",
          investor_id: postData.investor_id?.toString() || "",
          type: postData.type || "Tin tức",
          status: postData.status || "draft",
          excerpt: translation.excerpt || "",
          content: translation.content || "",
          featured_image: postData.featured_image || "",
          seo_title: translation.seo_title || "",
          seo_description: translation.seo_description || "",
          seo_keywords: translation.seo_keywords || "",
          tags: postData.tags ? postData.tags.map((t: any) => t.translations?.[0]?.name || t.name).join(", ") : "",
        });
      }
      setFetching(false);
    };
    initData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/admin"}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/posts");
      } else {
        const errorData = await res.json();
        alert("Lỗi: " + (errorData.message || "Không thể cập nhật bài viết"));
      }
    } catch (error) {
      alert("Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center">Đang tải dữ liệu bài viết...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
          <Link href="/posts" className="hover:text-primary transition-colors">Bài Viết Chung</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900">Chỉnh Sửa Bài Viết</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Cập Nhật Bài Viết</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu Đề *</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Slug (Đường dẫn)</label>
              <input 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Hình ảnh đại diện</label>
              <div className="flex gap-4 items-start">
                <div 
                  onClick={() => setPickerOpen(true)}
                  className="flex-shrink-0 w-32 h-32 rounded-lg border-2 border-dashed border-slate-200 hover:border-primary flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 transition-all"
                >
                  {formData.featured_image ? (
                    <img src={formData.featured_image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-slate-400">add_photo_alternate</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1">Chọn ảnh</span>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <input 
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                    placeholder="URL hình ảnh..."
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả ngắn</label>
              <textarea 
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nội dung</label>
              <RichTextEditor 
                content={formData.content}
                onChange={handleEditorChange}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Gắn thẻ (Tags)</label>
              <input 
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Nhập các thẻ cách nhau bằng dấu phẩy (vd: Dự án, Nổi bật, Event)"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 border-b pb-2">Cấu hình SEO</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">SEO Title</label>
                <input 
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase">SEO Description</label>
                <textarea 
                  name="seo_description"
                  value={formData.seo_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 border-b pb-2">Trạng thái & Chuyên mục</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Chuyên Mục *</label>
              <select 
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">-- Chọn chuyên mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.translations?.[0]?.title || cat.id}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Chủ đầu tư</label>
              <select 
                name="investor_id"
                value={formData.investor_id}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">-- Chọn chủ đầu tư --</option>
                {investors.map(inv => (
                  <option key={inv.id} value={inv.id}>{inv.translations?.[0]?.name || inv.id}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Loại bài viết</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="Tin tức">Tin tức</option>
                <option value="Album">Album</option>
                <option value="Sản phẩm">Sản phẩm</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Trạng thái</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Xuất bản</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Cập Nhật Bài Viết"}
            </button>
            <Link href="/posts" className="block text-center text-sm text-slate-500 hover:text-primary transition-colors">
              Hủy bỏ
            </Link>
          </div>
        </div>
      </form>

      <MediaPicker 
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          setFormData(prev => ({ ...prev, featured_image: url }));
          setPickerOpen(false);
        }}
        title="Chọn hình đại diện bài viết"
      />
    </div>
  );
}
