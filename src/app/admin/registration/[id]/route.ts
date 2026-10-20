import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    
    const request = await prisma.registrationRequest.findUnique({
      where: { id: params.id },
    });

    if (!request || request.status !== 'PENDING') {
      return NextResponse.json({ error: "طلب غير صالح أو تمت معالجته" }, { status: 400 });
    }

    if (status === 'REJECTED') {
      await prisma.registrationRequest.update({
        where: { id: params.id },
        data: { status: 'REJECTED' },
      });
      return NextResponse.json({ ok: true });
    }

    if (status === 'APPROVED') {
      // استخدام Transaction لضمان عدم تكرار الحساب أو الهدية
      await prisma.$transaction(async (tx) => {
        // 1. إنشاء مستخدم جديد
        const user = await tx.user.create({
          data: {
            email: `student_${request.phone}@aljazari.local`, // إيميل مؤقت
            phone: request.phone,
            fullName: request.fullName,
            passwordHash: "temp_hash", // هيتم تغييره لاحقاً عند إضافة تغيير كلمة المرور
            role: "STUDENT",
          },
        });

        // 2. إنشاء ملف الطالب
        const student = await tx.student.create({
          data: {
            userId: user.id,
            studentNumber: `STD-${Date.now().toString().slice(-6)}`,
            programId: request.programId,
            balanceMinutes: 30, // إضافة رصيد الهدية
            giftClaimedAt: new Date(),
          },
        });

        // 3. تسجيل حركة الرصيد (الهدية)
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
          data: { status: 'APPROVED', studentId: student.id },
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