import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // 1. التحقق الأمني: هل المستخدم أدمن؟
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: "غير مصرح لك باتخاذ هذا الإجراء" }, { status: 403 });
    }

    const { status } = await req.json(); // 'APPROVED' أو 'REJECTED'

    const request = await prisma.registrationRequest.findUnique({
      where: { id: params.id },
    });

    if (!request || request.status !== 'PENDING') {
      return NextResponse.json({ error: "الطلب غير موجود أو تمت معالجته مسبقاً" }, { status: 400 });
    }

    if (status === 'REJECTED') {
      await prisma.registrationRequest.update({
        where: { id: params.id },
        data: { status: 'REJECTED', reviewedAt: new Date(), reviewerId: session.user.id },
      });
      return NextResponse.json({ ok: true });
    }

    if (status === 'APPROVED') {
      await prisma.$transaction(async (tx) => {
        // 1. إنشاء حساب مستخدم (إذا لم يكن موجوداً)
        let user = await tx.user.findFirst({ where: { phone: request.phone } });
        
        if (!user) {
          user = await tx.user.create({
            data: {
              email: `student_${request.phone}@aljazari.local`, // إيميل مؤقت
              phone: request.phone,
              fullName: request.fullName,
              passwordHash: "temp_hash", // كلمة مرور مؤقتة، يمكن إضافة ميزة تغييرها لاحقاً
              role: "STUDENT",
            },
          });
        }

        // 2. إنشاء ملف الطالب
        const student = await tx.student.create({
          data: {
            userId: user.id,
            studentNumber: `STD-${Date.now().toString().slice(-6)}`,
            programId: request.programId || null,
            balanceMinutes: 30, // هدية الترحيب
            giftClaimedAt: new Date(),
          },
        });

        // 3. تسجيل حركة الرصيد المالية (لضمان عدم التكرار مستقبلاً)
        await tx.balanceTransaction.create({
          data: {
            studentId: student.id,
            type: "GIFT",
            minutesDelta: 30,
            balanceBefore: 0,
            balanceAfter: 30,
            reason: "هدية الترحيب بالطالب الجديد (مرة واحدة)",
            idempotencyKey: `gift-${student.id}`,
          },
        });

        // 4. تحديث حالة الطلب
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