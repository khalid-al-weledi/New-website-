"use client";
import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function LiveRoomPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get("room") || "default-room";
    setRoom(roomId);

    if (!session) return;
    
    (async () => {
      try {
        const resp = await fetch(`/api/livekit/token?room=${roomId}`);
        const data = await resp.json();
        if (data.token) setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [session]);

  if (!session) return <div className="p-8 text-center text-red-600 font-bold">يجب تسجيل الدخول للانضمام. <Link href="/login" className="underline">اضغط هنا</Link></div>;
  if (!token) return <div className="p-8 text-center text-blue-900 font-bold">جاري تجهيز غرفة البث...</div>;

  return (
    <main className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl mb-6 font-bold">غرفة البث المباشر</h1>
      <div className="w-full max-w-5xl h-[75vh] bg-white rounded-2xl shadow-lg overflow-hidden">
        <LiveKitRoom
          video={true} // تفعيل الكاميرا
          audio={true} // تفعيل المايك
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          onDisconnected={() => setToken("")}
          data-lk-theme="default"
          className="h-full"
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
      <p className="text-gray-400 text-sm mt-4">تأكد من السماح للمتصفح باستخدام الكاميرا والميكروفون.</p>
    </main>
  );
}