'use client';
import { useState } from 'react';
import { Button } from './Button';

type Program = { id: string; title: string };

export default function RegistrationForm({ programs }: { programs: Program[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {};
    fd.forEach((v, k) => (payload[k] = v));

    // Checkboxes → boolean
    payload.studiedTajweed = fd.get('studiedTajweed') === 'on';
    payload.hasPreviousIjazah = fd.get('hasPreviousIjazah') === 'on';
    payload.hasReadQuranByLooking = fd.get('hasReadQuranByLooking') === 'on';
    payload.hasMemorizedQuran = fd.get('hasMemorizedQuran') === 'on';

    try {
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'تعذر إرسال الطلب');
      } else {
        setSuccess(`تم استلام طلبك. رقم الطلب: ${data.requestNumber}`);
        (e.target as HTMLFormElement).reset();
      }
    } catch {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5">
      {success && (
        <div className="rounded-xl bg-green-50 p-4 text-green-800 text-sm">{success}</div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-800 text-sm">{error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">الاسم الكامل *</label>
          <input name="fullName" required className="input" />
        </div>
        <div>
          <label className="label">الجنس *</label>
          <select name="gender" required className="input">
            <option value="">اختر</option>
            <option value="MALE">ذكر</option>
            <option value="FEMALE">أنثى</option>
          </select>
        </div>
        <div>
          <label className="label">العمر *</label>
          <input name="age" type="number" min={5} max={100} required className="input" />
        </div>
        <div>
          <label className="label">رقم الهاتف *</label>
          <input name="phone" required className="input" />
        </div>
        <div>
          <label className="label">البلد *</label>
          <input name="country" required defaultValue="إثيوبيا" className="input" />
        </div>
        <div>
          <label className="label">المدينة *</label>
          <input name="city" required className="input" />
        </div>
        <div>
          <label className="label">اسم ولي الأمر</label>
          <input name="guardianName" className="input" />
        </div>
        <div>
          <label className="label">هاتف ولي الأمر</label>
          <input name="guardianPhone" className="input" />
        </div>
        <div>
          <label className="label">المدرسة/المركز السابق</label>
          <input name="previousSchool" className="input" />
        </div>
        <div>
          <label className="label">المدينة السابقة</label>
          <input name="previousCity" className="input" />
        </div>
        <div>
          <label className="label">الشيخ السابق</label>
          <input name="previousTeacher" className="input" />
        </div>
        <div>
          <label className="label">مدة التعلم</label>
          <input name="learningDuration" className="input" placeholder="مثال: سنتان" />
        </div>
        <div>
          <label className="label">مستوى القراءة</label>
          <input name="readingLevel" className="input" />
        </div>
        <div>
          <label className="label">الروايات التي درسها</label>
          <input name="studiedRiwayat" className="input" />
        </div>
        <div className="md:col-span-2">
          <label className="label">الشهادات ذات الصلة</label>
          <input name="certificates" className="input" />
        </div>
        <div>
          <label className="label">البرنامج المطلوب</label>
          <select name="programId" className="input">
            <option value="">اختر برنامجاً</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">الأيام المفضلة</label>
          <input name="preferredDays" className="input" />
        </div>
        <div className="md:col-span-2">
          <label className="label">الفترات المفضلة</label>
          <input name="preferredTimeSlots" className="input" />
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-royal-50 p-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="studiedTajweed" />
          <span>درست التجويد سابقاً</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="hasPreviousIjazah" />
          <span>لديّ إجازة سابقة</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="hasReadQuranByLooking" />
          <span>قرأت القرآن كاملاً نظراً من المصحف</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="hasMemorizedQuran" />
          <span>حفظت القرآن</span>
        </label>
        <div>
          <label className="label mt-2">مقدار الحفظ</label>
          <input name="memorizationAmount" className="input" placeholder="مثال: 10 أجزاء / نصف / كامل" />
        </div>
      </div>

      <div>
        <label className="label">ملاحظات إضافية</label>
        <textarea name="additionalNotes" rows={3} className="input" />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'جارٍ الإرسال...' : 'إرسال طلب التسجيل'}
      </Button>
    </form>
  );
}