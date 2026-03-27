"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { fetchProperties, deleteProperty, Property } from "../lib/api";
import { fetchAdminApi } from "../lib/api"; // For generic fetch of projects/zones

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [projectId, setProjectId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [productType, setProductType] = useState("");
  const [search, setSearch] = useState("");

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (projectId) params.project_id = projectId;
      if (zoneId) params.zone_id = zoneId;
      if (productType) params.product_type = productType;
      if (search) params.search = search;
      
      const res = await fetchProperties(params);
      setProperties(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [projectId, zoneId, productType, search]);

  useEffect(() => {
    // Load projects and zones for filters
    fetchAdminApi("/projects?per_page=100").then(res => {
      if (res?.data) setProjects(res.data);
    });
    fetchAdminApi("/zones?per_page=100").then(res => {
      if (res?.data) setZones(res.data);
    });
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        await deleteProperty(id);
        loadProperties();
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const statusColors: any = {
    'available': { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Đang mở bán" },
    'sold': { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-500", label: "Đã Bán" },
    'active': { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Đang hoạt động" },
    'inactive': { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Ngừng HĐ" },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 lg:gap-6 mb-4 lg:mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Sản Phẩm Khối Lẻ (BĐS)</h1>
          <p className="text-slate-500 mt-1 lg:mt-2 text-base lg:text-lg">Quản lý từng unit, quỹ căn, và giá cả thuộc các phân khu dự án.</p>
        </div>
        <Link href="/properties/create" className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 w-full sm:w-auto">
          <span className="material-symbols-outlined">add</span>
          <span>Thêm Sản Phẩm</span>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-3 lg:p-4 mb-6 lg:mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm outline-none transition-all" 
              placeholder="Tìm theo mã căn..." 
              type="text" 
            />
          </div>
          <select 
            value={projectId} 
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none"
          >
            <option value="">Tất cả Dự án</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select 
            value={zoneId} 
            onChange={(e) => setZoneId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none"
          >
            <option value="">Tất cả Phân khu</option>
            {zones.filter(z => !projectId || z.project_id == projectId).map(z => (
              <option key={z.id} value={z.id}>{z.translations?.[0]?.title || z.name}</option>
            ))}
          </select>
          <select 
            value={productType} 
            onChange={(e) => setProductType(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none"
          >
            <option value="">Tất cả Loại Căn</option>
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
           <div className="text-center py-10 text-slate-500">Đang tải dữ liệu...</div>
        ) : properties.length === 0 ? (
           <div className="text-center py-10 text-slate-500">Chưa có sản phẩm nào.</div>
        ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider w-16">Hình</th>
                  <th className="px-4 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Mã Căn Hộ</th>
                  <th className="px-4 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Tên Sản Phẩm</th>
                  <th className="px-4 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Phân Khu & Dự Án</th>
                  <th className="px-4 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Thông Số</th>
                  <th className="px-4 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Giá Bán</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-4 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((item) => {
                  const sColor = statusColors[item.status] || { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-500", label: item.status };
                  return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 sm:px-6 py-4">
                       {item.main_image ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                             <img src={item.main_image} alt="" className="w-full h-full object-cover" />
                          </div>
                       ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                             <span className="material-symbols-outlined text-[20px]">image</span>
                          </div>
                       )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-slate-900 font-bold">{item.product_code || '---'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-slate-800 font-medium line-clamp-2">{item.translations?.[0]?.name || '---'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-primary font-semibold text-sm">{item.zone?.translations?.[0]?.title || item.zone?.name || '---'}</span>
                        <span className="text-xs text-slate-500">{item.project?.name || '---'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col text-sm text-slate-700">
                        <span><span className="font-semibold text-slate-400 mr-1">Loại:</span>{item.product_type || '---'}</span>
                        <span><span className="font-semibold text-slate-400 mr-1">DT:</span>{item.area || '...'} m2 / Tầng: {item.floor || '...'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-red-600">{item.price ? new Intl.NumberFormat('vi-VN').format(item.price) : 'Liên hệ'}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full ${sColor.bg} px-3 py-1 text-xs font-bold ${sColor.text} whitespace-nowrap`}>
                        <span className={`size-1.5 rounded-full ${sColor.dot}`}></span>
                        {sColor.label}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                       <Link href={`/properties/update/${item.id}`} className="p-1.5 inline-block text-slate-400 hover:text-primary transition-colors bg-white rounded-md shadow-sm border border-slate-200 mr-2">
                         <span className="material-symbols-outlined text-[20px]">edit</span>
                       </Link>
                       <button onClick={() => handleDelete(item.id)} className="p-1.5 inline-block text-slate-400 hover:text-red-600 transition-colors bg-white rounded-md shadow-sm border border-slate-200">
                         <span className="material-symbols-outlined text-[20px]">delete</span>
                       </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
