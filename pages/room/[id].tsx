import Layout from "@/components/layout";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { socket } from "@/context/socketUrl";
import { useRouter } from "next/router";

const FaceTime = dynamic(() => import("@/components/FaceTime"), { ssr: false });
const FileUpload = dynamic(() => import("@/components/FileUpload"));
const YTPlayer = dynamic(() => import("@/components/YouTube"));

export default function Room() {
  const router = useRouter();
  const { id: roomName } = router.query;
  const [youtube, youtubeActive] = useState(false);

  useEffect(() => {
    socket.emit("join", { room: roomName, socketId: socket.io.engine.id });
  }, [roomName]);

  function toggleActive() {
    youtubeActive((prev) => !prev);
  }

  return (
    <Layout>
      <div className="m-2 top-0 left-0">
        <button
          onClick={toggleActive}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Toggle
        </button>
      </div>

      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full">
          {youtube ? <FileUpload /> : <YTPlayer />}
        </div>

        <FaceTime />
      </div>
    </Layout>
  );
}
