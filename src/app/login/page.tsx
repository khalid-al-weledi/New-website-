"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert("جاري تجهيز نظام تسجيل الدخول...");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <form onSubmit={handleLogin} className="card w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">دخول الحساب</h1>
          <p className="text-sm text-gray-500">مقرأة الإمام الجزري</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">البريد الإلكتروني</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-blue-200 px-4 py-2 focus:border-yellow-500 focus:outline-none" 
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">كلمة المرور</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-blue-200 px-4 py-2 focus:border-yellow-500 focus:outline-none" 
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full">دخول</button>
        
        <p className="text-center text-sm text-blue-900 mt-4">
          <Link href="/" className="hover:text-yellow-600">العودة للرئيسية</Link>
        </p>
      </form>
    </main>
  );
}