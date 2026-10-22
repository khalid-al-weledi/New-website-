import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const programs = await prisma.program.findMany({ where: { isActive: true }, take: 4 });

  return (
    <main className="flex-1">
      {/* 1. القائمة العلوية */}
      <header className="sticky top-0 z-50 border-b border-blue-900/20 bg-[#0a1530]/95 backdrop-blur text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/image/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
            <div className="leading-tight">
              <div className="text-sm md:text-base font-bold text-yellow-500">مقرأة الإمام الجزري</div>
              <div className="text-[10px] md:text-xs text-gray-300">للإقراء والإجازة بالسند</div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
            <Link href="/" className="text-yellow-500">الرئيسية</Link>
            <Link href="/#programs" className="hover:text-yellow-500 transition">البرامج</Link>
            <Link href="/packages" className="hover:text-yellow-500 transition">الباقات</Link>
            <Link href="/#about" className="hover:text-yellow-500 transition">عن المقرأة</Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/login" className="text-xs md:text-sm font-bold text-gray-200 hover:text-yellow-500 transition">
              دخول الطلاب
            </Link>
            <Link href="/dashboard" className="hidden sm:block text-xs md:text-sm font-bold text-gray-200 hover:text-yellow-500 transition">
              حسابي
            </Link>
            <Link href="/register" className="bg-yellow-500 text-blue-950 px-3 py-2 md:px-4 rounded-lg font-bold text-xs md:text-sm hover:bg-yellow-400 transition">
              تسجيل جديد
            </Link>
          </div>
        </div>
      </header>

      {/* 2. القسم الرئيسي (Hero) */}
      <section className="relative bg-[#0a1530] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="/image/center-building.jpg" alt="Building" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1530] via-[#0a1530]/80 to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32 text-center z-10">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
            <img src="/image/logo.png" alt="Logo" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">مقرأة الإمام الجزري</h1>
          <p className="text-xl md:text-2xl text-yellow-500 font-medium mb-4">للإقراء والإجازة بالسند</p>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed text-sm md:text-base">
            تعليم القرآن الكريم، وتصحيح التلاوة، والتجويد في بيئة تعليمية تجمع بين أصالة الإقراء والتقنيات الحديثة.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="bg-yellow-500 text-blue-950 px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition flex items-center gap-2">
              التسجيل في المقرأة
            </Link>
            <Link href="/packages" className="bg-transparent border border-yellow-500 text-yellow-500 px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-500 hover:text-blue-950 transition">
              الدورات والباقات
            </Link>
          </div>
        </div>
      </section>

      {/* 3. شريط الإحصائيات والميزات */}
      <section className="bg-[#0a1530] border-t border-blue-900/50 py-8 relative z-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-yellow-500">+1000</span>
              <span className="text-sm text-gray-400 mt-1">طالب وطالبة</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-yellow-500">+5000</span>
              <span className="text-sm text-gray-400 mt-1">جلسة إقراء</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-yellow-500">+300</span>
              <span className="text-sm text-gray-400 mt-1">إجازة بالسند</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-yellow-500">+50</span>
              <span className="text-sm text-gray-400 mt-1">دولة حول العالم</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. عن المقرأة (مع صورة الملازم) */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-yellow-500 rounded-full inline-block"></span>
              عن المقرأة
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              مقرأة الإمام الجزري للإقراء والإجازة بالسند هي برنامج رقمي متكامل يهدف إلى تعليم القرآن الكريم، وتصحيح التلاوة، والتجويد، والإقراء، وإدارة الطلاب والجلسات عبر منصة احترافية.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-700"><span className="text-yellow-500">✔</span> إجازة بالسند المتصل</li>
              <li className="flex items-center gap-3 text-gray-700"><span className="text-yellow-500">✔</span> مع مقرئين مؤهلين</li>
              <li className="flex items-center gap-3 text-gray-700"><span className="text-yellow-500">✔</span> بيئة تعليمية آمنة</li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 rounded-3xl transform translate-x-4 translate-y-4"></div>
            <img src="/image/booklet.jpg" alt="الملازم" className="relative rounded-3xl shadow-lg object-cover w-full h-[400px]" />
          </div>
        </div>
      </section>

      {/* 5. صورة الشيخ (نبذة عن المقرئ) */}
      <section className="bg-[#0a1530] py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-3 gap-10 items-center">
          <div className="flex justify-center">
            <img src="/image/sheik.jpg" alt="الشيخ" className="w-64 h-64 object-cover rounded-full border-4 border-yellow-500 shadow-xl" />
          </div>
          <div className="md:col-span-2 text-center md:text-right">
            <h2 className="text-3xl font-bold text-yellow-500 mb-2">فضيلة الشيخ</h2>
            <h3 className="text-xl font-medium mb-4">خالد أحمد مصطفى</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              مقرئ ومجيز للقرآن الكريم برواية حفص عن عاصم والقراءات السبع. يمتلك خبرة واسعة في تدريس علوم القرآن والتجويد، ويهدف إلى إيصال الطالب إلى أعلى درجات الإتقان والإجازة بالسند المتصل.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-yellow-500 text-xl">🏆</span>
              <span>مجاز بالسند المتصل</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. البرامج التعليمية */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">برامج المقرأة</h2>
            <p className="text-gray-600">مسارات تعليمية متكاملة تناسب جميع المستويات</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((prog) => (
              <div key={prog.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition duration-300">
                <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📖</span>
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">{prog.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3">{prog.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
             <Link href="/programs" className="text-blue-900 font-bold border-b-2 border-yellow-500 pb-1 hover:text-yellow-600 transition">عرض جميع البرامج</Link>
          </div>
        </div>
      </section>

      {/* 7. التذييل */}
      <footer className="bg-[#0a1530] text-gray-300 py-12 border-t border-blue-900">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/image/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              <span className="text-white font-bold">مقرأة الإمام الجزري</span>
            </div>
            <p className="text-sm">للإقراء والإجازة بالسند — عناية بالقرآن وروايته وأدائه.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-yellow-500 transition">الرئيسية</Link></li>
              <li><Link href="/packages" className="hover:text-yellow-500 transition">الباقات</Link></li>
              <li><Link href="/register" className="hover:text-yellow-500 transition">التسجيل</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm">
              <li>📞 +251 990 161 372</li>
              <li>✉️ khdad241@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-10 pt-4 border-t border-blue-900/50">
          © {new Date().getFullYear()} مقرأة الإمام الجزري — جميع الحقوق محفوظة.
        </div>
      </footer>
    </main>
  );
}