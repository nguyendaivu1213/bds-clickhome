"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectSubNav({ slug }: { slug: string }) {
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Main header is usually 80px (h-20)
      if (window.scrollY > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Tổng quan", path: "tong-quan" },
    { name: "Vị trí", path: "vi-tri" },
    { name: "Phân khu", path: "phan-khu" },
    { name: "Layout", path: "layout" },
    { name: "Ảnh 360", path: "anh-360" },
    { name: "Tiến độ", path: "tien-do" },
    { name: "Chính sách", path: "chinh-sach" },
    { name: "Thông tin", path: "tin-tuc" },
  ];

  return (
    <div className={`w-full bg-[#111] text-white transition-all z-40 ${isSticky ? 'fixed top-20 shadow-lg' : 'relative'}`}>
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <ul className="flex space-x-6 whitespace-nowrap text-[13px] font-bold uppercase tracking-wide py-4">
          {navLinks.map((link) => {
            const href = `/du-an/${slug}/${link.path}`;
            const isActive = pathname === href;

            return (
              <li key={link.path}>
                <Link
                  href={href}
                  className={`transition-colors pb-1 ${isActive ? 'text-[#e2cb83] border-b-2 border-[#e2cb83]' : 'hover:text-[#e2cb83]'}`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
