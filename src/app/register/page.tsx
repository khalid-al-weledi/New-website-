import { prisma } from "@/lib/prisma";
import RegistrationForm from "@/components/RegistrationForm";

export default async function RegisterPage() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    select: { id: true, title: true },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">استمارة التسجيل</h1>
          <p className="text-gray-600">املأ البيانات بدقة، وسيراجع المشرف طلبك ويتواصل معك.</p>
        </div>
        <RegistrationForm programs={programs} />
      </div>
    </main>
  );
}