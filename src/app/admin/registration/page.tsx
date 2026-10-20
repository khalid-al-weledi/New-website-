import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function RegistrationsPage() {
  // جلب كل طلبات التسجيل
  const requests = await prisma.registrationRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-blue-950 text-white p-4">
        <div className="text-xl font-bold text-yellow-400 mb-8 text-center">لوحة التحكم</div>
        <nav className="space-y-2">
          <Link href="/admin" className="block p-2 hover:bg-blue-900 rounded-lg">الرئيسية (الإحصائيات)</Link>
          <Link href="/admin/registrations" className="block p-2 bg-blue-900 rounded-lg">طلبات التسجيل</Link>
          <Link href="/admin/students" className="block p-2 hover:bg-blue-900 rounded-lg">الطلاب</Link>
          <Link href="/admin/payments" className="block p-2 hover:bg-blue-900 rounded-lg">المدفوعات</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">طلبات التسجيل</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <tr>
                  <th className="p-4 font-medium">رقم الطلب</th>
                  <th className="p-4 font-medium">الاسم</th>
                  <th className="p-4 font-medium">الهاتف</th>
                  <th className="p-4 font-medium">الحالة</th>
                  <th className="p-4 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">لا توجد طلبات حتى الآن.</td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-mono text-xs">{req.requestNumber}</td>
                      <td className="p-4 font-medium text-blue-900">{req.fullName}</td>
                      <td className="p-4">{req.phone}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status === 'PENDING' ? 'قيد المراجعة' : req.status === 'APPROVED' ? 'مقبول' : 'مرفوض'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(req.createdAt).toLocaleDateString('ar-ET')}</td>
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