import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { action } = await req.json(); // 'approve' or 'reject'

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: { student: true },
    });

    if (!payment) return NextResponse.json({ error: "الدفعة غير موجودة" }, { status: 404 });
    if (payment.status !== 'PENDING') return NextResponse.json({ error: "تمت معالجة هذه الدفعة مسبقاً" }, { status: 400 });

    if (action === 'reject') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REJECTED' },
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'approve') {
      await prisma.$transaction(async (tx) => {
        // 1. جلب الطالب للتأكد من الرصيد الحالي
        const student = await tx.student.findUnique({ where: { id: payment.studentId } });
        if (!student) throw new Error("الطالب غير موجود");

        const balanceBefore = student.balanceMinutes;
        const balanceAfter = balanceBefore + payment.minutes;

        // 2. تحديث حالة الدفع
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'APPROVED', reviewedAt: new Date() },
        });

        // 3. تحديث رصيد الطالب
        await tx.student.update({
          where: { id: student.id },
          data: { balanceMinutes: balanceAfter },
        });

        // 4. تسجيل الحركة في السجل المالي
        await tx.balanceTransaction.create({
          data: {
            studentId: student.id,
            type: 'PAYMENT_CREDIT',
            minutesDelta: payment.minutes,
            balanceBefore,
            balanceAfter,
            reason: `اعتماد دفعة باقة ${payment.minutes} دقيقة`,
            paymentId: payment.id,
            idempotencyKey: `tx-${payment.id}`, // يمنع التكرار نهائياً
          },
        });
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة الدفعة" }, { status: 500 });
  }
}