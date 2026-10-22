"use client";
import { useState } from "react";

export default function RegistrationForm({ programs }: { programs: { id: string; title: string }[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("");
  const [period, setPeriod] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => { data[key] = value; });

    data.studiedTajweed = formData.get("studiedTajweed") === "on";
    data.hasPreviousIjazah = formData.get("hasPreviousIjazah") === "on";
    data.hasReadQuranByLooking = formData.get("hasReadQuranByLooking") === "on";
    data.hasMemorizedQuran = formData.get("hasMemorizedQuran") === "on";

    if (gender === "MALE") data.preferredDays = "الثلاثاء، الأربعاء، الخميس";
    if (gender === "FEMALE") data.preferredDays = "السبت، الأحد، الاثنين";
    data.preferredTimeSlots = period;

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setSuccess(`تم استلام طلبك بنجاح. رقم الطلب: ${result.requestNumber}. يمكنك الآن الدخول لحسابك برقم هاتفك.`);
        (e.target as HTMLFormElement).reset();
        setGender(""); setPeriod("");
      } else {
        setError(result.error || "حدث خطأ");
      }
    } catch (err) { setError("تعذر الاتصال بالخادم"); } 
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
      {success && <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center font-bold">{success}</div>}
      {error && <div className="bg-red-50 text-red-800 p-4 rounded-xl text-center font-bold">{error}</div>}

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2">البيانات الأساسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label">الاسم الكامل *</label><input type="text" name="fullName" required className="input" /></div>
          <div><label className="label">رقم الهاتف *</label><input type="tel" name="phone" required className="input" /></div>
          <div className="md:col-span-2">
            <label className="label">كلمة المرور (للدخول لاحقاً) *</label>
            <input type="password" name="password" minLength={6} required className="input" placeholder="اختر كلمة مرور قوية" />
          </div>
          <div>
            <label className="label">الجنس *</label>
            <select name="gender" required value={gender} onChange={(e) => setGender(e.target.value)} className="input bg-white">
              <option value="">اختر...</option>
              <option value="MALE">ذكر</option>
              <option value="FEMALE">أنثى</option>
            </select>
          </div>
          <div><label className="label">العمر *</label><input type="number" name="age" min="5" max="100" required className="input" /></div>
          <div><label className="label">البلد *</label><input type="text" name="country" required defaultValue="إثيوبيا" className="input" /></div>
          <div><label className="label">المدينة / المنطقة *</label><input type="text" name="city" required className="input" /></div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2">بيانات ولي الأمر</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="label">اسم ولي الأمر</label><input type="text" name="guardianName" className="input" /></div>
          <div><label className="label">هاتف ولي الأمر</label><input type="tel" name="guardianPhone" className="input" /></div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-blue-900 border-b pb-2">الفترة المطلوبة</h2>
        <div className="grid grid-cols-1 gap-3">
          {['صباحية (9:00 - 12:30)', 'مسائية (2:00 - 3:30)', 'ليلية (9:00 - 11:00)'].map((p) => (
            <label key={p} className={`border-2 rounded-xl p-4 cursor-pointer transition ${period === p ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
              <input type="radio" name="period" value={p} required checked={period === p} onChange={(e) => setPeriod(e.target.value)} className="hidden" />
              <div className="font-bold text-blue-900">{p}</div>
            </label>
          ))}
        </div>
        {gender && (
          <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm font-bold text-center mt-2">
            الأيام الإجبارية لك: {gender === 'MALE' ? 'الثلاثاء، الأربعاء، الخميس' : 'السبت، الأحد، الاثنين'}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div><label className="label">البرنامج المطلوب</label>
          <select name="programId" className="input bg-white">
            <option value="">اختر البرنامج...</option>
            {programs.map((p) => (<option key={p.id} value={p.id}>{p.title}</option>))}
          </select>
        </div>
        <div><label className="label">ملاحظات إضافية</label><textarea name="additionalNotes" rows={3} className="input"></textarea></div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition disabled:opacity-50 text-lg">
        {loading ? "جاري إرسال الطلب..." : "إرسال طلب التسجيل"}
      </button>
    </form>
  );
}