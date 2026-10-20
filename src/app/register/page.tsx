import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegistrationForm from '@/components/RegistrationForm';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, title: true },
  });
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold text-royal-800">استمارة التسجيل</h1>
        <p className="mt-2 text-royal-600 text-sm">
          املأ البيانات بدقة، وسيراجع المشرف طلبك ويتواصل معك.
        </p>
        <div className="mt-6">
          <RegistrationForm programs={programs} />
        </div>
      </main>
      <Footer />
    </>
  );
}