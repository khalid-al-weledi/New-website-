"use client";
import { useState } from "react";

type Setting = {
  method: string;
  accountName: string | null;
  accountNumber: string | null;
};

export default function PaymentForm({ packageId, packagePrice, settings }: { packageId: string; packagePrice: number; settings: Setting[] }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  // الحصول على بيانات الحساب بناءً على الوسيلة المختارة
  const activeSetting = settings.find(s => s.method === selectedMethod);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    formData.append("packageId", packageId);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(`تم رفع الإيصال بنجاح. رقم العملية: ${data.paymentNumber}. يرجى الانتظار حتى يتم الاعتماد.`);
        (e.target as HTMLFormElement).reset();
        setSelectedMethod("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">إتمام الدفع</h1>
          <p className="text-gray-600">المبلغ المطلوب: <strong className="text-yellow-600">{packagePrice} بر</strong></p>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          {success && <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center font-bold">{success}</div>}
          {error && <div className="bg-red-50 text-red-800 p-4 rounded-xl text-center font-bold">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف المسجل به *</label>
            <input type="tel" name="phone" required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" placeholder="أدخل رقم هاتفك لربط الدفع بحسابك" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">وسيلة الدفع *</label>
            <select 
              name="method" 
              required 
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none bg-white"
            >
              <option value="">اختر...</option>
              {settings.map(s => (
                <option key={s.method} value={s.method}>
                  {s.method === 'CBE' ? 'CBE (البنك التجاري)' : 
                   s.method === 'BOA' ? 'BOA / أبيسينيا' : 
                   s.method === 'TELEBIRR' ? 'Telebirr' : 'M-Pesa'}
                </option>
              ))}
            </select>
          </div>

          {/* عرض بيانات الحساب بعد الاختيار */}
          {activeSetting && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
              <h3 className="font-bold text-blue-900 mb-2">تعليمات التحويل:</h3>
              <p className="text-sm text-gray-700">يرجى تحويل مبلغ <strong className="text-blue-900">{packagePrice} بر</strong> إلى الحساب التالي:</p>
              <div className="bg-white p-3 rounded-lg border border-blue-100 mt-2">
                <p className="text-sm"><span className="text-gray-500">اسم الحساب:</span> <strong className="text-blue-900">{activeSetting.accountName}</strong></p>
                <p className="text-sm mt-1"><span className="text-gray-500">رقم الحساب:</span> <strong className="text-blue-900 font-mono text-lg">{activeSetting.accountNumber}</strong></p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">صورة الإيصال (JPG, PNG, PDF) *</label>
            <input type="file" name="receipt" accept="image/*,.pdf" required className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <p className="text-xs text-gray-500 mt-1">الحد الأقصى 5 ميجابايت.</p>
          </div>

          <button type="submit" disabled={loading || !selectedMethod} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50">
            {loading ? "جاري الرفع..." : "تأكيد الدفع ورفع الإيصال"}
          </button>
        </form>
      </div>
    </main>
  );
}