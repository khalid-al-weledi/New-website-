import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { formatETB } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [programs, packages, faqs] = await Promise.all([
    prisma.program.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.package.findMany({ where: { isActive: true }, orderBy: { minutes: 'asc' } }),
    prisma.fAQ.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-royal-900 to-royal-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 text-royal-900 text-3xl font-bold">
            ج
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gold-300">
            مقرأة الإمام الجزري
          </h1>
          <p className="mt-3 text-lg md:text-xl text-royal-100">
            للإقراء والإجازة بالسند — عناية بالقرآن وروايته وأدائه
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn-gold">سجّل الآن</Link>
            <Link href="#programs" className="rounded-xl border border-gold-300 px-5 py-2.5 text-gold-300 font-semibold hover:bg-gold-500 hover:text-royal-900 transition">
              تعرّف على البرامج
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-royal-800">عن المقرأة</h2>
        <p className="mt-3 max-w-3xl text-royal-700 leading-relaxed">
          مقرأة متخصصة في الإقراء وتصحيح التلاوة، وتمنح الإجازة بالسند برواية حفص عن عاصم والقراءات السبع،
          وفق منهج تحقيقي يُعنى بالأداء والرواية. يستفيد الطالب من مسار واضح يبدأ بتصحيح الأداء
          وينتهي بالإجازة.
        </p>
      </section>

      {/* Programs */}
      <section id="programs" className="bg-royal-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-royal-800">البرامج التعليمية</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => (
              <div key={p.id} className="card">
                <h3 className="font-bold text-royal-800">{p.title}</h3>
                <p className="mt-2 text-sm text-royal-600 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-royal-800">الباقات والأسعار</h2>
        <p className="mt-2 text-sm text-royal-600">أسعار نهائية بالبر الإثيوبي (ETB).</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {packages.map((p) => (
            <div key={p.id} className="card flex flex-col items-center text-center">
              <div className="text-3xl font-bold text-royal-800">{p.minutes}</div>
              <div className="text-xs text-royal-500">دقيقة</div>
              <div className="mt-2 text-gold-600 font-semibold">{formatETB(p.priceETB)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-royal-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-royal-800">الأسئلة الشائعة</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((f) => (
              <details key={f.id} className="card cursor-pointer">
                <summary className="font-semibold text-royal-800">{f.question}</summary>
                <p className="mt-2 text-sm text-royal-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}