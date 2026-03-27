"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminApi } from "@/app/lib/api";
import MediaPicker from "@/app/components/MediaPicker";
import RichTextEditor from "@/app/components/RichTextEditor";

interface PropertyFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export default function PropertyForm({ initialData = {}, onSubmit, isLoading = false }: PropertyFormProps) {
  const router = useRouter();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);

  // Form State
  const [projectId, setProjectId] = useState(initialData.project_id || "");
  const [zoneId, setZoneId] = useState(initialData.zone_id || "");
  const [productCode, setProductCode] = useState(initialData.product_code || "");
  const [productType, setProductType] = useState(initialData.product_type || "");
  const [floor, setFloor] = useState(initialData.floor || "");
  const [area, setArea] = useState(initialData.area || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [status, setStatus] = useState(initialData.status || "available");
  const [displayOrder, setDisplayOrder] = useState(initialData.display_order || 0);
  const [mainImage, setMainImage] = useState(initialData.main_image || "");
  const [slideImages, setSlideImages] = useState<string[]>(
    initialData.translations?.find((t: any) => t.locale === "vi")?.slide_images || []
  );
  const [videoUrl, setVideoUrl] = useState(initialData.video_url || "");

  // Translated Fields (VI only for simplicity based on past patterns)
  const [viName, setViName] = useState(
    initialData.translations?.find((t: any) => t.locale === "vi")?.name || ""
  );
  const [viSummary, setViSummary] = useState(
    initialData.translations?.find((t: any) => t.locale === "vi")?.summary || ""
  );
  const [viHtmlContent, setViHtmlContent] = useState(
    initialData.translations?.find((t: any) => t.locale === "vi")?.html_content || ""
  );

  // Picker States
  const [mainImagePickerOpen, setMainImagePickerOpen] = useState(false);
  const [slideImagePickerOpen, setSlideImagePickerOpen] = useState(false);

  useEffect(() => {
    fetchAdminApi("/projects?per_page=100").then(res => {
      if (res?.data) setProjects(res.data);
    });
    fetchAdminApi("/zones?per_page=100").then(res => {
      if (res?.data) setZones(res.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      alert("Vui lòng chọn Dự án/Chủ đầu tư");
      return;
    }
    if (!viName) {
      alert("Vui lòng nhập Tên Sản Phẩm");
      return;
    }

    const payload = {
      project_id: projectId,
      zone_id: zoneId || null,
      product_code: productCode,
      product_type: productType,
      floor,
      area: area ? parseFloat(area as string) : null,
      price: price ? parseFloat(price as string) : null,
      main_image: mainImage,
      video_url: videoUrl,
      status,
      display_order: displayOrder,
      vi: {
        name: viName,
        summary: viSummary,
        html_content: viHtmlContent,
        slide_images: slideImages,
      }
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 w-full mb-10">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
        <h2 className="text-xl font-bold text-slate-800">Thông tin Sản phẩm</h2>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold transition-colors shadow-sm">
            Hủy
          </button>
          <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-all disabled:opacity-70 shadow-sm shadow-primary/20">
            {isLoading && <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>}
            Lưu Sản Phẩm
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Form chính */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Thông tin Cơ bản */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Thông tin Cơ bản
            </h3>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Dự Án / CĐT *</label>
                  <select value={projectId} onChange={e => setProjectId(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all">
                    <option value="">Chọn Dự Án</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phân Khu</label>
                  <select value={zoneId} onChange={e => setZoneId(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all">
                    <option value="">Không có phân khu</option>
                    {zones.filter(z => !projectId || z.project_id == projectId).map(z => (
                      <option key={z.id} value={z.id}>{z.translations?.[0]?.title || z.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                 <label className="block text-sm font-semibold text-slate-700 mb-2">Tên Sản Phẩm *</label>
                 <input type="text" value={viName} onChange={e => setViName(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all" placeholder="Ví dụ: Căn hộ 2PN View Sông..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mã Sản Phẩm / Mã Căn</label>
                  <input type="text" value={productCode} onChange={e => setProductCode(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all" placeholder="Ví dụ: S1.01-05.12A" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Loại Căn</label>
                  <select value={productType} onChange={e => setProductType(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all">
                    <option value="">Chọn Loại Căn</option>
                    <option value="Studio">Studio</option>
                    <option value="1PN">1PN</option>
                    <option value="2PN">2PN</option>
                    <option value="3PN">3PN</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Shophouse">Shophouse</option>
                    <option value="Villa">Villa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tầng</label>
                  <input type="text" value={floor} onChange={e => setFloor(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all" placeholder="VD: 05, 12A..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Diện Tích (m2)</label>
                  <input type="number" step="0.01" value={area} onChange={e => setArea(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all" placeholder="VD: 68.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Giá (Triệu VNĐ)</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all" placeholder="VD: 2800 (2.8 Tỷ)" />
                </div>
              </div>
            </div>
          </div>

          {/* Mô tả & Nội dung */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">description</span>
              Mô Tả & Nội Dung
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mô Tả Nhanh (Summary)</label>
              <textarea value={viSummary} onChange={e => setViSummary(e.target.value)} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none resize-none transition-all" placeholder="Mô tả ngắn gọn về sản phẩm..."></textarea>
            </div>

            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">Video YouTube/Vimeo (URL)</label>
               <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none transition-all" placeholder="https://youtube.com/..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nội Dung Chi Tiết</label>
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                 <RichTextEditor content={viHtmlContent} onChange={setViHtmlContent} placeholder="Nội dung chi tiết sản phẩm..." />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Hình ảnh, trạng thái */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4 pb-3 border-b border-slate-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">settings</span>
              Trạng Thái
             </h3>
             <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Trạng Thái Bán</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm">
                    <option value="available">Mở bán (Available)</option>
                    <option value="active">Đang giao dịch (Active)</option>
                    <option value="sold">Đã bán (Sold)</option>
                    <option value="inactive">Tạm ngưng (Inactive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Thứ Tự Hiển Thị</label>
                  <input type="number" value={displayOrder} onChange={e => setDisplayOrder(parseInt(e.target.value) || 0)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 shadow-sm" min="0" />
                  <p className="text-xs text-slate-400 mt-1.5">Số nhỏ hiển thị trước</p>
                </div>
             </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 pb-3 border-b border-slate-200 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-500">image</span>
              Hình Ảnh Chính
            </h3>
            <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-slate-300 relative bg-white transition-all hover:border-primary">
              {mainImage ? (
                <div className="w-full h-full relative group">
                  <img src={mainImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={() => setMainImagePickerOpen(true)} className="p-2.5 bg-white text-slate-700 rounded-xl hover:text-primary hover:bg-slate-50 shadow-lg transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    <button type="button" onClick={() => setMainImage("")} className="p-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setMainImagePickerOpen(true)} className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50/50 transition-colors">
                  <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                  <span className="text-sm font-medium">Bấm để chọn ảnh</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">Nên dùng tỉ lệ 16:9 để hiển thị tối ưu</p>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-500">collections</span>
                  Thư Viện Ảnh (Slides)
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2.5 py-1 rounded-full">{slideImages.length} ảnh</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {slideImages.map((img: string, idx: number) => (
                <div key={idx} className="aspect-square rounded-xl md:rounded-lg overflow-hidden relative group border border-slate-200 bg-white shadow-sm">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setSlideImages(slideImages.filter((_, i) => i !== idx))} className="bg-white text-red-500 rounded-full p-2 flex items-center justify-center size-8 shadow-md hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              
              <button type="button" onClick={() => setSlideImagePickerOpen(true)} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:bg-white transition-all bg-slate-50/50">
                <span className="material-symbols-outlined mb-1">add</span>
                <span className="text-xs font-medium">Thêm ảnh</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Tối đa 15 hình ảnh phối cảnh, sa bàn, thiết kế</p>
          </div>
        </div>
      </div>

      <MediaPicker isOpen={mainImagePickerOpen} onClose={() => setMainImagePickerOpen(false)} onSelect={(url) => { setMainImage(url); setMainImagePickerOpen(false); }} title="Chọn Hình Ảnh Chính" />
      {/* MediaPicker used to support multiple selection via internal state inside MediaPicker in earlier versions, but we don't have multiSelect prop.
          Wait, MediaPicker just returns single url inside onSelect(url). 
          For slides, we can select one by one. */}
      <MediaPicker isOpen={slideImagePickerOpen} onClose={() => setSlideImagePickerOpen(false)} onSelect={(url) => { setSlideImages(prev => [...prev, url]); setSlideImagePickerOpen(false); }} title="Thêm Ảnh Vào Slide" />
    </form>
  );
}
