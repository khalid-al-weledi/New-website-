"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function PaymentActions({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    let reason = "";
    if (action === 'reject') {
      const input = prompt("اكتب سبب رفض طلب الشحن (سيظهر للطالب):");
      if (input === null) return;
      if (!input.trim()) { alert("يجب كتابة السبب"); return; }
      reason = input;
    } else {
      if (!confirm("هل قمت بمطابقة رقم العملية مع رسالة البنك؟ سيتم إضافة الرصيد للطالب.")) return;
    }

    setLoading(true);
    const res = await fetch(`/api/admin/payments/${paymentId}`, {
      method: "POST",
      body: JSON.stringify({ action, reason }),
      headers: { "Content-Type": "application/json" },
    });
    
    if (res.ok) {
      router.refresh();
      alert(action === 'approve' ? "تم اعتماد المبلغ وإضافة الدقائق للطالب." : "تم رفض الطلب.");
    } else {
      alert("حدث خطأ");
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <button disabled={loading} onClick={() => handleAction('approve')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 disabled:opacity-50">اعتماد</button>
      <button disabled={loading} onClick={() => handleAction('reject')} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-50">رفض</button>
    </div>
  );
}