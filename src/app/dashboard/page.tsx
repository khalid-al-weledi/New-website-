import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: { user: true, registration: true }
  });

  if (!student) {
    return <div className="p-10 text-center text-red-600">لم يتم العثور على ملف طالب. تواصل مع الإدارة.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">أهلاً بك يا {student.user.fullName}</h1>
        
        {student.registration?.status === 'APPROVED' && student.giftClaimedAt && (
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl mb-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 بشرى سارة! 🎉</h2>
            <p className="text-lg text-green-700">تم قبولك في مقرأة الإمام الجزري.</p>
            <p className="text-green-700 mt-2 font-bold text-xl">تمت إضافة 30 دقيقة هدية ترحيبية إلى رصيدك!</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-6 rounded-xl text-center">
            <p className="text-gray-600 mb-1">رصيدك الحالي</p>
            <p className="text-3xl font-bold text-blue-900">{student.balanceMinutes} <span className="text-sm">دقيقة</span></p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl text-center">
            <p className="text-gray-600 mb-1">رقم الطالب</p>
            <p className="text-xl font-bold text-blue-900 font-mono">{student.studentNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
}