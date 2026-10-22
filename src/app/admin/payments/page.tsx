import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PaymentActions } from "./PaymentActions";

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { student: { include: { user: true } }, package: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-blue-950 text-white p-4">
        <div className="text-xl font-bold text-yellow-400 mb-8 text-center">لوحة التحكم</div>
        <nav className="space-y-2">
          <Link href="/admin" className="block p-2 hover:bg-blue-900 rounded-lg">الرئيسية</Link>
          <Link href="/admin/registrations" className="block p-2 hover:bg-blue-900 rounded-lg">طلبات التسجيل</Link>
          <Link href="/admin/payments" className="block p-2 bg-blue-900 rounded-lg">المدفوعات</Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-8">سجل المدفوعات</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="p-4 font-medium">رقم العملية</th>
                  <th className="p-4 font-medium">الطالب</th>
                  <th className="p-4 font-medium">المبلغ</th>
                  <th className="p-4 font-medium">بيانات المرسل (للمطابقة)</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">لا توجد مدفوعات.</td></tr>
                ) : (
                  payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-mono text-xs">{pay.paymentNumber}</td>
                      <td className="p-4 font-bold text-blue-900">{pay.student.user.fullName}</td>
                      <td className="p-4 font-bold text-yellow-600">{pay.amountETB} بر</td>
                      <td className="p-4 text-xs space-y-1">
                        <p><strong>الاسم:</strong> {pay.senderName || '-'}</p>
                        <p><strong>رقم العملية:</strong> <span className="font-mono bg-gray-100 px-1">{pay.transactionId || '-'}</span></p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${pay.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : pay.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {pay.status === 'PENDING' ? 'قيد المراجعة' : pay.status === 'APPROVED' ? 'معتمد' : 'مرفوض'}
                        </span>
                      </td>
                      <td className="p-4">
                        {pay.status === 'PENDING' && <PaymentActions paymentId={pay.id} />}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}