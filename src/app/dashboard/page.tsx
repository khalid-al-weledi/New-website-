import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = (session.user as any).role;
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') redirect("/admin");

  const student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: { 
      user: true, 
      registration: true,
      group: true,
      balanceTxs: { orderBy: { createdAt: 'desc' }, take: 10 },
      payments: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!student) return <div className="p-10 text-center text-red-600 font-bold">لم يتم العثور على ملف طالب.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-blue-950 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="font-bold text-yellow-500 text-lg">حسابي - مقرأة الإمام الجزري</div>
          <Link href="/" className="text-sm hover:text-yellow-400">الرئيسية</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-6 space-y-6">
        
        {/* زر شراء باقة */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold mb-2">هل تريد المزيد من الدقائق؟</h2>
            <p className="text-blue-100 mb-4 md:mb-0">قم بشراء باقة جديدة لمواصلة رحلتك في الإقراء والإجازة.</p>
          </div>
          <Link href="/packages" className="bg-yellow-500 text-blue-950 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition whitespace-nowrap shadow-md">
            شراء باقة الآن
          </Link>
        </div>

        {/* البيانات الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-1">رصيدي الحالي</p>
            <p className="text-4xl font-bold text-blue-900">{student.balanceMinutes} <span className="text-sm font-normal">دقيقة</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-1">رقم الطالب</p>
            <p className="text-xl font-bold text-blue-900 font-mono bg-blue-50 py-1 rounded">{student.studentNumber}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-1">حالة الطلب</p>
            <p className="text-lg font-bold text-green-600">مقبول</p>
          </div>
        </div>

        {/* الفترة والأيام ومجموعتي */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">مجموعتي وفترة دروسي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <span className="text-blue-600 block text-sm mb-1">الفترة المختارة</span>
              <strong className="text-lg text-blue-900">{student.registration?.preferredTimeSlots || 'غير محدد'}</strong>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <span className="text-blue-600 block text-sm mb-1">أيام الحضور</span>
              <strong className="text-lg text-blue-900">{student.registration?.preferredDays || 'غير محدد'}</strong>
            </div>
            {student.group && (
              <div className="md:col-span-2 bg-green-50 p-4 rounded-xl border border-green-100 mt-2">
                <span className="text-green-700 block text-sm mb-1">تم تعيينك في المجموعة:</span>
                <strong className="text-lg text-green-900">{student.group.name} ({student.group.startTime} - {student.group.endTime})</strong>
              </div>
            )}
          </div>
        </div>

        {/* البيانات الشخصية */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">بياناتي الشخصية</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-500 block">الاسم:</span> <strong className="text-gray-800">{student.user.fullName}</strong></div>
            <div><span className="text-gray-500 block">العمر:</span> <strong className="text-gray-800">{student.registration?.age} سنة</strong></div>
            <div><span className="text-gray-500 block">الهاتف:</span> <strong className="text-gray-800">{student.user.phone}</strong></div>
            <div><span className="text-gray-500 block">البلد:</span> <strong className="text-gray-800">{student.registration?.country}</strong></div>
            <div><span className="text-gray-500 block">المدينة:</span> <strong className="text-gray-800">{student.registration?.city}</strong></div>
            <div><span className="text-gray-500 block">الجنس:</span> <strong className="text-gray-800">{student.registration?.gender === 'MALE' ? 'ذكر' : 'أنثى'}</strong></div>
          </div>
        </div>

        {/* سجل الرصيد */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">سجل الرصيد</h3>
          {student.balanceTxs.length === 0 ? <p className="text-gray-500 text-center py-4">لا توجد حركات مالية.</p> : (
            <div className="space-y-3">
              {student.balanceTxs.map((tx: any) => (
                <div key={tx.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                  <div><p className="font-bold text-gray-800">{tx.reason}</p><p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString('ar-ET')}</p></div>
                  <div className={`font-bold ${tx.minutesDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>{tx.minutesDelta > 0 ? `+${tx.minutesDelta}` : tx.minutesDelta} دقيقة</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}