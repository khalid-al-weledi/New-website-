import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function GroupsPage() {
  const groups = await prisma.group.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-blue-950 text-white p-4">
        <div className="text-xl font-bold text-yellow-400 mb-8 text-center">لوحة التحكم</div>
        <nav className="space-y-2">
          <Link href="/admin" className="block p-2 hover:bg-blue-900 rounded-lg">الرئيسية</Link>
          <Link href="/admin/registrations" className="block p-2 hover:bg-blue-900 rounded-lg">طلبات التسجيل</Link>
          <Link href="/admin/payments" className="block p-2 hover:bg-blue-900 rounded-lg">المدفوعات</Link>
          <Link href="/admin/groups" className="block p-2 bg-blue-900 rounded-lg">المجموعات والجداول</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">المجموعات والفترات</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-900">{group.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {group.gender === 'MALE' ? 'ذكور' : 'إناث'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>الفترة:</strong> {group.period === 'morning' ? 'صباحية' : group.period === 'evening' ? 'مسائية' : 'ليلية'}</p>
                <p><strong>الوقت:</strong> {group.startTime} - {group.endTime}</p>
                <p><strong>الأيام:</strong> {group.daysOfWeek}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}