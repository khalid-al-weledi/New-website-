"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PaymentActions({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!confirm(`هل أنت متأكد من ${action === 'approve' ? 'اعتماد' : 'رفض'} هذا الدفع؟`)) return;
    
    setLoading(true);
    const res = await fetch(`/api/admin/payments/${paymentId}`, {
      method: "POST",
      body: JSON.stringify({ action }),
      headers: { "Content-Type": "application/json" },
    });
    
    if (res.ok) {
      router.refresh();
      alert("تم التحديث بنجاح");
    } else {
      const data = await res.json();
      alert(data.error || "حدث خطأ");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <button disabled={loading} onClick={() => handleAction('approve')} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50">
        اعتماد
      </button>
      <button disabled={loading} onClick={() => handleAction('reject')} className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50">
        رفض
      </button>
    </div>
  );
}