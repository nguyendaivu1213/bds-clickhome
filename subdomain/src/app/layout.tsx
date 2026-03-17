import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import MainHeader from '@/components/layout/MainHeader';
import MainFooter from '@/components/layout/MainFooter';
import StickyElements from '@/components/layout/StickyElements';
import { InvestorProvider } from '@/context/InvestorContext';
import { SiteSettingsProvider } from '@/context/SiteSettingsContext';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Subdomain - Bất động sản',
  description: 'Trang chủ - Hệ thống quản lý và trình bày dự án bất động sản.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={manrope.variable}>
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </head>
      <body className="font-sans text-gray-800 bg-white">
        <SiteSettingsProvider>
          <InvestorProvider>
            <MainHeader />
            {children}
            <MainFooter />
            <StickyElements />
          </InvestorProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}

