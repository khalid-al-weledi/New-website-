"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReviewActions({ requestId, status }: { requestId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (newStatus: string) => {
    if (!confirm(`هل أنت متأكد من تغيير الحالة إلى ${newStatus}؟`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/registrations/${requestId}`, {
      method: "POST",
      body: JSON.stringify({ status: newStatus }),
      headers: { "Content-Type": "application/json" },
    });
    
    if (res.ok) {
      router.refresh();
      alert("تم التحديث بنجاح");
    } else {
      alert("حدث خطأ");
    }
    setLoading(false);
  };

  if (status !== 'PENDING') {
    return <div className="text-green-600 font-bold">تمت معالجة هذا الطلب مسبقاً (الحالة: {status})</div>;
  }

  return (
    <div className="flex gap-2">
      <button disabled={loading} onClick={() => handleAction('APPROVED')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
        قبول الطالب (وإنشاء حساب + هدية 30 دقيقة)
      </button>
      <button disabled={loading} onClick={() => handleAction('REJECTED')} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
        رفض الطلب
      </button>
    </div>
  );
}