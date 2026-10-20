import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PackagesPage() {
  // جلب الباقات من قاعدة البيانات
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { minutes: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">الباقات والأسعار</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اختر الباقة المناسبة لك، وابدأ رحلتك في الإقراء والإجازة بالسند. الأسعار نهائية بالبر الإثيوبي (ETB).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition text-center flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">{pkg.minutes}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">دقيقة قراءة</h3>
                <p className="text-3xl font-bold text-yellow-600 mb-6">{pkg.priceETB} <span className="text-sm text-gray-500 font-normal">بر</span></p>
              </div>
              
              <Link 
                href={`/payments/new?packageId=${pkg.id}`}
                className="block w-full bg-blue-900 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition"
              >
                اختر الباقة
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-900 hover:text-yellow-600 font-medium">← العودة للرئيسية</Link>
        </div>
      </div>
    </main>
  );
}