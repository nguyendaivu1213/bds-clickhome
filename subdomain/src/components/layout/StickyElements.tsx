"use client";

import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function StickyElements() {
  const { settings } = useSiteSettings();
  const hotline = settings.hotline || '1900 123456';
  const hotlineTel = hotline.replace(/\s/g, '');

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[60]">
        <a
          className="bg-[#e2cb83] text-[#4d422a] py-2 px-4 rounded-full flex items-center shadow-lg font-bold text-sm hover:bg-[#d4be72] transition-colors"
          href={`tel:${hotlineTel}`}
        >
          <span className="bg-white p-1 rounded-full mr-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.176 1.1c.066-.066.145-.115.228-.145a.674.674 0 01.45 0c.083.03.162.079.228.145l2.474 2.474c.066.066.115.145.145.228a.674.674 0 010 .45.674.674 0 01-.145.228L7.83 6.207a10.605 10.605 0 005.963 5.963l1.727-1.726c.066-.066.145-.115.228-.145a.674.674 0 01.45 0c.083.03.162.079.228.145l2.474 2.474c.066.066.115.145.145.228a.674.674 0 010 .45.674.674 0 01-.145.228l-2.023 2.022a3.333 3.333 0 01-4.714 0l-1.011-1.011a12.605 12.605 0 01-8.91-8.91l-1.011-1.011a3.333 3.333 0 010-4.714L6.176 1.1z"></path>
            </svg>
          </span>
          HOTLINE {hotline}
        </a>
      </div>
      <div className="fixed bottom-6 right-6 z-[60]">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-[#333] text-white p-3 rounded-custom shadow-md hover:bg-gray-700"
          aria-label="Cuộn lên đầu trang"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        </button>
      </div>
    </>
  );
}
