"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminApi } from "../../lib/api";
import Link from "next/link";
import RichTextEditor from "../../components/RichTextEditor";
import MediaPicker from "../../components/MediaPicker";

export default function CreateZoneArticlePage() {
  const router = useRouter();
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    zone_id: "",
    type: "overview",
    layout_type: "default",
    target_link: "",
    banner_image: "",
    status: "published",
    display_order: 0,
    title: "",
    page_title: "",
    html_content: "",
  });

  useEffect(() => {
    const loadZones = async () => {
      const data = await fetchAdminApi("/zones");
      if (data) {
        setZones(data.data || data);
      }
    };
    loadZones();
  }, []);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/admin"}/zone-articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/zone-articles");
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
          <Link href="/zone-articles" className="hover:text-primary transition-colors">Bài Viết Phân Khu</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900">Thêm Bài Mới</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">Thêm Bài Viết Phân Khu</h1>
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
                placeholder="Ví dụ: Tổng quan phân khu, Vị trí kết nối..."
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
                    placeholder="URL hình ảnh banner..."
                  />
                </div>
              </div>
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
              <label className="block text-sm font-semibold text-slate-600 mb-1">Phân Khu *</label>
              <select 
                name="zone_id"
                value={formData.zone_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">-- Chọn phân khu --</option>
                {zones.map(z => (
                  <option key={z.id} value={z.id}>{z.translations?.[0]?.title || z.title || z.id} ({z.project?.translations?.[0]?.title || z.project?.title || "Dự án"})</option>
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
                <option value="overview">Tổng quan</option>
                <option value="location">Vị trí</option>
                <option value="utilities">Tiện ích</option>
                <option value="design">Thiết kế</option>
                <option value="policy">Chính sách</option>
                <option value="progress">Tiến độ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Kiểu hiển thị (Layout)</label>
              <select 
                name="layout_type"
                value={formData.layout_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="default">Mặc định</option>
                <option value="slider">Giao diện Slider</option>
                <option value="grid">Giao diện Lưới</option>
                <option value="link">Link tham chiếu (Tab Name)</option>
              </select>
            </div>
            {formData.layout_type === "link" && (
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1">Key Tham Chiếu Link (Ví dụ: vi-tri)</label>
                <input 
                  name="target_link"
                  value={formData.target_link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="vi-tri"
                />
              </div>
            )}
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
            <Link href="/zone-articles" className="block text-center text-sm text-slate-500 hover:text-primary transition-colors">
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
