"use client";
import { useEffect, useState } from "react";
import { fetchAdminApi } from "../lib/api";
import Link from "next/link";

interface ProjectArticle {
  id: number;
  banner_image: string | null;
  status: string;
  created_at: string;
  type: string;
  layout_type: string;
  project: {
    translations: { name: string }[];
  };
  translations: {
    title: string;
  }[];
}

const TYPE_MAP: Record<string, string> = {
  overview: "Tổng quan",
  location: "Vị trí",
  utilities: "Tiện ích",
  design: "Thiết kế",
  policy: "Chính sách",
  progress: "Tiến độ",
};

const LAYOUT_MAP: Record<string, string> = {
  basic_image: "Mặc định",
  location: "Vị trí (Map)",
  horizontal_slide: "Slide ngang",
  news_list: "Danh sách tin",
  price_list: "Bảng giá",
  floor_plan_slide: "Slide mặt bằng",
  blue_background: "Blue BG",
  full_image: "Hình ảnh lớn",
};

export default function ProjectArticlesPage() {
  const [articles, setArticles] = useState<ProjectArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadArticles = async () => {
    setLoading(true);
    const data = await fetchAdminApi("/project-articles");
    if (data && data.data) {
      setArticles(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết dự án này?")) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/admin"}/project-articles/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        }
      });
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">Bài Viết Dự Án</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Đăng tải thông tin chi tiết, tin tức, cập nhật tiến độ cho từng dự án.</p>
        </div>
        <Link href="/project-articles/create" className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all w-full sm:w-auto text-center">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Thêm Bài Viết</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider whitespace-nowrap w-12 text-center">Ảnh</th>
                  <th className="px-4 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider whitespace-nowrap">Tiêu đề bài viết</th>
                  <th className="px-4 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider whitespace-nowrap">Dự án</th>
                  <th className="px-4 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider whitespace-nowrap">Chuyên mục</th>
                  <th className="px-4 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider whitespace-nowrap">Giao diện</th>
                  <th className="px-4 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider whitespace-nowrap">Trạng Thái</th>
                  <th className="px-4 py-4 text-slate-600 text-xs font-bold uppercase tracking-wider text-right whitespace-nowrap">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400">Đang tải dữ liệu...</td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400">Chưa có bài viết dự án nào.</td>
                  </tr>
                ) : articles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 text-center">
                      <div className="size-[30px] rounded bg-slate-100 overflow-hidden mx-auto border border-slate-200 shadow-sm">
                        {item.banner_image ? (
                          <img src={item.banner_image} className="w-full h-full object-cover" alt="thumb" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-50">
                            <span className="material-symbols-outlined text-slate-300 text-[14px]">image</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-[250px]">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold text-sm truncate">{item.translations[0]?.title || "Không có tiêu đề"}</span>
                        <span className="text-[10px] text-slate-400 font-medium">#{item.id} • {new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 border border-teal-100">
                        {item.project?.translations[0]?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-slate-600 text-[12px] font-bold">
                        {TYPE_MAP[item.type] || item.type || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-slate-600 text-[12px] font-medium italic">
                        {LAYOUT_MAP[item.layout_type] || item.layout_type || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black whitespace-nowrap ${item.status === 'published' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700 uppercase tracking-tighter' : 'bg-slate-100 border border-slate-200 text-slate-600 uppercase tracking-tighter'
                        }`}>
                        <span className={`size-1.5 rounded-full ${item.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {item.status === 'published' ? 'Đã Đăng' : 'Bản Nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link href={`/project-articles/update/${item.id}`} className="size-8 flex items-center justify-center text-slate-400 hover:text-primary transition-colors bg-white rounded shadow-sm border border-slate-200">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="size-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors bg-white rounded shadow-sm border border-slate-200">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
