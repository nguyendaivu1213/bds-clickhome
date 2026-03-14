"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../login/actions";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Bảng Điều Khiển", icon: "dashboard" },
    {
      group: "Danh mục & Đối tác",
      links: [
        { href: "/categories", label: "Chuyên mục", icon: "category" },
        { href: "/investors", label: "Chủ đầu tư", icon: "real_estate_agent" },
        { href: "/faqs", label: "Hỏi đáp (FAQ)", icon: "quiz" },
      ]
    },
    {
      group: "Quản lý Dự án",
      links: [
        { href: "/projects", label: "Dự án", icon: "apartment" },
        { href: "/zones", label: "Phân khu", icon: "maps_home_work" },
        { href: "/properties", label: "Sản phẩm", icon: "home_work" },
      ]
    },
    {
      group: "Nội dung & Bài viết",
      links: [
        { href: "/posts", label: "Bài viết chung", icon: "article" },
        { href: "/project-articles", label: "Bài viết dự án", icon: "description" },
        { href: "/zone-articles", label: "Bài viết phân khu", icon: "feed" },
      ]
    },
  ];

  return (
    <>
      {/* Overlay cho Mobile khi Sidebar mở */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">architecture</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-slate-800">BuildPro</h1>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">CMS Bất Động Sản</p>
            </div>
          </div>
          {/* Nút đóng trên Mobile */}
          <button 
            className="lg:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setIsOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
          {navLinks.map((item, index) => {
            if ('group' in item && item.links) {
              return (
                <div key={index} className="pt-4 pb-1">
                  <p className="px-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">{item.group}</p>
                  {item.links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                    return (
                      <Link 
                        key={link.href}
                        href={link.href} 
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-all ${
                          isActive 
                          ? 'bg-primary text-white shadow-md shadow-primary/20' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                        <span className="font-medium text-sm">{link.label}</span>
                      </Link>
                    )
                  })}
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mt-1 transition-all ${
                  isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
          
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Hệ Thống</p>
          </div>
          <Link href="/media" className="flex items-center mb-1 gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary transition-all">
            <span className="material-symbols-outlined text-[20px]">imagesmode</span>
            <span className="font-medium text-sm">Đa phương tiện</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary transition-all">
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="font-medium text-sm">Cài đặt</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="size-10 rounded-full bg-cover bg-center ring-2 ring-white shadow-sm" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Nguoi+Quan+Ly&background=0d9488&color=fff')" }}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-800">Người Quản Lý</p>
              <p className="text-xs text-slate-500 truncate">Quản trị viên</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                title="Đăng xuất"
                className="flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
