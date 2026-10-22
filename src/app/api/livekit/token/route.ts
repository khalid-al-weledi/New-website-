import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room") || "default-room";
    const username = session.user.name || "Anonymous";
    const identity = session.user.id || `user-${Date.now()}`;

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "إعدادات LiveKit غير مكتملة" }, { status: 500 });
    }

    // إنشاء تذكرة الدخول
    const at = new AccessToken(apiKey, apiSecret, {
      identity: identity,
      name: username,
      ttl: "2h", // صلاحية التذكرة ساعتين
    });

    at.addGrant({ roomJoin: true, room: room, canPublish: true, canSubscribe: true });

    return NextResponse.json({ token: at.toJwt() });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "فشل إنشاء تذكرة الدخول" }, { status: 500 });
  }
}