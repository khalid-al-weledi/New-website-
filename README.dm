# مقرأة الإمام الجزري للإقراء والإجازة بالسند

موقع إلكتروني عربي متكامل — Next.js + PostgreSQL (Supabase) + Prisma + NextAuth.

## البنية

- **الواجهة والـ API:** Next.js 14 (App Router) على Vercel
- **قاعدة البيانات:** PostgreSQL على Supabase
- **الملفات (إيصالات):** Supabase Storage (bucket خاص)
- **المصادقة:** NextAuth Credentials + bcrypt

## المتطلبات المحلية

- Node.js 20+
- حساب Supabase (مجاني)
- Git

---

## 1) إعداد Supabase

1. أنشئ مشروعًا جديدًا على [supabase.com](https://supabase.com).
2. من **Project Settings → Database → Connection string** انسخ:
   - **Transaction Pooler** (منفذ 6543) → `DATABASE_URL` + أضف `?pgbouncer=true&connection_limit=1`
   - **Direct / Session Pooler** (منفذ 5432) → `DIRECT_URL`
3. من **Project Settings → API** انسخ:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (سري، لا تشاركه)
4. من **Storage** أنشئ bucket باسم `receipts` واجعله **Private**.
5. (اختياري) من **Authentication → Providers** عطّل كل مزودي الدخول لأننا نستخدم NextAuth فقط.

---

## 2) التشغيل المحلي

```bash
cp .env.example .env
# املأ القيم من Supabase + ولّد NEXTAUTH_SECRET:
#   openssl rand -base64 32

npm install
npx prisma migrate deploy
npm run db:seed
npm run create-admin -- admin@example.com "اسم المدير" "كلمة-مرور-قوية-12"
npm run dev