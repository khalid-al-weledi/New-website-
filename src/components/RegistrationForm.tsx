"use client";

import { useState } from "react";

export default function RegistrationForm({ programs }: { programs: { id: string; title: string }[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // معالجة صناديق الاختيار (Checkboxes) لترسل true/false
    data.studiedTajweed = formData.get("studiedTajweed") === "on";
    data.hasPreviousIjazah = formData.get("hasPreviousIjazah") === "on";
    data.hasReadQuranByLooking = formData.get("hasReadQuranByLooking") === "on";
    data.hasMemorizedQuran = formData.get("hasMemorizedQuran") === "on";

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(`تم استلام طلبك بنجاح. رقم الطلب: ${result.requestNumber}`);
        (e.target as HTMLFormElement).reset();
      } else {
        setError(result.error || "حدث خطأ أثناء إرسال الطلب");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم، تحقق من الإنترنت");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center font-bold">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-center font-bold">
          {error}
        </div>
      )}

      {/* 1. البيانات الأساسية */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2">البيانات الأساسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل *</label>
            <input type="text" name="fullName" required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الجنس *</label>
            <select name="gender" required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none bg-white">
              <option value="">اختر...</option>
              <option value="MALE">ذكر</option>
              <option value="FEMALE">أنثى</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">العمر *</label>
            <input type="number" name="age" min="5" max="100" required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
            <input type="tel" name="phone" required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البلد *</label>
            <input type="text" name="country" required defaultValue="إثيوبيا" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المدينة / المنطقة *</label>
            <input type="text" name="city" required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* 2. بيانات ولي الأمر */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2">بيانات ولي الأمر (إن وجد)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم ولي الأمر</label>
            <input type="text" name="guardianName" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">هاتف ولي الأمر</label>
            <input type="tel" name="guardianPhone" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* 3. الخلفية التعليمية */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2">الخلفية التعليمية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المدرسة / المركز السابق</label>
            <input type="text" name="previousSchool" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المدينة السابقة</label>
            <input type="text" name="previousCity" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشيخ السابق</label>
            <input type="text" name="previousTeacher" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مدة التعلم</label>
            <input type="text" name="learningDuration" placeholder="مثال: سنتان" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مستوى القراءة</label>
            <input type="text" name="readingLevel" placeholder="مثال: مبتدئ، متوسط، متقدم" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الروايات التي درستها</label>
            <input type="text" name="studiedRiwayat" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">الشهادات ذات الصلة</label>
            <input type="text" name="certificates" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* 4. حالة القرآن (فصل النظر عن الحفظ - هام جداً) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2">الحالة مع القرآن الكريم</h2>
        <div className="bg-blue-50 p-4 rounded-xl space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="studiedTajweed" className="w-5 h-5 text-blue-600 rounded" />
            <span className="text-gray-800">درست التجويد سابقاً</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="hasPreviousIjazah" className="w-5 h-5 text-blue-600 rounded" />
            <span className="text-gray-800">لدي إجازة سابقة</span>
          </label>
          <hr className="border-blue-200 my-2" />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="hasReadQuranByLooking" className="w-5 h-5 text-blue-600 rounded" />
            <span className="text-gray-800 font-bold">هل قرأت القرآن كاملاً نظراً من المصحف؟</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="hasMemorizedQuran" className="w-5 h-5 text-blue-600 rounded" />
            <span className="text-gray-800 font-bold">هل حفظت القرآن الكريم؟</span>
          </label>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">مقدار الحفظ (إن وجد)</label>
            <input type="text" name="memorizationAmount" placeholder="مثال: كامل، نصف، 10 أجزاء" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* 5. تفضيلات الدراسة */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2">تفضيلات الدراسة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البرنامج المطلوب</label>
            <select name="programId" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none bg-white">
              <option value="">اختر البرنامج...</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الأيام المفضلة</label>
            <input type="text" name="preferredDays" placeholder="مثال: السبت، الأحد، الاثنين" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">الفترات المفضلة</label>
            <input type="text" name="preferredTimeSlots" placeholder="مثال: صباحي (09:00-12:30) أو مسائي" className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات إضافية</label>
            <textarea name="additionalNotes" rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"></textarea>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition disabled:opacity-50 text-lg">
        {loading ? "جاري إرسال الطلب..." : "إرسال طلب التسجيل"}
      </button>
    </form>
  );
}