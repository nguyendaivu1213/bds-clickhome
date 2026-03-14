import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-sm font-display font-bold text-xl group-hover:bg-primary-dark transition-colors">
            CH
          </div>
          <span className="font-display font-bold text-2xl text-secondary dark:text-white tracking-tight">
            ClickHomes
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold hover:text-primary transition-colors">Trang chủ</Link>
          <Link href="/projects" className="text-sm font-semibold hover:text-primary transition-colors">Dự án</Link>
          <Link href="/news" className="text-sm font-semibold hover:text-primary transition-colors">Tin tức</Link>
          <Link href="/about" className="text-sm font-semibold hover:text-primary transition-colors">Về chúng tôi</Link>
          <Link href="/contact" className="text-sm font-semibold hover:text-primary transition-colors">Liên hệ</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center justify-center px-6 py-2.5 bg-secondary dark:bg-white text-white dark:text-dark font-semibold text-sm rounded-sm hover:bg-primary dark:hover:bg-primary hover:text-white transition-all">
            Ký Gửi
          </button>
          <button className="md:hidden p-2 text-secondary dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
