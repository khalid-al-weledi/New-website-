import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function StudentsListPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') redirect("/login");

  const students = await prisma.student.findMany({
    include: { 
      user: true, 
      program: true,
      group: true,
      registration: true 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">قائمة الطلاب المسجلين</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="p-3 font-medium">الاسم (للتفاصيل)</th>
                <th className="p-3 font-medium">العمر</th>
                <th className="p-3 font-medium">البلد/المدينة</th>
                <th className="p-3 font-medium">الفترة</th>
                <th className="p-3 font-medium">المجموعة</th>
                <th className="p-3 font-medium">الرصيد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-bold">
                    <Link href={`/admin/students/${student.id}`} className="text-blue-600 hover:underline block p-1 bg-blue-50 rounded">
                      {student.user.fullName}
                    </Link>
                  </td>
                  <td className="p-3">{student.registration?.age || '-'} سنة</td>
                  <td className="p-3">{student.registration?.country} - {student.registration?.city}</td>
                  <td className="p-3 text-xs">{student.registration?.preferredTimeSlots || '-'}</td>
                  <td className="p-3 text-xs font-bold text-blue-800">{student.group?.name || 'غير محدد'}</td>
                  <td className="p-3 font-bold text-green-600">{student.balanceMinutes} دقيقة</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">لا يوجد طلاب حتى الآن.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}