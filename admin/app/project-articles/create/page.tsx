"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminApi } from "../../lib/api";
import Link from "next/link";
import RichTextEditor from "../../components/RichTextEditor";
import MediaPicker from "../../components/MediaPicker";

export default function CreateProjectArticlePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{ type: "banner" | "slide"; index?: number }>({ type: "banner" });
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
    slide_images: [] as { image: string; title: string }[],
  });

  useEffect(() => {
    const loadProjects = async () => {
      const data = await fetchAdminApi("/projects");
      if (data) {
        setProjects(data.data || data);
      }
    };
    loadProjects();

    const params = new URLSearchParams(window.location.search);
    const pId = params.get("project_id");
    const pType = params.get("type");
    if (pId || pType) {
      setFormData(prev => ({
        ...prev,
        project_id: pId || prev.project_id,
        type: pType || prev.type,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, html_content: content }));
  };

  const handleAddSlide = () => {
    setFormData(prev => ({
      ...prev,
      slide_images: [...prev.slide_images, { image: "", title: "" }]
    }));
  };

  const handleRemoveSlide = (index: number) => {
    setFormData(prev => ({
      ...prev,
      slide_images: prev.slide_images.filter((_, i) => i !== index)
    }));
  };

  const handleSlideChange = (index: number, field: "image" | "title", value: string) => {
    setFormData(prev => {
      const newSlides = [...prev.slide_images];
      newSlides[index] = { ...newSlides[index], [field]: value };
      return { ...prev, slide_images: newSlides };
    });
  };

  const openPicker = (type: "banner" | "slide", index?: number) => {
    setPickerTarget({ type, index });
    setPickerOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/admin"}/project-articles`, {
        method: "POST",
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
        alert("Lỗi: " + (errorData.message || "Không thể tạo bài viết"));
      }
    } catch (error) {
      alert("Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
          <Link href="/project-articles" className="hover:text-primary transition-colors">Bài Viết Dự Án</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900">Thêm Bài Mới</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Tạo Bài Viết Dự Án</h1>
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
                placeholder="Ví dụ: Tổng quan dự án, Vị trí đắc địa..."
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
                  onClick={() => openPicker("banner")}
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
                    placeholder="URL hình ảnh banner..."
                  />
                </div>
              </div>
            </div>

            {/* Slide Images Section */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-slate-700">Danh sách hình ảnh (Slide)</label>
                <button 
                  type="button"
                  onClick={handleAddSlide}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Thêm hình ảnh
                </button>
              </div>
              
              {formData.slide_images.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm italic">
                  Chưa có hình ảnh nào trong danh sách
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {formData.slide_images.map((slide, index) => (
                    <div key={index} className="relative group bg-white p-2 rounded-xl border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                      <div 
                        onClick={() => openPicker("slide", index)}
                        className="aspect-video rounded-lg bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer flex items-center justify-center mb-2"
                      >
                        {slide.image ? (
                          <img src={slide.image} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300">image</span>
                        )}
                      </div>
                      <input 
                        value={slide.title}
                        onChange={(e) => handleSlideChange(index, "title", e.target.value)}
                        placeholder="Tiêu đề ảnh..."
                        className="w-full text-[11px] font-bold text-slate-700 bg-slate-50 border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30"
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveSlide(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-600"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
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
              {loading ? "Đang lưu..." : "Lưu Bài Viết"}
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
          if (pickerTarget.type === "banner") {
            setFormData(prev => ({ ...prev, banner_image: url }));
          } else if (pickerTarget.type === "slide" && pickerTarget.index !== undefined) {
            handleSlideChange(pickerTarget.index, "image", url);
          }
          setPickerOpen(false);
        }}
        title={pickerTarget.type === "banner" ? "Chọn hình banner bài viết" : "Chọn hình ảnh cho slide"}
      />
    </div>
  );
}
