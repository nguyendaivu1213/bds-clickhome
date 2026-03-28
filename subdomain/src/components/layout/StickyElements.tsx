"use client";

import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function StickyElements() {
  const { settings } = useSiteSettings();
  const hotline = settings.hotline || '1900 123456';
  const hotlineTel = hotline.replace(/\s/g, '');

  // Messenger: use dedicated facebook_page_id from settings
  const fbPageId = (settings as any).facebook_page_id as string | undefined;
  const messengerUrl = fbPageId
    ? `https://m.me/${fbPageId.trim()}`
    : 'https://www.messenger.com/';

  // Zalo: use dedicated zalo_phone from settings, fallback to hotline
  const zaloPhone = ((settings as any).zalo_phone as string | undefined)?.replace(/\s/g, '') || hotlineTel;
  const zaloUrl = `https://zalo.me/${zaloPhone}`;

  return (
    <>
      {/* Hotline – bottom left */}
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

      {/* Floating action buttons – bottom right */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-center gap-3">
        {/* Messenger */}
        <a
          href={messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Messenger"
          title="Chat qua Messenger"
          className="relative group"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#0099ff]/30 animate-ping group-hover:animate-none" />
          <span className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-white overflow-hidden hover:scale-110 transition-transform duration-200">
            {/* Official Messenger gradient icon */}
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
              <defs>
                <radialGradient id="msgGrad" cx="15%" cy="100%" r="120%">
                  <stop offset="0%" stopColor="#0099ff" />
                  <stop offset="60%" stopColor="#a033ff" />
                  <stop offset="90%" stopColor="#ff5c87" />
                </radialGradient>
              </defs>
              <rect width="48" height="48" rx="24" fill="url(#msgGrad)" />
              <path d="M24 8C15.163 8 8 14.71 8 23c0 4.455 1.87 8.47 4.9 11.37.26.245.41.585.42.945l.085 2.955a1 1 0 001.4.883l3.295-1.455A1 1 0 0118.82 37.6c1.67.46 3.44.71 5.27.71 8.836 0 16-6.71 16-15S32.836 8 24 8z" fill="white" />
              <path d="M13.5 27.5l4.665-7.4a2.5 2.5 0 013.51-.665l3.71 2.78a1 1 0 001.205-.005l5.01-3.8c.667-.505 1.54.29 1.11 1.02L28.045 26.83a2.5 2.5 0 01-3.51.665l-3.71-2.78a1 1 0 00-1.205.005l-5.01 3.8c-.667.505-1.54-.29-1.11-1.02z" fill="url(#msgGrad)" />
            </svg>
          </span>
        </a>

        {/* Zalo */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Zalo"
          title="Chat qua Zalo"
          className="relative group"
        >
          <span className="absolute inset-0 rounded-full bg-[#0068ff]/30 animate-ping group-hover:animate-none" />
          <span className="relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg overflow-hidden hover:scale-110 transition-transform duration-200">
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
              <rect width="48" height="48" rx="12" fill="#0068ff" />
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="18" fill="white" letterSpacing="-1">Zalo</text>
            </svg>
          </span>
        </a>

        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-[#333] text-white p-3 rounded-custom shadow-md hover:bg-gray-700 hover:scale-110 transition-all duration-200"
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
