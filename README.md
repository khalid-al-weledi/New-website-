# مقرأة الإمام الجزري — إعداد التشغيل

## المتطلبات
- Node.js 20+
- PostgreSQL 15+

## التشغيل

```bash
cp .env.example .env
# عدّل DATABASE_URL و NEXTAUTH_SECRET
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev