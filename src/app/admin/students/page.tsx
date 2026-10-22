import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function StudentsListPage() {
  const students = await prisma.student.findMany({
    include: { user: true, program: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">قائمة الطلاب المسجلين</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
              <tr>
                <th className="p-4 font-medium">رقم الطالب</th>
                <th className="p-4 font-medium">الاسم (اضغط للتفاصيل)</th>
                <th className="p-4 font-medium">الهاتف</th>
                <th className="p-4 font-medium">الرصيد</th>
                <th className="p-4 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-xs">{student.studentNumber}</td>
                  <td className="p-4 font-bold">
                    <Link href={`/admin/students/${student.id}`} className="text-blue-600 hover:underline hover:text-blue-800 block w-full p-2 bg-blue-50 rounded">
                      {student.user.fullName} (عرض الملف ←)
                    </Link>
                  </td>
                  <td className="p-4">{student.user.phone}</td>
                  <td className="p-4 font-bold text-green-600">{student.balanceMinutes} دقيقة</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-xs ${student.user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {student.user.isActive ? 'نشط' : 'موقوف'}
                     </span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">لا يوجد طلاب حتى الآن.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}