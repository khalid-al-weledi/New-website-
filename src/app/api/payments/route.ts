import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { packageId, method, phone, senderName, transactionId } = body;

    if (!packageId || !method || !phone || !senderName || !transactionId) {
      return NextResponse.json({ error: 'كل الحقول مطلوبة' }, { status: 400 });
    }

    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) return NextResponse.json({ error: 'الباقة غير موجودة' }, { status: 404 });

    const student = await prisma.student.findFirst({ where: { user: { phone } } });
    if (!student) return NextResponse.json({ error: 'لا يوجد حساب طالب بهذا الرقم. يرجى التسجيل أولاً.' }, { status: 404 });

    const paymentNumber = `PAY-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
    
    await prisma.payment.create({
      data: {
        paymentNumber, studentId: student.id, packageId: pkg.id,
        amountETB: pkg.priceETB, minutes: pkg.minutes, method,
        senderName, transactionId, idempotencyKey: `pay-${paymentNumber}`,
      }
    });

    return NextResponse.json({ ok: true, paymentNumber });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: 'حدث خطأ أثناء معالجة الدفع' }, { status: 500 });
  }
}