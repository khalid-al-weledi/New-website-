'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn('credentials', { identifier, password, redirect: false });
    setLoading(false);
    if (!res || res.error) {
      setError('بيانات الدخول غير صحيحة');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-royal-50 p-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-royal-800">دخول الحساب</h1>
          <p className="mt-1 text-sm text-royal-600">مقرأة الإمام الجزري</p>
        </div>
        {error && <div className="rounded-xl bg-red-50 p-3 text-red-800 text-sm">{error}</div>}
        <div>
          <label className="label">البريد أو الهاتف</label>
          <input
            value={identifier} onChange={(e) => setIdentifier(e.target.value)}
            required className="input"
          />
        </div>
        <div>
          <label className="label">كلمة المرور</label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            required className="input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'جارٍ الدخول...' : 'دخول'}
        </button>
        <p className="text-center text-sm text-royal-600">
          <Link href="/" className="hover:text-gold-600">العودة للرئيسية</Link>
        </p>
      </form>
    </main>
  );
}