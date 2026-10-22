import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StudentActions } from "./StudentActions";

export const dynamic = 'force-dynamic';

export default async function StudentDetails({ params }: { params: { id: string } }) {
  const student = await prisma.student.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      program: true,
      group: true,
      registration: true,
      balanceTxs: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!student) notFound();

  const auditLogs = await prisma.auditLog.findMany({
    where: { entity: "Student", entityId: student.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { actor: true }
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">ملف الطالب: {student.user.fullName}</h1>
        <Link href="/admin/students" className="text-sm text-blue-600 hover:underline">← العودة للقائمة</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
          <h2 className="font-bold text-gray-800 border-b pb-2 mb-4">بيانات الاستمارة</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500">رقم الطالب:</span> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{student.studentNumber}</span></div>
            <div><span className="text-gray-500">الهاتف:</span> {student.user.phone}</div>
            <div><span className="text-gray-500">العمر:</span> {student.registration?.age} سنة</div>
            <div><span className="text-gray-500">البلد/المدينة:</span> {student.registration?.country} - {student.registration?.city}</div>
            <div><span className="text-gray-500">الفترة المفضلة:</span> {student.registration?.preferredTimeSlots}</div>
            <div><span className="text-gray-500">الأيام المفضلة:</span> {student.registration?.preferredDays}</div>
            <div><span className="text-gray-500">البرنامج:</span> {student.program?.title || 'غير محدد'}</div>
            <div><span className="text-gray-500">المجموعة الحالية:</span> <strong className="text-blue-700">{student.group?.name || 'غير محدد'}</strong></div>
            <div><span className="text-gray-500">حالة الحساب:</span> <strong className={student.user.isActive ? "text-green-600" : "text-red-600"}>{student.user.isActive ? "نشط" : "موقوف"}</strong></div>
          </div>
        </div>

        <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-md text-center flex flex-col justify-center">
          <h2 className="text-lg mb-2">الرصيد الحالي</h2>
          <p className="text-5xl font-bold text-yellow-400">{student.balanceMinutes}</p>
          <p className="text-sm mt-1 text-blue-200">دقيقة متبقية</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-800 mb-2">إجراءات إدارية</h2>
        <StudentActions studentId={student.id} currentBalance={student.balanceMinutes} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* سجل الحركات المالية */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 border-b pb-2 mb-4">آخر حركات الرصيد</h2>
          <div className="space-y-3">
            {student.balanceTxs.map(tx => (
              <div key={tx.id} className="text-sm flex justify-between border-b pb-1">
                <span>{tx.reason}</span>
                <strong className={tx.minutesDelta > 0 ? "text-green-600" : "text-red-600"}>
                  {tx.minutesDelta > 0 ? `+${tx.minutesDelta}` : tx.minutesDelta}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* سجل الملاحظات */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 border-b pb-2 mb-4">سجل الملاحظات والقرارات</h2>
          <div className="space-y-3">
            {auditLogs.map(log => (
              <div key={log.id} className="text-sm bg-gray-50 p-2 rounded">
                <span className="font-bold block text-blue-800">{log.action === 'ADD_NOTE' ? 'ملاحظة' : log.action === 'EXPEL_STUDENT' ? 'طرد' : 'تكريم'}</span>
                <span className="text-gray-700">{(log.metadata as any)?.note || (log.metadata as any)?.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}