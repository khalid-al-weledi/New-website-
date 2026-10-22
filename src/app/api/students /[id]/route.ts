import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { nanoid } from "nanoid";

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    }

    const { action, amount, reason, title } = await req.json();
    const studentId = params.id;

    const student = await prisma.student.findUnique({ where: { id: studentId }, include: { user: true } });
    if (!student) return NextResponse.json({ error: "الطالب غير موجود" }, { status: 404 });

    if (action === 'deduct') {
      if (!amount || amount <= 0) return NextResponse.json({ error: "المبلغ غير صالح" }, { status: 400 });
      if (student.balanceMinutes < amount) return NextResponse.json({ error: "رصيد الطالب لا يكفي" }, { status: 400 });

      await prisma.$transaction(async (tx) => {
        const balanceBefore = student.balanceMinutes;
        const balanceAfter = balanceBefore - amount;

        await tx.student.update({
          where: { id: studentId },
          data: { balanceMinutes: balanceAfter },
        });

        await tx.balanceTransaction.create({
          data: {
            studentId: studentId,
            type: "USAGE",
            minutesDelta: -amount,
            balanceBefore,
            balanceAfter,
            reason: reason || "خصم جلسة قراءة",
            idempotencyKey: `deduct-${nanoid()}`,
            createdById: session.user.id,
          },
        });
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'add_note') {
      await prisma.auditLog.create({
        data: { action: "ADD_NOTE", entity: "Student", entityId: studentId, actorId: session.user.id, metadata: { note: reason } }
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'send_message') {
      await prisma.notification.create({
        data: { userId: student.userId, title: title || "رسالة من الإدارة", message: reason }
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'expel') {
      await prisma.user.update({ where: { id: student.userId }, data: { isActive: false } });
      await prisma.auditLog.create({
        data: { action: "EXPEL_STUDENT", entity: "Student", entityId: studentId, actorId: session.user.id, metadata: { reason } }
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'honor') {
      await prisma.auditLog.create({
        data: { action: "HONOR_STUDENT", entity: "Student", entityId: studentId, actorId: session.user.id, metadata: { reason } }
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}