import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    }

    const { action, reason } = await req.json();
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: { student: true },
    });

    if (!payment || payment.status !== 'PENDING') {
      return NextResponse.json({ error: "الدفعة غير موجودة أو تمت معالجتها" }, { status: 400 });
    }

    if (action === 'reject') {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REJECTED', rejectionReason: reason },
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'approve') {
      await prisma.$transaction(async (tx) => {
        const student = await tx.student.findUnique({ where: { id: payment.studentId } });
        if (!student) throw new Error("الطالب غير موجود");

        const balanceBefore = student.balanceMinutes;
        const balanceAfter = balanceBefore + payment.minutes;

        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'APPROVED', reviewedAt: new Date() },
        });

        await tx.student.update({
          where: { id: student.id },
          data: { balanceMinutes: balanceAfter },
        });

        await tx.balanceTransaction.create({
          data: {
            studentId: student.id,
            type: 'PAYMENT_CREDIT',
            minutesDelta: payment.minutes,
            balanceBefore,
            balanceAfter,
            reason: `اعتماد دفعة باقة ${payment.minutes} دقيقة`,
            paymentId: payment.id,
            idempotencyKey: `tx-${payment.id}`,
          },
        });
      });

      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}