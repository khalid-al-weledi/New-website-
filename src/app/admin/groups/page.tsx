import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function GroupsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') redirect("/login");

  const rooms = [
    { id: "room-male-morning", name: "ذكور - صباحي", gender: "MALE", period: "صباحية" },
    { id: "room-male-evening", name: "ذكور - مسائي", gender: "MALE", period: "مسائية" },
    { id: "room-male-night", name: "ذكور - ليلي", gender: "MALE", period: "ليلية" },
    { id: "room-female-morning", name: "إناث - صباحي", gender: "FEMALE", period: "صباحية" },
    { id: "room-female-evening", name: "إناث - مسائي", gender: "FEMALE", period: "مسائية" },
    { id: "room-female-night", name: "إناث - ليلي", gender: "FEMALE", period: "ليلية" },
  ];

  // جلب الطلاب لمعرفة من سيدخل في أي غرفة
  const requests = await prisma.registrationRequest.findMany({
    where: { status: 'APPROVED' }
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">غرف البث المباشر (للمشرف)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          // حساب عدد الطلاب في هذه الغرفة
          const roomStudents = requests.filter(r => 
            r.gender === room.gender && 
            r.preferredTimeSlots?.includes(room.period)
          );

          return (
            <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{room.name}</h3>
                <div className="mb-4 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                  <p><strong>عدد الطلاب:</strong> {roomStudents.length}</p>
                </div>
                <ul className="space-y-2 max-h-40 overflow-y-auto mb-4">
                  {roomStudents.map(student => (
                    <li key={student.id} className="text-sm bg-blue-50 px-3 py-2 rounded-lg text-blue-800">
                      {student.fullName}
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                href={`/live?room=${room.id}`} 
                className="w-full block text-center bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition"
              >
                دخول الغرفة وبث الصوت/الفيديو 🎙️
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}