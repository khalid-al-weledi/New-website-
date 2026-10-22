import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 });
    }

    const { status, reason } = await req.json();
    const request = await prisma.registrationRequest.findUnique({ where: { id: params.id } });

    if (!request || request.status !== 'PENDING') {
      return NextResponse.json({ error: "الطلب غير موجود أو تمت معالجته" }, { status: 400 });
    }

    if (status === 'REJECTED') {
      await prisma.registrationRequest.update({
        where: { id: params.id },
        data: { status: 'REJECTED', reviewNotes: reason, reviewedAt: new Date(), reviewerId: session.user.id },
      });
      return NextResponse.json({ ok: true });
    }

    if (status === 'APPROVED') {
      // تشفير رقم الهاتف ليكون كلمة المرور الافتراضية
      const defaultPassword = await bcrypt.hash(request.phone, 10);

      await prisma.$transaction(async (tx) => {
        let user = await tx.user.findFirst({ where: { phone: request.phone } });
        
        if (!user) {
          user = await tx.user.create({
            data: {
              email: `student_${request.phone}@aljazari.local`,
              phone: request.phone,
              fullName: request.fullName,
              passwordHash: defaultPassword, // الباسورد = رقم الهاتف
              role: "STUDENT",
            },
          });
        }

        // إنشاء رقم تسلسلي فريد للطالب
        const studentNumber = `STD-${Date.now().toString().slice(-6)}`;

        const student = await tx.student.create({
          data: {
            userId: user.id,
            studentNumber: studentNumber,
            programId: request.programId || null,
            balanceMinutes: 30,
            giftClaimedAt: new Date(),
          },
        });

        await tx.balanceTransaction.create({
          data: {
            studentId: student.id,
            type: "GIFT",
            minutesDelta: 30,
            balanceBefore: 0,
            balanceAfter: 30,
            reason: "هدية ترحيبية بقبول الطالب (30 دقيقة)",
            idempotencyKey: `gift-${student.id}`,
          },
        });

        await tx.registrationRequest.update({
          where: { id: params.id },
          data: { status: 'APPROVED', studentId: student.id, reviewedAt: new Date(), reviewerId: session.user.id },
        });
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "حالة غير معروفة" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}