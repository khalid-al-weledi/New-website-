import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== 'STUDENT') redirect("/admin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      student: {
        include: {
          registration: true,
          balanceTxs: { orderBy: { createdAt: 'desc' }, take: 10 }
        }
      }
    }
  });

  const request = await prisma.registrationRequest.findFirst({ where: { phone: user?.phone } });

  if (!user) return <div className="p-10 text-center text-red-600 font-bold">خطأ في الحساب.</div>;

  if (request?.status === 'PENDING' && !user.student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-blue-900 mb-2">طلبك قيد المراجعة</h1>
          <p className="text-gray-600 mb-6">أهلاً بك يا {user.fullName}. طلبك قيد المراجعة. نسأل الله أن يوفقك.</p>
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-6">رقم طلبك: <strong>{request.requestNumber}</strong></div>
        </div>
      </div>
    );
  }

  const student = user.student;
  if (!student || !student.registration) return <div className="p-10 text-center text-red-600 font-bold">جاري تجهيز الملف...</div>;

  // توليد اسم الغرفة تلقائياً للطالب بناءً على الجنس والفترة
  const reg = student.registration;
  let roomId = "";
  const isMale = reg.gender === 'MALE';
  const isMorning = reg.preferredTimeSlots?.includes('صباحية');
  const isEvening = reg.preferredTimeSlots?.includes('مسائية');
  const isNight = reg.preferredTimeSlots?.includes('ليلية');

  if (isMale && isMorning) roomId = "room-male-morning";
  if (isMale && isEvening) roomId = "room-male-evening";
  if (isMale && isNight) roomId = "room-male-night";
  if (!isMale && isMorning) roomId = "room-female-morning";
  if (!isMale && isEvening) roomId = "room-female-evening";
  if (!isMale && isNight) roomId = "room-female-night";

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-blue-950 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="font-bold text-yellow-500 text-lg">حسابي - مقرأة الإمام الجزري</div>
          <Link href="/" className="text-sm hover:text-yellow-400">الرئيسية</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-6 space-y-6">
        
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold mb-2">هل تريد المزيد من الدقائق؟</h2>
            <p className="text-blue-100 mb-4 md:mb-0">قم بشراء باقة جديدة لمواصلة رحلتك.</p>
          </div>
          <Link href="/packages" className="bg-yellow-500 text-blue-950 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition whitespace-nowrap shadow-md">
            شراء باقة الآن
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-1">رصيدي الحالي</p>
            <p className="text-4xl font-bold text-blue-900">{student.balanceMinutes} <span className="text-sm font-normal">دقيقة</span></p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-1">رقم الطالب</p>
            <p className="text-xl font-bold text-blue-900 font-mono bg-blue-50 py-1 rounded">{student.studentNumber}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center col-span-2 md:col-span-1">
            <p className="text-gray-500 mb-1">حالة الطلب</p>
            <p className="text-lg font-bold text-green-600">مقبول</p>
          </div>
        </div>

        {/* غرفة البث الخاصة بالطالب */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-green-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">مباشر الآن</div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">غرفة التسميع (البث المباشر)</h3>
          <p className="text-gray-600 mb-6 text-sm">بناءً على تسجيلك، الفترة الخاصة بك هي: <strong className="text-blue-800">{reg.preferredTimeSlots}</strong>. يمكنك الانضمام للغرفة الآن للاستماع والتسميع للشيخ.</p>
          
          {roomId ? (
            <Link href={`/live?room=${roomId}`} className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-md w-full md:w-auto justify-center">
              <span>🎙️</span> دخول غرفة البث المباشر
            </Link>
          ) : (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold text-sm">
              لم نتمكن من تحديد الغرفة. يرجى التواصل مع الإدارة.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">بياناتي الشخصية</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-500 block">الاسم:</span> <strong className="text-gray-800">{user.fullName}</strong></div>
            <div><span className="text-gray-500 block">العمر:</span> <strong className="text-gray-800">{reg.age} سنة</strong></div>
            <div><span className="text-gray-500 block">الهاتف:</span> <strong className="text-gray-800">{user.phone}</strong></div>
            <div><span className="text-gray-500 block">البلد:</span> <strong className="text-gray-800">{reg.country}</strong></div>
            <div><span className="text-gray-500 block">المدينة:</span> <strong className="text-gray-800">{reg.city}</strong></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4 border-b pb-2">سجل الرصيد والجلسات</h3>
          {student.balanceTxs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد حركات مالية حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {student.balanceTxs.map((tx) => (
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