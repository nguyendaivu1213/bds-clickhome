"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProjectSubNav() {
  const [isSticky, setIsSticky] = useState(false);

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

  return (
    <div className={`w-full bg-[#111] text-white transition-all z-40 ${isSticky ? 'fixed top-20 shadow-lg' : 'relative'}`}>
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <ul className="flex space-x-6 whitespace-nowrap text-[13px] font-bold uppercase tracking-wide py-4">
          <li>
            <Link href="/" className="hover:text-[#e2cb83] transition-colors flex items-center">
              <i className="fas fa-home mr-2"></i> Trang chủ
            </Link>
          </li>
          <li>
            <a href="#tong-quan" className="text-[#e2cb83]">Tổng quan</a>
          </li>
          <li>
            <a href="#vi-tri" className="hover:text-[#e2cb83] transition-colors">Vị trí</a>
          </li>
          <li>
            <a href="#phan-khu" className="hover:text-[#e2cb83] transition-colors">Phân khu</a>
          </li>
          <li>
            <a href="#layout" className="hover:text-[#e2cb83] transition-colors">Layout</a>
          </li>
          <li>
            <a href="#anh-360" className="hover:text-[#e2cb83] transition-colors">Ảnh 360</a>
          </li>
          <li>
            <a href="#tien-do" className="hover:text-[#e2cb83] transition-colors">Tiến độ</a>
          </li>
          <li>
            <a href="#chinh-sach" className="hover:text-[#e2cb83] transition-colors">Chính sách</a>
          </li>
          <li>
            <a href="#tin-tuc" className="hover:text-[#e2cb83] transition-colors">Thông tin</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
