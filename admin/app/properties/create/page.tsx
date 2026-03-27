"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProperty } from "@/app/lib/api";
import PropertyForm from "../components/PropertyForm";
import Link from "next/link";

export default function CreatePropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await createProperty(data);
      alert("Tạo sản phẩm thành công!");
      router.push("/properties");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Link href="/properties" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Danh sách sản phẩm
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Thêm mới</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Thêm Sản Phẩm Mới</h1>
        <p className="text-slate-500 mt-1">Điền thông tin chi tiết cho căn hộ/sản phẩm khối lẻ.</p>
      </div>

      <PropertyForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
}
