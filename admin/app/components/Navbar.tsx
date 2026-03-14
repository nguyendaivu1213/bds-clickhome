"use client";

import { useState, useEffect } from "react";

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="h-16 bg-white/80 border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center gap-4 flex-1">
        {/* Nút Hamburger cho Mobile */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-primary transition-colors rounded-lg hover:bg-slate-50 flex items-center justify-center"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="relative w-full max-w-md group hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl">search</span>
          <input className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700 placeholder:text-slate-400 transition-all font-medium" placeholder="Tìm kiếm dự án, tài liệu nhanh..." type="text" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4 relative group">
        {/* Nút Search Mobile chỉ hiện icon */}
        <button className="md:hidden size-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>

        <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 relative transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button className="hidden sm:flex size-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-1 lg:mx-2 hidden sm:block"></div>
        
        <DropdownAdd />
      </div>
    </header>
  );
}

function DropdownAdd() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const menuItems = [
    { label: 'Chuyên Mục', icon: 'category', href: '/categories/create' },
    { label: 'Chủ Đầu Tư', icon: 'business_center', href: '/investors/create' },
    { label: 'Dự án', icon: 'apartment', href: '/projects/create' },
    { label: 'Phân khu', icon: 'layers', href: '/zones/create' },
    { label: 'Bài viết chung', icon: 'article', href: '/posts/create' },
    { label: 'Bài viết dự án', icon: 'edit_note', href: '/project-articles/create' },
    { label: 'Bài viết phân khu', icon: 'edit_square', href: '/zone-articles/create' },
  ];

  return (
    <div className="relative dropdown-container">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${isOpen ? 'bg-primary-dark text-white ring-4 ring-primary/10' : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'}`}
      >
        <span className="material-symbols-outlined text-lg">add</span>
        <span className="hidden sm:inline">Thêm</span>
        <span className={`material-symbols-outlined text-base transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pb-2 mb-2 border-b border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tạo mới dữ liệu</p>
          </div>
          <div className="flex flex-col">
            {menuItems.map((item, idx) => (
              <a 
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-primary hover:bg-slate-50 transition-all group"
                onClick={() => setIsOpen(false)}
              >
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
