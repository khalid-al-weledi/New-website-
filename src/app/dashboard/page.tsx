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
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    redirect("/admin");
  }

  const student = await prisma.student.findFirst({
    where: { userId: session.user.id },
    include: { 
      registration: true,
      group: true,
      balanceTxs: { orderBy: { createdAt: 'desc' }, take: 10 },
      user: {
        include: {
          notifications: { orderBy: { createdAt: 'desc' } }
        }
      }
    }
  });

  if (!student) {
    return <div className="p-10 text-center text-red-600 font-bold">لم يتم العثور على ملف طالب. تواصل مع الإدارة.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-blue-950 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="font-bold text-yellow-500 text-lg">حسابي - مقرأة الإمام الجزري</div>
          <Link href="/" className="text-sm hover:text-yellow-400">الرئيسية</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-6 space-y-6">
        
        {/* رسائل الإدارة */}
        {student.user.notifications && student.user.notifications.length > 0 && (
          <div className="bg-indigo-50 border-2 border-indigo-200 p-6 rounded-2xl shadow-sm mb-6">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <span>📬</span> الرسائل والتنبيهات
            </h3>
            <div className="space-y-3">
              {student.user.notifications.map((notif: any) => (
                <div key={notif.id} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                  <h4 className="font-bold text-indigo-800">{notif.title}</h4>
                  <p className="text-gray-700 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleDateString('ar-ET')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* رسالة الترحيب */}
        {student.giftClaimedAt && (
          <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl text-center shadow-sm">
            <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 بشرى سارة! 🎉</h2>
            <p className="text-lg text-green-700">تم قبولك في مقرأة الإمام الجزري.</p>
            <p className="text-green-700 mt-2 font-bold text-xl">تمت إضافة 30 دقيقة هدية ترحيبية إلى رصيدك!</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-1">رصيدي الحالي</p>
            <p className="text-4xl font-bold text-blue-900">{student.balanceMinutes} <span className="text-sm font-normal">دقيقة</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-1">رقم الطالب (كود الدخول)</p>
            <p className="text-xl font-bold text-blue-900 font-mono bg-blue-50 py-1 rounded">{student.studentNumber}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center col-span-2 md:col-span-1">
            <p className="text-gray-500 mb-1">فترة دروسي</p>
            <p className="text-lg font-bold text-blue-900">{student.group?.name || 'لم يتم التحديد'}</p>
            <p className="text-sm text-gray-500">{student.group?.startTime} - {student.group?.endTime}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">تحديثات حسابي</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-500 block">الاسم:</span> <strong className="text-gray-800">{student.user.fullName}</strong></div>
            <div><span className="text-gray-500 block">رقم الهاتف:</span> <strong className="text-gray-800">{student.user.phone}</strong></div>
            <div><span className="text-gray-500 block">حالة الطلب:</span> <strong className="text-green-600">مقبول</strong></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">سجل الرصيد والجلسات</h3>
          {student.balanceTxs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد حركات مالية حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {student.balanceTxs.map((tx: any) => (
                <div key={tx.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
                  <div>
                    <p className="font-bold text-gray-800">{tx.reason}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString('ar-ET')}</p>
                  </div>
                  <div className={`font-bold ${tx.minutesDelta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.minutesDelta > 0 ? `+${tx.minutesDelta}` : tx.minutesDelta} دقيقة
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}