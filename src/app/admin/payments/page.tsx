import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PaymentActions } from "./PaymentActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') redirect("/login");

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { student: { include: { user: true } }, package: true },
  });

  const pendingPayments = payments.filter(p => p.status === 'PENDING');
  const historyPayments = payments.filter(p => p.status !== 'PENDING');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-blue-950 text-white p-4">
        <div className="text-xl font-bold text-yellow-400 mb-8 text-center">لوحة التحكم</div>
        <nav className="space-y-2">
          <Link href="/admin" className="block p-2 hover:bg-blue-900 rounded-lg">الرئيسية</Link>
          <Link href="/admin/registrations" className="block p-2 hover:bg-blue-900 rounded-lg">طلبات التسجيل</Link>
          <Link href="/admin/students" className="block p-2 hover:bg-blue-900 rounded-lg">قائمة الطلاب</Link>
          <Link href="/admin/payments" className="block p-2 bg-blue-900 rounded-lg">طلبات شحن الرصيد</Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8">إدارة المدفوعات</h1>
        
        {/* طلبات معلقة */}
        <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
          <span>⏳</span> طلبات شحن قيد المراجعة ({pendingPayments.length})
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-orange-50 border-b border-orange-100 text-orange-800">
                <tr>
                  <th className="p-4 font-medium">رقم العملية</th>
                  <th className="p-4 font-medium">الطالب / الهاتف</th>
                  <th className="p-4 font-medium">المبلغ / الباقة</th>
                  <th className="p-4 font-medium">بيانات التحويل (للمطابقة)</th>
                  <th className="p-4 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pendingPayments.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">لا توجد طلبات معلقة حالياً.</td></tr>
                ) : (
                  pendingPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-mono text-xs font-bold">{pay.paymentNumber}</td>
                      <td className="p-4">
                        <p className="font-bold text-blue-900">{pay.student.user.fullName}</p>
                        <p className="text-xs text-gray-500 font-mono">{pay.student.user.phone}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-yellow-600">{pay.amountETB} بر</p>
                        <p className="text-xs text-gray-500">{pay.minutes} دقيقة</p>
                      </td>
                      <td className="p-4 text-xs bg-yellow-50/50 rounded">
                        <p><strong>المرسل:</strong> {pay.senderName || '-'}</p>
                        <p><strong>وسيلة الدفع:</strong> {pay.method}</p>
                        <p><strong>رقم العملية:</strong> <span className="font-mono bg-white px-1 border rounded">{pay.transactionId || '-'}</span></p>
                      </td>
                      <td className="p-4">
                        <PaymentActions paymentId={pay.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* سجل المدفوعات السابقة */}
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span>📋</span> سجل المدفوعات السابقة
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="p-4 font-medium">رقم العملية</th>
                  <th className="p-4 font-medium">الطالب</th>
                  <th className="p-4 font-medium">المبلغ</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">ملاحظات/السبب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {historyPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-xs">{pay.paymentNumber}</td>
                    <td className="p-4 font-medium text-blue-900">{pay.student.user.fullName}</td>
                    <td className="p-4 font-bold text-gray-700">{pay.amountETB} بر</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${pay.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {pay.status === 'APPROVED' ? 'معتمد' : 'مرفوض'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">{pay.rejectionReason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}