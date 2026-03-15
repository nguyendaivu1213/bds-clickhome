'use client';

import MediaPicker from '../components/MediaPicker';

export default function MediaPage() {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-theme(spacing.20))]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Đa Phương Tiện</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý tệp tin chuyên nghiệp, sắp xếp theo thư mục và tự động tối ưu hóa hình ảnh.</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        <MediaPicker 
          isOpen={true} 
          onClose={() => {}} 
          onSelect={(url) => {
            // In manager mode, maybe just copy to clipboard or do nothing
            navigator.clipboard.writeText(url);
            alert('Đã sao chép liên kết tệp vào bộ nhớ tạm');
          }}
          isManager={true}
          title="Quản lý tệp tin"
        />
      </div>
    </div>
  );
}
