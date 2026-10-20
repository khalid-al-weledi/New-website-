import Link from 'next/link';

const links = [
  { href: '/', label: 'الرئيسية' },
  { href: '/#about', label: 'التعريف' },
  { href: '/#programs', label: 'البرامج' },
  { href: '/#packages', label: 'الباقات' },
  { href: '/#faq', label: 'الأسئلة' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-royal-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-royal-700 text-gold-300 font-bold">
            ج
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-royal-800">مقرأة الإمام الجزري</div>
            <div className="text-[10px] text-royal-600">للإقراء والإجازة بالسند</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-royal-800">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gold-600">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:inline text-sm text-royal-700 hover:text-gold-600">دخول</Link>
          <Link href="/register" className="btn-gold text-sm">سجّل الآن</Link>
        </div>
      </div>
    </header>
  );
}