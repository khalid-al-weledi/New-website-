import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { registrationSchema } from '@/lib/validators';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // منع الإرسال المكرر من نفس الرقم خلال 24 ساعة
    const recent = await prisma.registrationRequest.findFirst({
      where: {
        phone: data.phone,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        status: { in: ['PENDING', 'AWAITING_INFORMATION'] },
      },
    });
    if (recent) {
      return NextResponse.json(
        { error: 'يوجد طلب حديث بنفس الرقم. رقم طلبك: ' + recent.requestNumber },
        { status: 429 },
      );
    }

    const requestNumber = `REQ-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;

    const created = await prisma.registrationRequest.create({
      data: {
        requestNumber,
        fullName: data.fullName,
        gender: data.gender,
        age: data.age,
        country: data.country,
        city: data.city,
        phone: data.phone,
        guardianName: data.guardianName || null,
        guardianPhone: data.guardianPhone || null,
        previousSchool: data.previousSchool || null,
        previousCity: data.previousCity || null,
        previousTeacher: data.previousTeacher || null,
        learningDuration: data.learningDuration || null,
        readingLevel: data.readingLevel || null,
        studiedTajweed: data.studiedTajweed,
        hasPreviousIjazah: data.hasPreviousIjazah,
        studiedRiwayat: data.studiedRiwayat || null,
        certificates: data.certificates || null,
        hasReadQuranByLooking: data.hasReadQuranByLooking,
        hasMemorizedQuran: data.hasMemorizedQuran,
        memorizationAmount: data.memorizationAmount || null,
        programId: data.programId || null,
        preferredTeacherId: data.preferredTeacherId || null,
        preferredDays: data.preferredDays || null,
        preferredTimeSlots: data.preferredTimeSlots || null,
        additionalNotes: data.additionalNotes || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ ok: true, requestNumber: created.requestNumber }, { status: 201 });
  } catch (err) {
    console.error('[registration]', err);
    return NextResponse.json({ error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}