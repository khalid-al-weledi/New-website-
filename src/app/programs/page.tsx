import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">البرامج التعليمية</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            مسارات متخصصة تحت إشراف نخبة من المقرئين، تبدأ بتصحيح الأداء وتنتهي بالإجازة بالسند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((prog) => (
            <div key={prog.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6 text-xl font-bold">
                ق
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3">{prog.title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{prog.description}</p>
              
              <Link 
                href="/register" 
                className="inline-block bg-blue-50 text-blue-900 px-6 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
              >
                سجل في هذا البرنامج
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