"use client";
import { useEffect, useState } from "react";
import { fetchAdminApi } from "../lib/api";
import Link from "next/link";

interface ZoneArticle {
  id: number;
  banner_image: string | null;
  status: string;
  created_at: string;
  zone: {
    translations: { name: string }[];
  };
  translations: {
    title: string;
  }[];
}

export default function ZoneArticlesPage() {
  const [articles, setArticles] = useState<ZoneArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadArticles = async () => {
    setLoading(true);
    const data = await fetchAdminApi("/zone-articles");
    if (data && data.data) {
      setArticles(data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết phân khu này?")) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/admin"}/zone-articles/${id}`, {
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
          <h1 className="text-slate-900 text-3xl font-extrabold leading-tight tracking-tight">Bài Viết Phân Khu (Zone)</h1>
          <p className="text-slate-500 text-sm sm:text-base font-normal">Đăng tải thông tin chi tiết, tin bài dành cho từng phân khu trong dự án.</p>
        </div>
        <Link href="/zone-articles/create" className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all w-full sm:w-auto text-center">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Thêm Bài Phân Khu</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Tiêu đề bài viết</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider hidden sm:table-cell whitespace-nowrap">Phân Khu</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider hidden md:table-cell whitespace-nowrap">Đăng Ngày</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap">Trạng Thái</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider text-right whitespace-nowrap">Sửa/Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">Đang tải dữ liệu...</td>
                  </tr>
                ) : articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400">Chưa có bài viết phân khu nào.</td>
                  </tr>
                ) : articles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold text-sm truncate">{item.translations[0]?.title || "Không có tiêu đề"}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 hidden sm:table-cell">
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700 border border-teal-100">
                        {item.zone?.translations[0]?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-slate-500 text-sm hidden md:table-cell whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
                        item.status === 'published' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-slate-100 border border-slate-200 text-slate-600'
                      }`}>
                        <span className={`size-1.5 rounded-full ${item.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {item.status === 'published' ? 'Đã Đăng' : 'Bản Nháp'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Link href={`/zone-articles/update/${item.id}`} className="p-1 sm:p-1.5 text-slate-400 hover:text-primary transition-colors bg-white rounded-md shadow-sm border border-slate-200 block">
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">edit</span>
                        </Link>
                        <button onClick={() => handleDelete(item.id)} className="p-1 sm:p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-md shadow-sm border border-slate-200">
                          <span className="material-symbols-outlined text-[18px] sm:text-[20px]">delete</span>
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
