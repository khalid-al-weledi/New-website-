"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function StudentActions({ studentId, currentBalance }: { studentId: string, currentBalance: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string) => {
    let amount = 0;
    let reason = "";
    let title = "";

    if (action === 'deduct') {
      const amountStr = prompt(`رصيده الحالي: ${currentBalance} دقيقة.\nكم دقيقة تريد خصمها؟`);
      if (!amountStr) return;
      amount = parseInt(amountStr);
      reason = prompt("ما هو سبب الخصم؟ (مثال: جلسة اليوم)") || "خصم جلسة";
    } else if (action === 'add_note') {
      reason = prompt("اكتب الملاحظة (ستظهر في السجل الإداري فقط):") || "";
      if (!reason) return;
    } else if (action === 'send_message') {
      title = prompt("عنوان الرسالة (مثال: تنبيه هام):") || "رسالة من الإدارة";
      reason = prompt("نص الرسالة (ستظهر للطالب في حسابه):") || "";
      if (!reason) return;
    } else if (action === 'expel') {
      if (!confirm("هل أنت متأكد من طرد الطالب؟ لن يستطيع الدخول للموقع.")) return;
      reason = prompt("سبب الطرد:") || "مخالفة الشروط";
    } else if (action === 'honor') {
      reason = prompt("سبب التكريم:") || "تميز في الأداء";
    }

    setLoading(true);
    const res = await fetch(`/api/admin/students/${studentId}`, {
      method: "POST",
      body: JSON.stringify({ action, amount, reason, title }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      alert("تم الإجراء بنجاح");
      router.refresh();
    } else {
      alert(data.error);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
      <button disabled={loading} onClick={() => handleAction('deduct')} className="bg-orange-500 text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 text-sm">
        خصم (جلسة)
      </button>
      <button disabled={loading} onClick={() => handleAction('send_message')} className="bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 text-sm">
        إرسال رسالة
      </button>
      <button disabled={loading} onClick={() => handleAction('add_note')} className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 text-sm">
        ملاحظة إدارية
      </button>
      <button disabled={loading} onClick={() => handleAction('honor')} className="bg-green-500 text-white p-3 rounded-xl font-bold hover:bg-green-600 transition disabled:opacity-50 text-sm">
        تكريم
      </button>
      <button disabled={loading} onClick={() => handleAction('expel')} className="bg-red-600 text-white p-3 rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50 text-sm">
        طرد الطالب
      </button>
    </div>
  );
}