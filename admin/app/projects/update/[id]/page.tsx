'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "../../../components/ProjectForm";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

export default function UpdateProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/projects/${id}`, {
          headers: { 'Accept': 'application/json' }
        });
        if (!res.ok) throw new Error("Không thể tải thông tin dự án");
        const data = await res.json();
        
        // Transform data for ProjectForm
        const vi = data.translations?.find((t: any) => t.locale === 'vi') || data.translations?.[0];
        const transformedData = {
          ...data,
          name: vi?.name || "",
          slogan: vi?.slogan || "",
          shortDesc: vi?.short_description || "",
          fullDesc: vi?.overview_description || "",
          url: vi?.url || "",
          seoTitle: vi?.page_title || "",
          seoDesc: vi?.meta_description || "",
          seoKeywords: vi?.meta_keywords ? vi?.meta_keywords.split(",") : [],
          seoHeader: vi?.header_tag || "h1",
          actualAddress: vi?.location || "",
          scale: vi?.scale || "",
          productTypes: vi?.product_types || "",
          designUnit: vi?.design || "",
          handoffTime: vi?.handover_time || "",
          legal: vi?.legal_status || "",
          slides: vi?.slide_images || [],
          amenities: vi?.amenities || [],
          tags: vi?.tags || "",
          // Map backend fields to frontend formData
          mainCategory: data.primary_category_id ? String(data.primary_category_id) : "",
          investor: data.investor_id ? String(data.investor_id) : "",
          order: data.display_order || 0,
          publishedStatus: data.is_published ? "published" : "draft",
          googleMapLink: data.google_map || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          perspectiveImage: data.perspective_image || "",
          footerImage: data.footer_image || "",
          locationStrengths: vi?.location_strengths || "",
          realPhotos: vi?.real_photos || [],
          connections: vi?.connections || [],
          tour360: vi?.map_360_links || [],
          masterPlan: vi?.master_plan || [],
          unitLayouts: vi?.other_layouts || [],
          progressHistory: vi?.construction_progress || [],
        };

        setProject(transformedData);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium font-display">Đang tải thông tin dự án...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto py-20 text-center">
       <span className="material-symbols-outlined text-red-500 text-6xl mb-4">error</span>
       <h2 className="text-2xl font-bold text-slate-900 mb-2">Lỗi tải dữ liệu</h2>
       <p className="text-slate-500 mb-6">{error}</p>
       <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-xl font-bold">Thử lại</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      {project && <ProjectForm mode="update" initialData={project} />}
    </div>
  );
}
