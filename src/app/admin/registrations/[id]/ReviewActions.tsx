"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewActions({ requestId, status }: { requestId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (newStatus: string) => {
    if (!confirm(`هل أنت متأكد من تغيير الحالة إلى ${newStatus === 'APPROVED' ? 'قبول' : 'رفض'}؟`)) return;
    setLoading(true);
    
    const res = await fetch(`/api/admin/registrations/${requestId}`, {
      method: "POST",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });
    
    if (res.ok) {
      router.refresh(); // تحديث الصفحة لإظهار الحالة الجديدة
      alert("تم التحديث بنجاح");
    } else {
      const data = await res.json();
      alert(data.error || "حدث خطأ");
    }
    setLoading(false);
  };

  if (status !== 'PENDING') {
    return <div className="text-green-600 font-bold p-4 bg-green-50 rounded-lg">تمت معالجة هذا الطلب مسبقاً (الحالة: {status})</div>;
  }

  return (
    <div className="flex gap-2 mt-4">
      <button disabled={loading} onClick={() => handleAction('APPROVED')} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold">
        {loading ? "جاري المعالجة..." : "قبول الطالب (وإنشاء الحساب)"}
      </button>
      <button disabled={loading} onClick={() => handleAction('REJECTED')} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 font-bold">
        رفض الطلب
      </button>
    </div>
  );
}