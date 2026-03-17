"use client";

import Link from 'next/link';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { useInvestor } from '@/context/InvestorContext';

export default function MainHeader() {
  const { settings, loading } = useSiteSettings();
  const { investor } = useInvestor();

  const logoUrl = settings.logo || null;
  const siteName = settings.site_name || 'BDS ClickHome';

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            {loading ? (
              <div className="h-12 w-32 bg-gray-100 animate-pulse rounded" />
            ) : logoUrl ? (
              <img
                alt={`${siteName} Logo`}
                className="h-12 w-auto"
                src={logoUrl}
              />
            ) : (
              <span className="text-xl font-bold text-primary">{siteName}</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-[13px] font-bold uppercase tracking-wider text-gray-700">
          <Link href="/" className="hover:text-primary">
            Trang Chủ
          </Link>
          {investor && (
            <Link href="/about" className="hover:text-primary">
              {investor.name}
            </Link>
          )}
          <Link href="/du-an" className="hover:text-primary">
            Dự Án
          </Link>
          <Link href="/news" className="hover:text-primary">
            Thông Tin
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Liên Hệ
          </Link>
          <button className="text-gray-500 hover:text-primary">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
