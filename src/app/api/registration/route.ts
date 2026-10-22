import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { password, ...data } = body;

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({ where: { phone: data.phone } });
    if (existingUser) {
      return NextResponse.json({ error: "رقم الهاتف مسجل بالفعل. يرجى الدخول." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const requestNumber = `REQ-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: data.phone,
          email: `student_${data.phone}@aljazari.local`,
          fullName: data.fullName,
          passwordHash: hashedPassword,
          role: "STUDENT",
        }
      });

      await tx.registrationRequest.create({
        data: {
          ...data,
          requestNumber,
          status: 'PENDING',
          userId: user.id,
        }
      });
    });

    return NextResponse.json({ ok: true, requestNumber }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}