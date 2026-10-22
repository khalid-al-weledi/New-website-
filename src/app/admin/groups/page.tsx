import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function GroupsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') redirect("/login");

  // جلب المجموعات مع الطلاب
  const groups = await prisma.group.findMany({
    include: {
      students: { include: { user: true } }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">المجموعات والغرف الصوتية</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-900">{group.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{group.gender === 'MALE' ? 'ذكور' : 'إناث'}</span>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                <p><strong>الوقت:</strong> {group.startTime} - {group.endTime}</p>
                <p><strong>الأيام:</strong> {group.daysOfWeek}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-gray-700 text-sm mb-2">الطلاب ({group.students.length}):</h4>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {group.students.length === 0 ? (
                    <li className="text-xs text-gray-400">لا يوجد طلاب.</li>
                  ) : (
                    group.students.map(student => (
                      <li key={student.id} className="text-sm bg-blue-50 px-3 py-2 rounded-lg flex justify-between">
                        <span>{student.user.fullName}</span>
                        <span className="text-xs text-blue-600 font-mono">{student.studentNumber}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* زر دخول المشرف للغرفة */}
            <Link 
              href={`/live?room=${group.id}`} 
              className="w-full block text-center bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
            >
              دخول غرفة البث 🎙️
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}