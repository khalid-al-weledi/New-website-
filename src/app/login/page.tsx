"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
    } else {
      router.push("/admin"); // تحويل للوحة التحكم بعد الدخول
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">دخول الحساب</h1>
          <p className="text-sm text-gray-500">مقرأة الإمام الجزري</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">البريد الإلكتروني</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">كلمة المرور</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none" 
            required
          />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition disabled:opacity-50">
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
        
        <p className="text-center text-sm text-blue-900 mt-4">
          <Link href="/" className="hover:text-yellow-600">العودة للرئيسية</Link>
        </p>
      </form>
    </main>
  );
}