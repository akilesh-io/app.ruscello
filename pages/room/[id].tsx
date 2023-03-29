import Layout from "@/components/layout";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { socket } from "@/context/socketUrl";
import { useRouter } from "next/router";

const VideoCall = dynamic(() => import("@/components/VideoCall"));
const FileUpload = dynamic(() => import("@/components/FileUpload"));

//import styles from '@/styles/VideoCall.module.css'
export default function Room() {

  const router = useRouter();
  const { id: roomName } = router.query;

  useEffect(() => {
    socket.emit("join", { room: roomName, socketId: socket.io.engine.id });
  }, [roomName]);

  return (
    <Layout>
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full">
          <FileUpload />
        </div>

        <VideoCall />
      </div>
    </Layout>
  );
}
