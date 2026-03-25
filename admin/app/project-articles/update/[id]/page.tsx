"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminApi } from "../../../lib/api";
import Link from "next/link";
import RichTextEditor from "../../../components/RichTextEditor";
import MediaPicker from "../../../components/MediaPicker";

export default function UpdateProjectArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_id: "",
    type: "overview",
    layout_type: "basic_image",
    target_link: "",
    banner_image: "",
    status: "published",
    display_order: 0,
    title: "",
    page_title: "",
    summary: "",
    html_content: "",
  });

  useEffect(() => {
    const initData = async () => {
      setFetching(true);
      const [articleData, pjData] = await Promise.all([
        fetchAdminApi(`/project-articles/${id}`),
        fetchAdminApi("/projects")
      ]);

      if (pjData) setProjects(pjData.data || pjData);
      
      if (articleData) {
        const translation = articleData.translations[0] || {};
        setFormData({
          project_id: articleData.project_id?.toString() || "",
          type: articleData.type || "overview",
          layout_type: articleData.layout_type || "basic_image",
          target_link: articleData.target_link || "",
          banner_image: articleData.banner_image || "",
          status: articleData.status || "published",
          display_order: articleData.display_order || 0,
          title: translation.title || "",
          page_title: translation.page_title || "",
          summary: translation.summary || "",
          html_content: translation.html_content || "",
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
    setFormData(prev => ({ ...prev, html_content: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/admin"}/project-articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/project-articles");
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
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
          <Link href="/project-articles" className="hover:text-primary transition-colors">Bài Viết Dự Án</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900">Chi tiết bài viết</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Cập nhật bài viết</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu Đề Bài Viết *</label>
              <input 
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề trang (SEO)</label>
              <input 
                name="page_title"
                value={formData.page_title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Hình ảnh banner</label>
              <div className="flex gap-4 items-start">
                <div 
                  onClick={() => setPickerOpen(true)}
                  className="flex-shrink-0 w-32 h-32 rounded-lg border-2 border-dashed border-slate-200 hover:border-primary flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 transition-all"
                >
                  {formData.banner_image ? (
                    <img src={formData.banner_image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-slate-400">add_photo_alternate</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-1">Chọn ảnh</span>
                    </>
                  )}
                </div>
                <div className="flex-1">
                  <input 
                    name="banner_image"
                    value={formData.banner_image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tóm tắt</label>
              <textarea 
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nội dung chi tiết</label>
              <RichTextEditor 
                content={formData.html_content}
                onChange={handleEditorChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 border-b pb-2">Thông tin chung</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Dự Án *</label>
              <select 
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">-- Chọn dự án --</option>
                {projects.map(pj => (
                  <option key={pj.id} value={pj.id}>{pj.translations?.[0]?.name || pj.name || `Dự án #${pj.id}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Chuyên mục hiển thị</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="overview">Tổng quan</option>
                <option value="location">Vị trí</option>
                <option value="utilities">Tiện ích</option>
                <option value="design">Thiết kế</option>
                <option value="policy">Chính sách</option>
                <option value="progress">Tiến độ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Loại giao diện</label>
              <select 
                name="layout_type"
                value={formData.layout_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="basic_image">Mặc định (Hình, Tóm tắt, Nội dung)</option>
                <option value="location">Vị trí (Mã nhúng Map từ nội dung)</option>
                <option value="horizontal_slide">Slide ngang (3 tấm hình)</option>
                <option value="news_list">Danh sách tin</option>
                <option value="price_list">Loại bảng giá</option>
                <option value="floor_plan_slide">Slide mặt bằng/bản vẽ</option>
                <option value="blue_background">Background blue</option>
                <option value="full_image">Hình ảnh lớn (Full Image)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Đường dẫn liên kết (khi bấm vào)</label>
              <input 
                name="target_link"
                value={formData.target_link}
                onChange={handleChange}
                placeholder="VD: /du-an/vinhomes-vnn/vi-tri"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Thứ tự hiển thị</label>
              <input 
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Trạng thái</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="published">Xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Cập Nhật Bài Viết"}
            </button>
            <Link href="/project-articles" className="block text-center text-sm text-slate-500 hover:text-primary transition-colors">
              Hủy bỏ
            </Link>
          </div>
        </div>
      </form>

      <MediaPicker 
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          setFormData(prev => ({ ...prev, banner_image: url }));
          setPickerOpen(false);
        }}
        title="Chọn hình banner bài viết"
      />
    </div>
  );
}
