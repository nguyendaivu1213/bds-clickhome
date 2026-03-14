import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary dark:bg-black text-slate-300 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-sm font-display font-bold text-xl">CH</div>
            <span className="font-display font-bold text-2xl text-white tracking-tight">ClickHomes</span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400">
            Nền tảng giao dịch bất động sản cao cấp hàng đầu Việt Nam. Nơi kiến tạo giá trị sống đích thực và cơ hội đầu tư bền vững.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 font-display text-lg">Dự án nổi bật</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="#" className="hover:text-primary transition-colors">Masteri Centre Point</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">The Global City</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Vinhomes Grand Park</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Glory Heights</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 font-display text-lg">Liên kết nhanh</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/about" className="hover:text-primary transition-colors">Về ClickHomes</Link></li>
            <li><Link href="/news" className="hover:text-primary transition-colors">Tin tức thị trường</Link></li>
            <li><Link href="/recruitment" className="hover:text-primary transition-colors">Tuyển dụng</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Liên hệ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 font-display text-lg">Liên hệ</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">📍</span>
              <span>123 Tôn Dật Tiên, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">📞</span>
              <span>1900 1234 56</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✉️</span>
              <span>contact@clickhomes.vn</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} ClickHomes. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Điều khoản</Link>
          <Link href="#" className="hover:text-white transition-colors">Bảo mật</Link>
        </div>
      </div>
    </footer>
  );
}
