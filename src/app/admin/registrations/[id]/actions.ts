"use server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function approveRegistration(requestId: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { error: "غير مصرح لك" };
  }

  const request = await prisma.registrationRequest.findUnique({ where: { id: requestId } });
  if (!request || request.status !== 'PENDING') {
    return { error: "الطلب غير موجود أو تمت معالجته" };
  }

  try {
    const defaultPassword = await bcrypt.hash(request.phone, 10);

    await prisma.$transaction(async (tx) => {
      let user = await tx.user.findFirst({ where: { phone: request.phone } });
      
      if (!user) {
        user = await tx.user.create({
          data: {
            email: `student_${request.phone}@aljazari.local`,
            phone: request.phone,
            fullName: request.fullName,
            passwordHash: defaultPassword,
            role: "STUDENT",
          },
        });
      }

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
        where: { id: requestId },
        data: { status: 'APPROVED', studentId: student.id, reviewedAt: new Date(), reviewerId: session.user.id },
      });
    });

    revalidatePath('/admin/registrations');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "حدث خطأ أثناء القبول" };
  }
}

export async function rejectRegistration(requestId: string, reason: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { error: "غير مصرح لك" };
  }

  try {
    await prisma.registrationRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED', reviewNotes: reason, reviewedAt: new Date(), reviewerId: session.user.id },
    });
    revalidatePath('/admin/registrations');
    return { success: true };
  } catch (error) {
    return { error: "حدث خطأ أثناء الرفض" };
  }
}