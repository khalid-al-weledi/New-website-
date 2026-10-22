"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveRegistration, rejectRegistration } from "./[id]/actions";

export function QuickActions({ requestId, status }: { requestId: string, status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // لو الطلب مش معلق، متظهرش الزراير
  if (status !== 'PENDING') return null;

  const handleApprove = async () => {
    if (!confirm("هل أنت متأكد من قبول الطالب وإضافة 30 دقيقة؟")) return;
    setLoading(true);
    const res = await approveRegistration(requestId);
    if (res.error) {
      alert(res.error);
    } else {
      alert("تم القبول بنجاح");
      router.refresh(); // تحديث الجدول فوراً
    }
    setLoading(false);
  };

  const handleReject = async () => {
    const reason = prompt("يرجى كتابة سبب الرفض:");
    if (reason === null) return;
    if (!reason.trim()) {
      alert("يجب كتابة سبب الرفض!");
      return;
    }
    
    setLoading(true);
    const res = await rejectRegistration(requestId, reason);
    if (res.error) {
      alert(res.error);
    } else {
      alert("تم رفض الطلب");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2 justify-center">
      <button 
        onClick={handleApprove} 
        disabled={loading} 
        className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600 disabled:opacity-50 transition"
      >
        قبول
      </button>
      <button 
        onClick={handleReject} 
        disabled={loading} 
        className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition"
      >
        رفض
      </button>
    </div>
  );
}