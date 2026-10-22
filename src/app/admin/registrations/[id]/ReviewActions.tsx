"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveRegistration, rejectRegistration } from "./actions";

export function ReviewActions({ requestId, status }: { requestId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'APPROVED' | 'REJECTED') => {
    let reason = "";
    
    if (action === 'REJECTED') {
      const input = prompt("يرجى كتابة سبب الرفض (سيظهر للطالب):");
      if (input === null) return;
      if (!input.trim()) {
        alert("يجب كتابة سبب الرفض!");
        return;
      }
      reason = input;
    } else {
      if (!confirm("هل أنت متأكد من قبول الطالب؟ سيتم إنشاء حساب له وإضافة 30 دقيقة هدية.")) return;
    }

    setLoading(true);
    
    // استدعاء السيرفر أكشن مباشرة
    const res = action === 'APPROVED' 
      ? await approveRegistration(requestId)
      : await rejectRegistration(requestId, reason);

    if (res.error) {
      alert(res.error);
    } else {
      alert(action === 'APPROVED' ? "تم القبول بنجاح، وتم إضافة 30 دقيقة للطالب." : "تم رفض الطلب.");
      router.refresh();
    }
    setLoading(false);
  };

  if (status !== 'PENDING') {
    return <div className="text-gray-600 font-bold p-4 bg-gray-50 rounded-lg">تمت معالجة هذا الطلب مسبقاً (الحالة: {status === 'APPROVED' ? 'مقبول' : 'مرفوض'})</div>;
  }

  return (
    <div className="flex gap-4 mt-6">
      <button disabled={loading} onClick={() => handleAction('APPROVED')} className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 font-bold text-lg flex-1 shadow-md">
        {loading ? "جاري المعالجة..." : "قبول الطالب (وإضافة 30 دقيقة)"}
      </button>
      <button disabled={loading} onClick={() => handleAction('REJECTED')} className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 disabled:opacity-50 font-bold text-lg flex-1 shadow-md">
        رفض الطلب
      </button>
    </div>
  );
}