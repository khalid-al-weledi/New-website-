"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function QuickActions({ requestId, status }: { requestId: string, status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status !== 'PENDING') return null;

  const handleApprove = async () => {
    if (!confirm("هل أنت متأكد من قبول الطالب وإضافة 30 دقيقة؟")) return;
    setLoading(true);
    // بنستخدم الـ API اللي إحنا عملناه قبل كده
    const res = await fetch(`/api/admin/registrations/${requestId}`, {
      method: "POST",
      body: JSON.stringify({ status: 'APPROVED' }),
      headers: { "Content-Type": "application/json" },
    });
    
    if (res.ok) {
      alert("تم القبول بنجاح");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "حدث خطأ");
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
    const res = await fetch(`/api/admin/registrations/${requestId}`, {
      method: "POST",
      body: JSON.stringify({ status: 'REJECTED', reason }),
      headers: { "Content-Type": "application/json" },
    });
    
    if (res.ok) {
      alert("تم رفض الطلب");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "حدث خطأ");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2 justify-center">
      <button onClick={handleApprove} disabled={loading} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600 disabled:opacity-50 transition">قبول</button>
      <button onClick={handleReject} disabled={loading} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition">رفض</button>
    </div>
  );
}