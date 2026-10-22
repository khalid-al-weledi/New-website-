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
    include: { student: true }
  });

  const request = await prisma.registrationRequest.findFirst({
    where: { phone: user?.phone }
  });

  if (!user) return <div className="p-10 text-center text-red-600">خطأ في الحساب.</div>;

  // 1. شاشة الانتظار
  if (request?.status === 'PENDING' && !user.student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-blue-900 mb-2">طلبك قيد المراجعة</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            أهلاً بك يا {user.fullName}. تم استلام طلبك بنجاح، وهو الآن قيد المراجعة من قبل إدارة المقرأة. نسأل الله أن يوفقك ويبارك في خطاك.
          </p>
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-6">
            رقم طلبك: <strong>{request.requestNumber}</strong>
          </div>
        </div>
      </div>
    );
  }

  // 2. شاشة الرفض
  if (request?.status === 'REJECTED' && !user.student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">نعتذر منك</h1>
          <p className="text-gray-600 mb-4">لم يتم قبول طلبك في الوقت الحالي.</p>
          <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm mb-6">
            <strong>سبب الرفض:</strong> {request.reviewNotes || 'غير محدد'}
          </div>
        </div>
      </div>
    );
  }

  // 3. لوحة التحكم (المقبولين)
  const student = user.student;
  if (!student) return <div className="p-10 text-center text-red-600">جاري تجهيز الملف...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-blue-950 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="font-bold text-yellow-500">حسابي - مقرأة الإمام الجزري</div>
          <Link href="/" className="text-sm hover:text-yellow-400">الرئيسية</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 mt-6 space-y-6">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold mb-2">مرحباً بك في رحلتك القرآنية</h2>
            <p className="text-blue-100 mb-4 md:mb-0">رصيدك الحالي: <strong className="text-yellow-400 text-xl">{student.balanceMinutes}</strong> دقيقة.</p>
          </div>
          <Link href="/packages" className="bg-yellow-500 text-blue-950 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition whitespace-nowrap shadow-md">
            شراء باقة الآن
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
           <p className="text-green-600 font-bold text-lg">تم قبولك بنجاح. أهلاً بك في المقرأة!</p>
        </div>
      </main>
    </div>
  );
}