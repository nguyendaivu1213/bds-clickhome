"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useInvestor } from '@/context/InvestorContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function MainFooter() {
  const { investor } = useInvestor();
  const { settings } = useSiteSettings();
  const investorName = investor?.name || '';
  const footerBg = investor?.footer_image_url || null;

  const hotline = settings.hotline || '';
  const email = settings.support_email || '';
  const address = settings.address || '';

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', project: '', note: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to API
    setSubmitted(true);
  };

  return (
    <footer
      className="relative text-white"
      style={{
        backgroundImage: footerBg ? `url(${footerBg})` : undefined,
        backgroundColor: footerBg ? undefined : '#1a1a1a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70 pointer-events-none" />

      <div className="relative z-10">
        {/* ===== REGISTRATION FORM SECTION ===== */}
        <div className="border-b border-white/20 py-14">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-center text-xl font-bold uppercase tracking-widest mb-8 text-white">
              ĐĂNG KÝ TƯ VẤN CHUYÊN SÂU DỰ ÁN
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white text-lg font-medium">Cảm ơn bạn đã đăng ký!</p>
                <p className="text-white/70 text-sm mt-1">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Họ và tên *"
                    required
                    className="bg-white text-gray-800 placeholder-gray-400 px-4 py-3 text-[14px] outline-none w-full"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại *"
                    required
                    className="bg-white text-gray-800 placeholder-gray-400 px-4 py-3 text-[14px] outline-none w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="bg-white text-gray-800 placeholder-gray-400 px-4 py-3 text-[14px] outline-none w-full"
                  />
                  <input
                    type="text"
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                    placeholder="Dự án quan tâm"
                    className="bg-white text-gray-800 placeholder-gray-400 px-4 py-3 text-[14px] outline-none w-full"
                  />
                </div>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Nhu cầu quan tâm"
                  rows={4}
                  className="bg-white text-gray-800 placeholder-gray-400 px-4 py-3 text-[14px] outline-none w-full resize-none"
                />
                <div>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/80 transition-colors text-white font-bold uppercase text-[13px] tracking-wider px-10 py-3"
                  >
                    ĐĂNG KÝ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ===== FOOTER LINKS SECTION ===== */}
        <div className="relative pt-14 pb-8">
          {/* Extra dark layer to visually separate from the form section above */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Column 1: Intro */}
              <div>
                <h4 className="footer-heading font-bold text-white uppercase tracking-wider text-[15px]">
                  {investorName || 'VỀ CHÚNG TÔI'}
                </h4>
                <p className="text-[14px] leading-relaxed text-white/70 mt-4">
                  {investor?.short_description
                    ? investor.short_description.slice(0, 180) + (investor.short_description.length > 180 ? '...' : '')
                    : 'Nhà phát triển bất động sản chuyên nghiệp, mang đến những giá trị sống đẳng cấp cho khách hàng.'}
                </p>
              </div>

              {/* Column 2: Projects */}
              <div>
                <h4 className="footer-heading font-bold text-white uppercase tracking-wider text-[15px]">DỰ ÁN TIÊU BIỂU</h4>
                <ul className="space-y-3 text-[14px] mt-4">
                  <li><Link className="text-white/70 hover:text-white" href="#">Grand Marina, Saigon</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="#">The Global City</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="#">The Rivus</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="#">LUMIÈRE Boulevard</Link></li>
                  <li><Link className="text-white/70 hover:text-primary font-medium" href="#">Masteri Centre Point</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="#">Masteri Waterfront</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="#">Masteri West Heights</Link></li>
                </ul>
              </div>

              {/* Column 3: Quick Links */}
              <div>
                <h4 className="footer-heading font-bold text-white uppercase tracking-wider text-[15px]">LIÊN KẾT NHANH</h4>
                <ul className="space-y-3 text-[14px] mt-4">
                  <li><Link className="text-white/70 hover:text-white" href="/du-an">Tất cả Dự án</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="/news">Tin tức mới nhất</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="/">Về {investorName}</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="/contact">Tuyển dụng</Link></li>
                  <li><Link className="text-white/70 hover:text-white" href="/contact">Liên hệ</Link></li>
                </ul>
              </div>

              {/* Column 4: Contact Info */}
              <div>
                <h4 className="footer-heading font-bold text-white uppercase tracking-wider text-[15px]">THÔNG TIN LIÊN HỆ</h4>
                <div className="space-y-4 text-[14px] mt-4">
                  {address && (
                    <p>
                      <span className="block text-white font-medium mb-1">Địa chỉ:</span>
                      <span className="text-white/70">{address}</span>
                    </p>
                  )}
                  {hotline && (
                    <p>
                      <span className="block text-white font-medium mb-1">Hotline:</span>
                      <a className="text-primary font-bold" href={`tel:${hotline.replace(/\s/g, '')}`}>{hotline}</a>
                    </p>
                  )}
                  {email && (
                    <p>
                      <span className="block text-white font-medium mb-1">Email:</span>
                      <a className="text-white/70 hover:text-white" href={`mailto:${email}`}>{email}</a>
                    </p>
                  )}
                  {investor?.website_link && (
                    <p>
                      <span className="block text-white font-medium mb-1">Website:</span>
                      <a className="text-white/70 hover:text-white" href={investor.website_link} target="_blank" rel="noopener noreferrer">{investor.website_link}</a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between text-[12px] text-white/40">
              <p>&copy; {(new Date()).getFullYear()} {investorName}. All Rights Reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a className="hover:text-white" href="#"><i className="fab fa-facebook-f mr-1"></i>Facebook</a>
                <a className="hover:text-white" href="#"><i className="fab fa-youtube mr-1"></i>Youtube</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
