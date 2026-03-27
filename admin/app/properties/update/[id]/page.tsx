"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPropertyById, updateProperty } from "@/app/lib/api";
import PropertyForm from "../../components/PropertyForm";
import Link from "next/link";
import { use } from "react";

export default function UpdatePropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPropertyById(unwrappedParams.id);
        setInitialData(data);
      } catch (error) {
        alert("Lỗi tải thông tin sản phẩm");
        router.push("/properties");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [unwrappedParams.id, router]);

  const handleSubmit = async (data: any) => {
    setSubmitLoading(true);
    try {
      await updateProperty(unwrappedParams.id, data);
      alert("Cập nhật thành công!");
      router.push("/properties");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Đang tải biểu mẫu...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link href="/properties" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Danh sách sản phẩm
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Chỉnh sửa</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Chi Tiết Sản Phẩm: {initialData?.product_code || `#${initialData.id}`}</h1>
        <p className="text-slate-500 mt-1">Cập nhật thông tin chi tiết của căn hộ.</p>
      </div>

      {initialData && (
        <PropertyForm initialData={initialData} onSubmit={handleSubmit} isLoading={submitLoading} />
      )}
    </div>
  );
}
