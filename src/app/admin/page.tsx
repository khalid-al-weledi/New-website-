import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // جلب الإحصائيات الحقيقية من قاعدة البيانات
  const [studentsCount, pendingRegistrations, approvedPayments] = await Promise.all([
    prisma.student.count(),
    prisma.registrationRequest.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "APPROVED" } }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-blue-950 text-white p-4">
        <div className="text-xl font-bold text-yellow-400 mb-8 text-center">لوحة التحكم</div>
        <nav className="space-y-2">
          <Link href="/admin" className="block p-2 bg-blue-900 rounded-lg">الرئيسية (الإحصائيات)</Link>
          <Link href="/admin/registrations" className="block p-2 hover:bg-blue-900 rounded-lg">طلبات التسجيل</Link>
          <Link href="/admin/students" className="block p-2 hover:bg-blue-900 rounded-lg">الطلاب</Link>
          <Link href="/admin/payments" className="block p-2 hover:bg-blue-900 rounded-lg">المدفوعات</Link>
          <Link href="/" className="block p-2 mt-8 text-yellow-400 hover:text-white">← العودة للموقع</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900">نظرة عامة</h1>
            <span className="text-sm bg-blue-100 text-blue-900 px-4 py-2 rounded-full font-medium">
              مرحباً، {session.user?.name}
            </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-white border-r-4 border-blue-900">
            <h3 className="text-gray-500 text-sm">إجمالي الطلاب</h3>
            <p className="text-3xl font-bold text-blue-900 mt-2">{studentsCount}</p>
          </div>
          <div className="card bg-white border-r-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm">طلبات التسجيل المعلقة</h3>
            <p className="text-3xl font-bold text-blue-900 mt-2">{pendingRegistrations}</p>
          </div>
          <div className="card bg-white border-r-4 border-green-500">
            <h3 className="text-gray-500 text-sm">المدفوعات المعتمدة</h3>
            <p className="text-3xl font-bold text-blue-900 mt-2">{approvedPayments}</p>
          </div>
        </div>
      </main>
    </div>
  );
}