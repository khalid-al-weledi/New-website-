import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadReceipt } from '@/lib/storage';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('receipt') as File;
    const packageId = formData.get('packageId') as string;
    const method = formData.get('method') as any;
    const phone = formData.get('phone') as string;

    if (!file || !packageId || !method || !phone) {
      return NextResponse.json({ error: 'كل الحقول مطلوبة' }, { status: 400 });
    }

    // 1. التحقق من نوع الملف وحجمه
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'نوع الملف غير مسموح (صور أو PDF فقط)' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json({ error: 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' }, { status: 400 });
    }

    // 2. جلب الباقة من قاعدة البيانات (لا نثق بالسعر المرسل من المتصفح)
    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) return NextResponse.json({ error: 'الباقة غير موجودة' }, { status: 404 });

    // 3. البحث عن الطالب برقم الهاتف
    const student = await prisma.student.findFirst({
      where: { user: { phone } }
    });
    if (!student) {
      return NextResponse.json({ error: 'لا يوجد حساب طالب بهذا الرقم. يرجى التسجيل أولاً.' }, { status: 404 });
    }

    // 4. رفع الإيصال
    const receiptUrl = await uploadReceipt(file, student.id);

    // 5. إنشاء سجل الدفع بحالة PENDING
    const paymentNumber = `PAY-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;
    
    await prisma.payment.create({
      data: {
        paymentNumber,
        studentId: student.id,
        packageId: pkg.id,
        amountETB: pkg.priceETB,
        minutes: pkg.minutes,
        method,
        receiptUrl,
        idempotencyKey: `pay-${paymentNumber}`,
      }
    });

    return NextResponse.json({ ok: true, paymentNumber });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'حدث خطأ أثناء معالجة الدفع' }, { status: 500 });
  }
}