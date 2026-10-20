import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ReviewActions } from "./ReviewActions";

export default async function RegistrationDetails({ params }: { params: { id: string } }) {
  const request = await prisma.registrationRequest.findUnique({
    where: { id: params.id },
  });

  if (!request) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">تفاصيل طلب التسجيل</h1>
        <Link href="/admin/registrations" className="text-sm text-blue-600 hover:underline">← العودة للقائمة</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="text-gray-500 text-sm block">رقم الطلب</span> <span className="font-mono">{request.requestNumber}</span></div>
          <div><span className="text-gray-500 text-sm block">الاسم</span> <span className="font-bold text-blue-900">{request.fullName}</span></div>
          <div><span className="text-gray-500 text-sm block">الهاتف</span> {request.phone}</div>
          <div><span className="text-gray-500 text-sm block">العمر</span> {request.age}</div>
          <div><span className="text-gray-500 text-sm block">البلد/المدينة</span> {request.country} - {request.city}</div>
          <div><span className="text-gray-500 text-sm block">مستوى القراءة</span> {request.readingLevel || 'غير محدد'}</div>
          <div className="md:col-span-2"><span className="text-gray-500 text-sm block">ملاحظات الطالب</span> {request.additionalNotes || 'لا يوجد'}</div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-bold text-gray-800 mb-2">الإجراءات الإدارية</h3>
          <ReviewActions requestId={request.id} status={request.status} />
        </div>
      </div>
    </div>
  );
}