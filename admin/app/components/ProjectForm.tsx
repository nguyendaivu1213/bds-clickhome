"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "./RichTextEditor";
import MediaPicker from "./MediaPicker";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

interface Category {
  id: number;
  title: string;
  parent_id: number | null;
  data_type: string;
}

interface Investor {
  id: number;
  name: string;
}

interface ProjectFormProps {
  initialData?: any;
  mode: "create" | "update";
}

const TABS = [
  { id: "info", label: "Tổng quan", icon: "info" },
  { id: "seo", label: "SEO", icon: "search" },
  { id: "location", label: "Vị trí", icon: "location_on" },
  { id: "360", label: "360 độ", icon: "360" },
  { id: "layout", label: "Mặt bằng & Layout", icon: "layers" },
  { id: "amenities", label: "Tiện ích", icon: "pool" },
  { id: "media", label: "Hình ảnh & Video", icon: "imagesmode" },
  { id: "pricing", label: "Giá & Chính sách", icon: "sell" },
  { id: "progress", label: "Tiến độ", icon: "event_available" },
  { id: "contact", label: "Liên hệ", icon: "contact_support" },
];

const DEFAULT_FORM_DATA = {
  name: "",
  mainCategory: "",
  subCategory: "",
  tags: "",
  perspectiveImage: "",
  footerImage: "",
  slogan: "",
  shortDesc: "",
  fullDesc: "",
  publishDate: "",
  url: "",
  urlPrefix: "https://clickhome.vn/du-an/",
  status: "Planning",
  publishedStatus: "draft",
  order: 0,
  // SEO
  seoTitle: "",
  seoDesc: "",
  seoKeywords: [] as string[],
  seoHeader: "h1",
  // Overview
  investor: "",
  scale: "",
  productTypes: "Căn hộ chung cư",
  designUnit: "",
  handoffTime: "",
  legal: "",
  youtube_link: "",
  actualAddress: "",
  slides: [] as { image: string; title: string }[],
  // Location
  googleMapLink: "",
  latitude: "10.8752",
  longitude: "106.8245",
  locationStrengths: "",
  realPhotos: [] as string[],
  connections: [] as { icon: string; title: string; duration: string }[],
  // 360
  tour360: [] as { category: string; title: string; link: string }[],
  // Layout
  masterPlan: [] as { image: string; title: string; desc: string }[],
  unitLayouts: [] as { type: string; title: string; area: string; image: string }[],
  // Amenities
  amenities: [] as { image: string; title: string; desc: string; isHighlight: boolean }[],
  // Images & Video
  mediaImages: [] as { image: string; title: string }[],
  mediaVideos: [] as { title: string; link: string }[],
  // Pricing & Policies
  pricingProducts: [] as { code: string; type: string; area: string; price: string }[],
  paymentPlans: [] as { title: string; desc: string; isSelected: boolean }[],
  policyArticle: null as { title: string; updatedAt: string } | null,
  documents: [] as { name: string; type: string }[],
  // Progress
  progressHistory: [] as { image: string; title: string; desc: string; date: string }[],
  // Contact
  email: "",
  phone: "",
  notificationSettings: {
    emailConfirm: true,
    zaloNotification: false,
  },
};

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [currentMediaTarget, setCurrentMediaTarget] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAutoSlug, setIsAutoSlug] = useState(mode === "create");

  useEffect(() => {
    async function fetchInvestors() {
      try {
        const res = await fetch(`${API_BASE}/investors?per_page=500`, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const items = (data.data ?? data) as any[];
          setInvestors(items.map(item => {
            const trans = item.translations?.find((t: any) => t.locale === 'vi') ?? item.translations?.[0];
            return {
              id: item.id,
              name: trans?.name ?? item.name ?? `Investor ${item.id}`,
            };
          }));
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách chủ đầu tư:', err);
      }
    }
    fetchInvestors();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE}/categories?per_page=500`, {
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const items = (data.data ?? data) as any[];
          setCategories(items.map(item => {
            const trans = item.translations?.find((t: any) => t.locale === 'vi') ?? item.translations?.[0];
            return {
              id: item.id,
              title: item.title ?? trans?.title ?? `Category ${item.id}`,
              parent_id: item.parent_id,
              data_type: item.data_type || "Dự án"
            };
          }));
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách chuyên mục:', err);
      }
    }
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState(() => {
    if (!initialData) return DEFAULT_FORM_DATA;
    return { ...DEFAULT_FORM_DATA, ...initialData };
  });

  const mainCategories = categories.filter(c => c.parent_id === null && (c.data_type === "Dự án" || c.data_type === "Trang dự án"));
  const subCategories = categories.filter(c => c.parent_id?.toString() === formData.mainCategory);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate URL from name if enabled
      if (field === "name" && isAutoSlug) {
        newData.url = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[đĐ]/g, "d")
          .replace(/([^0-9a-z-\s])/g, "")
          .replace(/(\s+)/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "");
      }
      return newData;
    });
  };

  const openMediaPicker = (target: string) => {
    setCurrentMediaTarget(target);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelect = (fileUrl: string) => {
    if (currentMediaTarget) {
      if (currentMediaTarget.includes(".")) {
        const parts = currentMediaTarget.split(".");
        const field = parts[0];
        const index = parseInt(parts[1]);
        const subField = parts[2];

        const newList = [...(formData as any)[field]];
        if (subField) {
          // For array of objects (e.g., amenities.0.image)
          newList[index] = { ...newList[index], [subField]: fileUrl };
        } else {
          // For array of strings (e.g., realPhotos.0)
          newList[index] = fileUrl;
        }
        handleInputChange(field, newList);
      } else {
        // Direct field
        handleInputChange(currentMediaTarget, fileUrl);
      }
    }
    setIsMediaPickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const url = mode === "create" ? `${API_BASE}/projects` : `${API_BASE}/projects/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const bodyData = { 
        ...formData,
        mainCategory: formData.mainCategory ? parseInt(formData.mainCategory) : null,
        investor: formData.investor ? parseInt(formData.investor) : null,
        order: formData.order ? parseInt(String(formData.order)) : 0,
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.errors) {
          const flatErrors: Record<string, string> = {};
          Object.entries(data.errors).forEach(([k, v]) => {
            flatErrors[k] = (v as string[])[0];
          });
          setErrors(flatErrors);
        } else {
          throw new Error(data.message || `Lỗi khi ${mode === "create" ? "tạo" : "cập nhật"} dự án`);
        }
        return;
      }

      router.push("/projects");
      router.refresh();
    } catch (err: any) {
      setErrors({ _global: err.message || "Không thể kết nối đến máy chủ." });
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative pb-24 max-w-[1400px] mx-auto w-full px-4 md:px-8">
      {errors._global && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex gap-3 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined">error</span>
          {errors._global}
        </div>
      )}
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8 pt-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Link className="text-slate-500 hover:text-primary transition-colors" href="/projects">Quản lý dự án</Link>
            <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
            <span className="text-slate-900 font-semibold">{mode === "create" ? "Thêm Dự Án Mới" : "Cập nhật Dự Án"}</span>
          </div>
          <h1 className="text-slate-900 text-3xl font-black tracking-tight">
            {mode === "create" ? "Thêm Dự Án Mới" : `Cập nhật dự án: ${formData.name || "Riverside Complex"}`}
          </h1>
          <p className="text-primary/70 text-sm font-medium">Quản lý nội dung và thông tin hiển thị của dự án trên website</p>
        </div>
        <div className="flex gap-3">
          <button type="button" className="px-5 py-2 rounded-lg border border-slate-200 font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all">Huỷ</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-primary hover:bg-teal-600 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70">
            {loading ? (
              <><span className="size-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Đang lưu...</>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span>
                {mode === "create" ? "Tạo Dự Án" : "Lưu Thay Đổi"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar sticky top-0 bg-slate-50 z-20 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="flex gap-8 whitespace-nowrap min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 pt-4 text-sm transition-all relative ${
                activeTab === tab.id
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-slate-500 font-medium hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === "info" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">description</span>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Thông tin cơ bản</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700">Tên dự án <span className="text-red-500">*</span></label>
                        <button 
                          type="button" 
                          onClick={() => setIsAutoSlug(!isAutoSlug)}
                          className={`text-[10px] font-black px-2 py-0.5 rounded transition-colors ${isAutoSlug ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}
                        >
                          AUTO URL {isAutoSlug ? 'ON' : 'OFF'}
                        </button>
                      </div>
                      <input 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                        placeholder="VD: Riverside Complex"
                        value={formData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                      {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-sm font-bold text-slate-700">Chủ đầu tư</label>
                       <select 
                         className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                         value={formData.investor}
                         onChange={(e) => handleInputChange("investor", e.target.value)}
                       >
                         <option value="">Chọn chủ đầu tư</option>
                         {investors.map(inv => (
                           <option key={inv.id} value={inv.id}>{inv.name}</option>
                         ))}
                       </select>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Slogan dự án</label>
                  <input 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium italic"
                    placeholder="VD: Nơi khơi nguồn hạnh phúc"
                    value={formData.slogan || ""}
                    onChange={(e) => handleInputChange("slogan", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Mô tả ngắn (Description)</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium min-h-[100px] resize-none"
                    placeholder="Nhập mô tả ngắn gọn về dự án..."
                    value={formData.shortDesc || ""}
                    onChange={(e) => handleInputChange("shortDesc", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Thẻ từ khóa (Tags)</label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50 min-h-[50px]">
                    {(formData.tags || "").split(",").filter(Boolean).map((tag: string, i: number) => (
                      <span key={i} className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 shadow-sm transition-all group hover:border-primary">
                        {tag.trim()}
                        <button 
                          type="button"
                          onClick={() => {
                            const currentTags = formData.tags.split(",").filter(Boolean);
                            const newTags = currentTags.filter((_: string, idx: number) => idx !== i);
                            handleInputChange("tags", newTags.join(","));
                          }}
                          className="material-symbols-outlined text-sm text-slate-300 hover:text-red-500"
                        >
                          close
                        </button>
                      </span>
                    ))}
                    <input 
                      className="flex-1 bg-transparent border-none p-0 text-xs font-bold focus:ring-0 placeholder:text-slate-300"
                      placeholder="Thêm tag (VD: chung-cu, quan-2)..."
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                           e.preventDefault();
                           const currentTags = formData.tags ? formData.tags.split(",") : [];
                           const newTags = [...currentTags, e.target.value.trim()];
                           handleInputChange("tags", newTags.join(","));
                           e.target.value = "";
                        }
                      }}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">article</span>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Nội dung chi tiết (Rich Text)</h3>
                </div>
                <RichTextEditor 
                   content={formData.fullDesc} 
                   onChange={(val) => handleInputChange("fullDesc", val)} 
                />
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">info</span>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Tổng quan chi tiết</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Quy mô dự án</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-primary focus:border-primary outline-none" value={formData.scale} onChange={(e) => handleInputChange("scale", e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Địa chỉ thực tế</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-primary focus:border-primary outline-none" value={formData.actualAddress} onChange={(e) => handleInputChange("actualAddress", e.target.value)} />
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Đơn vị thiết kế</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-primary focus:border-primary outline-none" value={formData.designUnit} onChange={(e) => handleInputChange("designUnit", e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Tình trạng pháp lý</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-primary focus:border-primary outline-none" value={formData.legal} onChange={(e) => handleInputChange("legal", e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Youtube Link</label>
                        <input placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-primary focus:border-primary outline-none" value={formData.youtube_link} onChange={(e) => handleInputChange("youtube_link", e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700">Thời gian bàn giao</label>
                        <input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-primary focus:border-primary outline-none" value={formData.handoffTime} onChange={(e) => handleInputChange("handoffTime", e.target.value)} />
                      </div>
                   </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">view_carousel</span>
                     <h3 className="text-xl font-bold text-slate-900 font-display">Slide ảnh nổi bật</h3>
                  </div>
                  <button type="button" onClick={() => handleInputChange("slides", [...formData.slides, { image: "", title: "" }])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm Slide</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.slides.map((slide: any, idx: number) => (
                    <div key={idx} className="group relative bg-slate-50 rounded-2xl border border-slate-100 p-3">
                       <div onClick={() => openMediaPicker(`slides.${idx}.image`)} className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-3 cursor-pointer flex items-center justify-center">
                          {slide.image ? <img src={slide.image} className="w-full h-full object-cover" alt="Slide" /> : <span className="material-symbols-outlined text-slate-300">add_a_photo</span>}
                       </div>
                       <input className="w-full border-none p-0 text-[10px] font-bold text-center bg-transparent" placeholder="Tiêu đề..." value={slide.title || ""} onChange={(e) => {
                         const newSlides = [...formData.slides];
                         newSlides[idx].title = e.target.value;
                         handleInputChange("slides", newSlides);
                       }} />
                       <button type="button" onClick={() => handleInputChange("slides", formData.slides.filter((_: any, i: number) => i !== idx))} className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-lg">
                         <span className="material-symbols-outlined text-[14px]">close</span>
                       </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">search</span>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Cấu hình SEO</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700">SEO Title</label>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${formData.seoTitle.length > 60 ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>{formData.seoTitle.length} / 60</span>
                    </div>
                    <input 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium"
                      placeholder="VD: Riverside Complex | Căn hộ cao cấp Quận 2"
                      value={formData.seoTitle || ""}
                      onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700">SEO Meta Description</label>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${formData.seoDesc.length > 160 ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'}`}>{formData.seoDesc.length} / 160</span>
                    </div>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-medium min-h-[100px] resize-none"
                      placeholder="Mô tả tóm tắt nội dung trang..."
                      value={formData.seoDesc || ""}
                      onChange={(e) => handleInputChange("seoDesc", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="relative">
                   <div className="flex justify-between items-center mb-6">
                      <h4 className="text-white text-sm font-black flex items-center gap-3 uppercase tracking-widest opacity-60">Google Search Preview</h4>
                      <span className="material-symbols-outlined text-primary text-2xl">google</span>
                   </div>
                   <div className="space-y-2 bg-white/5 backdrop-blur-sm p-6 rounded-3xl border border-white/5 shadow-inner text-white">
                      <div className="text-[#1a0dab] text-xl font-bold hover:underline cursor-pointer">
                        {formData.seoTitle || "Riverside Complex | Căn hộ cao cấp Quận 2"}
                      </div>
                      <div className="text-[#006621] text-sm">{formData.urlPrefix}{formData.url || "riverside-complex"}</div>
                      <div className="text-[#4d5156] text-sm line-clamp-2 leading-relaxed">
                        {formData.seoDesc || "Riverside Complex là dự án căn hộ cao cấp bậc nhất tại Quận 2..."}
                      </div>
                   </div>
                </div>
              </section>
            </div>
          )}



          {activeTab === "location" && (
            <div key="loc" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-12 flex flex-col gap-6">
                     <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                           <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">location_on</span> Bản đồ Vị trí</h3>
                        </div>
                        <div className="p-6 border-b border-slate-100 space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Link Google Maps</label>
                           <div className="flex gap-2">
                              <input
                                 className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                 placeholder="https://www.google.com/maps/@lat,lng,15z ..."
                                 value={formData.googleMapLink || ""}
                                 onChange={(e) => {
                                    const url = e.target.value;
                                    handleInputChange("googleMapLink", url);
                                    
                                    let lat, lng;
                                    const m1 = url.match(/@(-?[\d.]+),(-?[\d.]+)/);
                                    if (m1) { lat = m1[1]; lng = m1[2]; }
                                    
                                    if (!lat || !lng) {
                                      const m2 = url.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
                                      if (m2) { lat = m2[1]; lng = m2[2]; }
                                    }
                                    
                                    if (!lat || !lng) {
                                      const m3 = url.match(/[?&]q=(-?[\d.]+),(-?[\d.]+)/);
                                      if (m3) { lat = m3[1]; lng = m3[2]; }
                                    }

                                    if (lat && lng) { 
                                      handleInputChange("latitude", lat); 
                                      handleInputChange("longitude", lng); 
                                    }
                                 }}
                              />
                              {formData.googleMapLink && (
                                 <a href={formData.googleMapLink} target="_blank" rel="noopener noreferrer"
                                    className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Mở Google Maps">
                                    <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                                 </a>
                              )}
                           </div>
                           <p className="text-[10px] text-slate-400">Dán link từ Google Maps. Hệ thống sẽ tự điền tọa độ và hiển thị bản đồ.</p>
                        </div>
                        <div className="aspect-video w-full bg-slate-100 relative">
                           {formData.latitude && formData.longitude ? (
                              <iframe
                                 src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
                                 className="w-full h-full border-none"
                                 allowFullScreen
                                 loading="lazy"
                              />
                           ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                 <span className="material-symbols-outlined text-6xl text-slate-200">map</span>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nhập link Google Maps để xem preview</p>
                              </div>
                           )}
                        </div>
                        {/* Hidden Latitude and Longitude */}
                        <div className="hidden">
                           <input value={formData.latitude || ""} readOnly />
                           <input value={formData.longitude || ""} readOnly />
                        </div>
                     </div>
                  </div>
                  <div className="lg:col-span-12 space-y-8">
                     <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <h3 className="font-bold text-lg flex items-center gap-2"><span className="material-symbols-outlined text-primary">description</span> Chi tiết vị trí</h3>
                        <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium min-h-[120px]" placeholder="Mô tả thế mạnh vị trí..." value={formData.locationStrengths || ""} onChange={(e) => handleInputChange("locationStrengths", e.target.value)} />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                           <div className="flex justify-between items-center">
                              <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">image</span> Ảnh thực tế</h3>
                              <button type="button" onClick={() => handleInputChange("realPhotos", [...formData.realPhotos, ""])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm</button>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              {formData.realPhotos.map((photo: string, idx: number) => (
                                 <div key={idx} className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 group overflow-hidden cursor-pointer" onClick={() => openMediaPicker(`realPhotos.${idx}`)}>
                                    {photo ? <img src={photo} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-200">add</span>}
                                    <button type="button" onClick={(e) => { e.stopPropagation(); handleInputChange("realPhotos", formData.realPhotos.filter((_: any, i: number) => i !== idx)); }} className="absolute top-2 right-2 size-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="material-symbols-outlined text-[12px]">close</span></button>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 space-y-6">
                           <h3 className="font-bold text-primary flex items-center gap-2"><span className="material-symbols-outlined">commute</span> Kết nối vùng</h3>
                           <div className="space-y-4">
                              {formData.connections.map((conn: any, idx: number) => (
                                 <div key={idx} className="bg-white p-4 rounded-2xl border border-primary/10 shadow-sm flex items-center gap-4 group">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined">{conn.icon || "location_on"}</span></div>
                                    <div className="flex-1">
                                       <input className="w-full border-none p-0 text-xs font-black text-slate-700 bg-transparent focus:ring-0" value={conn.title || ""} onChange={(e) => {
                                          const newConn = [...formData.connections];
                                          newConn[idx].title = e.target.value;
                                          handleInputChange("connections", newConn);
                                       }} />
                                       <input className="w-full border-none p-0 text-[10px] font-bold text-slate-400 bg-transparent focus:ring-0" value={conn.duration || ""} onChange={(e) => {
                                          const newConn = [...formData.connections];
                                          newConn[idx].duration = e.target.value;
                                          handleInputChange("connections", newConn);
                                       }} />
                                    </div>
                                    <button type="button" onClick={() => handleInputChange("connections", formData.connections.filter((_: any, i: number) => i !== idx))} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                                 </div>
                              ))}
                              <button type="button" onClick={() => handleInputChange("connections", [...formData.connections, { icon: "commute", title: "Điểm đến mới", duration: "10 phút" }])} className="w-full py-3 border-2 border-dashed border-primary/20 rounded-2xl text-primary text-[10px] font-black uppercase tracking-widest">+ Thêm kết nối</button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
          {activeTab === "amenities" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Tiện ích dự án ({formData.amenities.length})</h3>
                  <button type="button" onClick={() => handleInputChange("amenities", [...formData.amenities, { image: "", title: "", desc: "", isHighlight: false }])} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest">+ Thêm Tiện ích</button>
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {formData.amenities.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                       <div className="text-primary/10 font-black text-3xl italic scale-y-150 w-8">{String(idx + 1).padStart(2, "0")}</div>
                       <div className="relative size-24 shrink-0 rounded-2xl overflow-hidden shadow-inner border border-slate-50 cursor-pointer" onClick={() => openMediaPicker(`amenities.${idx}.image`)}>
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="Amenity" /> : <span className="material-symbols-outlined text-slate-200 absolute inset-0 flex items-center justify-center">add_photo_alternate</span>}
                       </div>
                       <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                             <input className="text-lg font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0 max-w-[300px]" placeholder="Tên tiện ích..." value={item.title || ""} onChange={(e) => {
                               const newAm = [...formData.amenities];
                               newAm[idx].title = e.target.value;
                               handleInputChange("amenities", newAm);
                             }} />
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="size-4 rounded border-slate-200 text-primary focus:ring-primary" checked={item.isHighlight} onChange={(e) => {
                                  const newAm = [...formData.amenities];
                                  newAm[idx].isHighlight = e.target.checked;
                                  handleInputChange("amenities", newAm);
                                }} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nổi bật</span>
                             </label>
                          </div>
                          <textarea className="w-full bg-transparent border-none p-0 text-sm font-medium text-slate-500 focus:ring-0 min-h-[40px] resize-none" placeholder="Mô tả ngắn..." value={item.desc || ""} onChange={(e) => {
                               const newAm = [...formData.amenities];
                               newAm[idx].desc = e.target.value;
                               handleInputChange("amenities", newAm);
                             }} />
                       </div>
                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleInputChange("amenities", formData.amenities.filter((_: any, i: number) => i !== idx))} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                          <div className="p-3 cursor-move text-slate-200"><span className="material-symbols-outlined">drag_indicator</span></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
          {activeTab === "360" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Virtual Tour 360°</h3>
                  <button type="button" onClick={() => handleInputChange("tour360", [...formData.tour360, { category: "Nội thất", title: "Căn hộ mẫu", link: "" }])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm Link Tour</button>
               </div>
               <div className="space-y-4">
                  {formData.tour360.map((tour: any, idx: number) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap md:flex-nowrap items-center gap-6 group">
                       <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><span className="material-symbols-outlined text-3xl">360</span></div>
                       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh mục / Vị trí</label>
                             <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold" value={tour.category || ""} onChange={(e) => {
                               const newT = [...formData.tour360];
                               newT[idx].category = e.target.value;
                               handleInputChange("tour360", newT);
                             }} />
                          </div>
                          <div className="space-y-1">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu đề hiển thị</label>
                             <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold" value={tour.title || ""} onChange={(e) => {
                               const newT = [...formData.tour360];
                               newT[idx].title = e.target.value;
                               handleInputChange("tour360", newT);
                             }} />
                          </div>
                       </div>
                       <div className="flex-1 space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đường dẫn Tour (URL)</label>
                          <input className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-primary" placeholder="https://..." value={tour.link || ""} onChange={(e) => {
                               const newT = [...formData.tour360];
                               newT[idx].link = e.target.value;
                               handleInputChange("tour360", newT);
                          }} />
                       </div>
                       <button type="button" onClick={() => handleInputChange("tour360", formData.tour360.filter((_: any, i: number) => i !== idx))} className="text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "layout" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section>
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-primary">map</span> Mặt bằng tổng thể</h3>
                     <button type="button" onClick={() => handleInputChange("masterPlan", [...formData.masterPlan, { image: "", title: "", desc: "" }])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm mới</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {formData.masterPlan.map((plan: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
                           <div onClick={() => openMediaPicker(`masterPlan.${idx}.image`)} className="aspect-video relative bg-slate-50 cursor-pointer">
                              {plan.image ? <img src={plan.image} className="w-full h-full object-cover" alt="Master Plan" /> : <span className="material-symbols-outlined text-slate-200 absolute inset-0 flex items-center justify-center text-5xl">add_photo_alternate</span>}
                           </div>
                           <div className="p-6 space-y-2">
                              <input className="w-full font-bold text-slate-900 border-none p-0 focus:ring-0" placeholder="Tên mặt bằng..." value={plan.title || ""} onChange={(e) => {
                                 const newP = [...formData.masterPlan];
                                 newP[idx].title = e.target.value;
                                 handleInputChange("masterPlan", newP);
                              }} />
                              <input className="w-full text-xs text-slate-500 border-none p-0 focus:ring-0" placeholder="Mô tả tóm tắt..." value={plan.desc || ""} onChange={(e) => {
                                 const newP = [...formData.masterPlan];
                                 newP[idx].desc = e.target.value;
                                 handleInputChange("masterPlan", newP);
                              }} />
                           </div>
                           <button type="button" onClick={() => handleInputChange("masterPlan", formData.masterPlan.filter((_: any, i: number) => i !== idx))} className="absolute top-2 right-2 size-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg flex items-center justify-center"><span className="material-symbols-outlined text-sm">close</span></button>
                        </div>
                     ))}
                  </div>
               </section>

               <section>
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-primary">floor</span> Layout Căn hộ</h3>
                     <button type="button" onClick={() => handleInputChange("unitLayouts", [...formData.unitLayouts, { image: "", title: "", type: "2PN", area: "68m2" }])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm Layout</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {formData.unitLayouts.map((unit: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm group relative">
                           <div onClick={() => openMediaPicker(`unitLayouts.${idx}.image`)} className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3 cursor-pointer">
                              {unit.image ? <img src={unit.image} className="w-full h-full object-cover" alt="Unit Layout" /> : <span className="material-symbols-outlined text-slate-200 absolute inset-0 flex items-center justify-center">add</span>}
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded uppercase">{unit.type}</div>
                           </div>
                           <input className="w-full font-bold text-[13px] border-none p-0 focus:ring-0" value={unit.title || ""} onChange={(e) => {
                              const newU = [...formData.unitLayouts];
                              newU[idx].title = e.target.value;
                              handleInputChange("unitLayouts", newU);
                           }} />
                           <input className="w-full text-[10px] text-slate-400 font-bold border-none p-0 focus:ring-0" value={unit.area || ""} onChange={(e) => {
                              const newU = [...formData.unitLayouts];
                              newU[idx].area = e.target.value;
                              handleInputChange("unitLayouts", newU);
                           }} />
                           <button type="button" onClick={() => handleInputChange("unitLayouts", formData.unitLayouts.filter((_: any, i: number) => i !== idx))} className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg flex items-center justify-center"><span className="material-symbols-outlined text-xs">close</span></button>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-slate-900">Thư viện Hình ảnh</h3>
                     <button type="button" onClick={() => handleInputChange("mediaImages", [...formData.mediaImages, { image: "", title: "" }])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm ảnh</button>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                     {formData.mediaImages.map((img: any, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-100 group overflow-hidden cursor-pointer" onClick={() => openMediaPicker(`mediaImages.${idx}.image`)}>
                           {img.image ? <img src={img.image} className="w-full h-full object-cover" alt="Gallery" /> : <span className="material-symbols-outlined text-slate-200 absolute inset-0 flex items-center justify-center">add</span>}
                           <button type="button" onClick={(e) => { e.stopPropagation(); handleInputChange("mediaImages", formData.mediaImages.filter((_: any, i: number) => i !== idx)); }} className="absolute top-2 right-2 size-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg flex items-center justify-center"><span className="material-symbols-outlined text-[12px]">close</span></button>
                        </div>
                     ))}
                  </div>
               </section>
               <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-slate-900">Thư viện Video</h3>
                     <button type="button" onClick={() => handleInputChange("mediaVideos", [...formData.mediaVideos, { title: "", link: "" }])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm Video</button>
                  </div>
                  <div className="space-y-3">
                     {formData.mediaVideos.map((vid: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                           <div className="size-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center shrink-0"><span className="material-symbols-outlined">play_circle</span></div>
                           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0" placeholder="Tiêu đề video..." value={vid.title || ""} onChange={(e) => {
                                 const newV = [...formData.mediaVideos];
                                 newV[idx].title = e.target.value;
                                 handleInputChange("mediaVideos", newV);
                              }} />
                              <input className="w-full bg-transparent border-none p-0 text-sm font-medium text-primary focus:ring-0" placeholder="Link Youtube/Vimeo..." value={vid.link || ""} onChange={(e) => {
                                 const newV = [...formData.mediaVideos];
                                 newV[idx].link = e.target.value;
                                 handleInputChange("mediaVideos", newV);
                              }} />
                           </div>
                           <button type="button" onClick={() => handleInputChange("mediaVideos", formData.mediaVideos.filter((_: any, i: number) => i !== idx))} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-colors"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                     ))}
                  </div>
               </section>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><span className="material-symbols-outlined text-primary">sell</span> Bảng giá chi tiết</h3>
                     <button type="button" onClick={() => handleInputChange("pricingProducts", [...formData.pricingProducts, { code: "A.01", type: "Căn hộ", area: "68m2", price: "4.2 Tỷ" }])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm sản phẩm</button>
                  </div>
                  <div className="overflow-hidden rounded-2xl border border-slate-100">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <tr>
                              <th className="px-6 py-4">Mã</th>
                              <th className="px-6 py-4">Loại</th>
                              <th className="px-6 py-4">Diện tích</th>
                              <th className="px-6 py-4">Giá (VND)</th>
                              <th className="px-6 py-4"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {formData.pricingProducts.map((prod: any, idx: number) => (
                              <tr key={idx} className="group hover:bg-slate-50/50 transition-colors uppercase font-bold text-xs text-slate-600">
                                 <td className="px-6 py-4"><input className="w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-slate-900" value={prod.code || ""} onChange={(e) => {
                                    const newP = [...formData.pricingProducts]; newP[idx].code = e.target.value; handleInputChange("pricingProducts", newP);
                                 }} /></td>
                                 <td className="px-6 py-4"><input className="w-full bg-transparent border-none p-0 focus:ring-0" value={prod.type || ""} onChange={(e) => {
                                    const newP = [...formData.pricingProducts]; newP[idx].type = e.target.value; handleInputChange("pricingProducts", newP);
                                 }} /></td>
                                 <td className="px-6 py-4"><input className="w-full bg-transparent border-none p-0 focus:ring-0" value={prod.area || ""} onChange={(e) => {
                                    const newP = [...formData.pricingProducts]; newP[idx].area = e.target.value; handleInputChange("pricingProducts", newP);
                                 }} /></td>
                                 <td className="px-6 py-4"><input className="w-full bg-transparent border-none p-0 focus:ring-0 text-primary" value={prod.price || ""} onChange={(e) => {
                                    const newP = [...formData.pricingProducts]; newP[idx].price = e.target.value; handleInputChange("pricingProducts", newP);
                                 }} /></td>
                                 <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100"><button type="button" onClick={() => handleInputChange("pricingProducts", formData.pricingProducts.filter((_: any, i: number) => i !== idx))} className="text-slate-300 hover:text-red-500"><span className="material-symbols-outlined text-sm">delete</span></button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </section>

               <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6"><span className="material-symbols-outlined text-primary">payments</span> Phương thức thanh toán</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {formData.paymentPlans.map((plan: any, idx: number) => (
                        <div key={idx} className={`p-6 rounded-2xl border transition-all cursor-pointer ${plan.isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 hover:border-primary/30'}`} onClick={() => {
                           const newP = formData.paymentPlans.map((p: any, i: number) => ({ ...p, isSelected: i === idx }));
                           handleInputChange("paymentPlans", newP);
                        }}>
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-slate-900">{plan.title}</h4>
                              <span className="material-symbols-outlined text-primary">{plan.isSelected ? 'check_circle' : 'radio_button_unchecked'}</span>
                           </div>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed">{plan.desc}</p>
                        </div>
                     ))}
                     <button type="button" onClick={() => handleInputChange("paymentPlans", [...formData.paymentPlans, { title: "Chế độ mới", desc: "Mô tả đợt thanh toán...", isSelected: false }])} className="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex items-center justify-center text-slate-300 hover:text-primary hover:border-primary/20 transition-all font-black text-xs uppercase tracking-widest">+ Thêm chế độ</button>
                  </div>
               </section>
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Mốc tiến độ thi công ({formData.progressHistory.length})</h3>
                  <button type="button" onClick={() => handleInputChange("progressHistory", [...formData.progressHistory, { image: "", title: "", desc: "", date: "" }])} className="text-primary text-xs font-black uppercase tracking-widest">+ Thêm mốc</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.progressHistory.map((item: any, idx: number) => (
                     <div key={idx} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm group">
                        <div onClick={() => openMediaPicker(`progressHistory.${idx}.image`)} className="aspect-video relative bg-slate-50 cursor-pointer">
                           {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="Progress" /> : <span className="material-symbols-outlined text-slate-200 absolute inset-0 flex items-center justify-center text-5xl">add_a_photo</span>}
                           <div className="absolute top-4 left-4 size-8 rounded-xl bg-primary text-white font-black text-xs flex items-center justify-center shadow-lg uppercase">#{String(idx + 1).padStart(2, '0')}</div>
                        </div>
                        <div className="p-8 space-y-4">
                           <div className="flex flex-col gap-1">
                              <input className="w-full font-black text-lg text-slate-900 border-none p-0 focus:ring-0" placeholder="Tiêu đề mốc..." value={item.title || ""} onChange={(e) => {
                                 const newH = [...formData.progressHistory]; newH[idx].title = e.target.value; handleInputChange("progressHistory", newH);
                              }} />
                              <input type="text" className="w-full text-[10px] font-black text-primary uppercase tracking-widest border-none p-0 focus:ring-0" placeholder="Tháng 01, 2024" value={item.date || ""} onChange={(e) => {
                                 const newH = [...formData.progressHistory]; newH[idx].date = e.target.value; handleInputChange("progressHistory", newH);
                              }} />
                           </div>
                           <textarea className="w-full text-sm text-slate-500 font-medium border-none p-0 focus:ring-0 min-h-[60px] resize-none" placeholder="Chi tiết thi công..." value={item.desc || ""} onChange={(e) => {
                                 const newH = [...formData.progressHistory]; newH[idx].desc = e.target.value; handleInputChange("progressHistory", newH);
                           }} />
                        </div>
                        <button type="button" onClick={() => handleInputChange("progressHistory", formData.progressHistory.filter((_: any, i: number) => i !== idx))} className="absolute top-4 right-4 size-8 bg-black/20 hover:bg-red-500 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><span className="material-symbols-outlined text-sm">delete</span></button>
                     </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
                  <div className="flex flex-col gap-1">
                     <h3 className="text-2xl font-black text-slate-900 font-display">Cấu hình liên hệ</h3>
                     <p className="text-slate-400 text-sm font-medium">Nhận yêu cầu tư vấn trực tiếp từ khách hàng quan tâm</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email nhận Lead</label>
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 group focus-within:border-primary transition-all">
                           <span className="material-symbols-outlined text-primary">alternate_email</span>
                           <input className="bg-transparent border-none p-0 flex-1 text-sm font-bold text-slate-700 focus:ring-0" placeholder="admin@domain.com" value={formData.email || ""} onChange={(e) => handleInputChange("email", e.target.value)} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hotline dự án</label>
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 group focus-within:border-primary transition-all">
                           <span className="material-symbols-outlined text-primary">call</span>
                           <input className="bg-transparent border-none p-0 flex-1 text-sm font-bold text-slate-700 focus:ring-0" placeholder="0988..." value={formData.phone || ""} onChange={(e) => handleInputChange("phone", e.target.value)} />
                        </div>
                     </div>
                  </div>
               </section>
               <section className="bg-primary/5 p-10 rounded-[40px] border border-primary/10 flex items-start gap-6">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><span className="material-symbols-outlined text-3xl">notifications_active</span></div>
                  <div className="space-y-4 flex-1">
                     <div>
                        <h4 className="font-bold text-slate-900 leading-none">Thông báo tức thời</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">Hệ thống sẽ ping ngay khi có khách để lại thông tin</p>
                     </div>
                     <div className="space-y-3">
                        <label className="flex items-center gap-4 cursor-pointer group">
                           <input type="checkbox" className="size-5 rounded-lg border-primary/20 text-primary focus:ring-primary shadow-sm" checked={formData.notificationSettings.emailConfirm} onChange={(e) => handleInputChange("notificationSettings", { ...formData.notificationSettings, emailConfirm: e.target.checked })} />
                           <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Gửi Email xác nhận tự động</span>
                        </label>
                        <label className="flex items-center gap-4 cursor-pointer group">
                           <input type="checkbox" className="size-5 rounded-lg border-primary/20 text-primary focus:ring-primary shadow-sm" checked={formData.notificationSettings.zaloNotification} onChange={(e) => handleInputChange("notificationSettings", { ...formData.notificationSettings, zaloNotification: e.target.checked })} />
                           <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Gửi thông báo Zalo/SMS cho quản lý</span>
                        </label>
                     </div>
                  </div>
               </section>
            </div>
          )}
        </div>

        {/* Sidebar Area (1/3) */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Trạng thái xuất bản</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/30">
                   <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">public</span>
                      <span className="text-sm font-bold text-slate-700">Công khai</span>
                   </div>
                   <input type="checkbox" className="size-6 rounded-lg border-slate-200 text-primary focus:ring-primary shadow-sm" checked={formData.publishedStatus === "published"} onChange={(e) => handleInputChange("publishedStatus", e.target.checked ? "published" : "draft")} />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Đường dẫn dự án</label>
                   <div className={`flex items-center gap-2 bg-slate-50 p-3 rounded-xl border group transition-all ${errors.url ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-100'}`}>
                      <span className="text-slate-300 text-[10px] font-bold">/du-an/</span>
                      <input className="flex-1 bg-transparent border-none p-0 text-xs font-black text-primary placeholder:text-primary/20 focus:ring-0" placeholder="riverside-complex" value={formData.url || ""} onChange={(e) => handleInputChange("url", e.target.value)} />
                   </div>
                   {errors.url && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1">{errors.url}</p>}
                </div>
             </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Hình ảnh đại diện</h3>
             <div className="space-y-8">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Ảnh phối cảnh (16:9)</label>
                   <div onClick={() => openMediaPicker("perspectiveImage")} className="relative aspect-video w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-all overflow-hidden shadow-inner">
                      {formData.perspectiveImage ? <img src={formData.perspectiveImage} className="w-full h-full object-cover" alt="Perspective" /> : (
                        <div className="text-center">
                           <span className="material-symbols-outlined text-3xl text-slate-200">add_photo_alternate</span>
                           <p className="text-[9px] text-slate-300 mt-2 font-black uppercase tracking-widest">Tải ảnh lên</p>
                        </div>
                      )}
                   </div>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Ảnh Chân Trang (Footer)</label>
                   <div onClick={() => openMediaPicker("footerImage")} className="relative aspect-[3/1] w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-all overflow-hidden shadow-inner">
                      {formData.footerImage ? <img src={formData.footerImage} className="w-full h-full object-cover" alt="Footer" /> : (
                        <div className="text-center">
                           <span className="material-symbols-outlined text-3xl text-slate-200">image</span>
                           <p className="text-[9px] text-slate-300 mt-2 font-black uppercase tracking-widest">Tải ảnh lên</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </section>
        </div>
      </div>

      <MediaPicker 
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)} 
        onSelect={handleMediaSelect} 
      />
    </form>
  );
}
