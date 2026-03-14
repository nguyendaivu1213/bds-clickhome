"use client";
import React, { useState } from 'react';
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { usePathname } from 'next/navigation';

export default function AdminLayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (pathname === '/login') {
    return <main className="flex-1 flex flex-col min-h-screen bg-slate-50">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 flex flex-col min-w-0 bg-background transition-all">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="p-4 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
