"use client";
import { useEffect, useState } from "react";
import { LiveKitRoom, AudioConference, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { useSession } from "next-auth/react";

export const dynamic = 'force-dynamic'; // السطر ده مهم جداً عشان البناء

export default function LiveRoomPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState("");
  const [room] = useState("quran-room-1");

  useEffect(() => {
    if (!session) return;
    
    (async () => {
      try {
        const resp = await fetch(`/api/livekit/token?room=${room}`);
        const data = await resp.json();
        if (data.token) setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [session, room]);

  if (!session) return <div className="p-8 text-center text-red-600 font-bold">يجب تسجيل الدخول للانضمام للغرفة. <a href="/login" className="underline">اضغط هنا</a></div>;
  if (!token) return <div className="p-8 text-center text-blue-900 font-bold">جاري تجهيز الغرفة الصوتية...</div>;

  return (
    <main className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl mb-6 font-bold">غرفة التسميع المباشر</h1>
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
        <LiveKitRoom
          video={false}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          onDisconnected={() => setToken("")}
          data-lk-theme="default"
        >
          <AudioConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
      <p className="text-gray-400 text-sm mt-4">تأكد من السماح للمتصفح باستخدام الميكروفون.</p>
    </main>
  );
}