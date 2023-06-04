import Layout from "@/components/layout";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { socket } from "@/context/socketUrl";
import { useRouter } from "next/router";
import screenfull from "screenfull";
import CopyUrl from "@/components/CopyUrl";
import FeedbackModal from "@/components/Feedback";

const FaceTime = dynamic(() => import("@/components/FaceTime"), { ssr: false });
const FileUpload = dynamic(() => import("@/components/FileUpload"));

export default function Room() {
  const router = useRouter();
  const videoAndFace = useRef<any>(null);
  const videoAlone = useRef<any>(null);

  const { id: roomName } = router.query;

  useEffect(() => {
    socket.emit("join", { room: roomName, socketId: socket.io.engine.id });
  }, [roomName]);

  function callVideoAndFace() {
    if (screenfull.isEnabled) {
      screenfull.toggle(videoAndFace.current);
    }
  }

  function callVideoAlone() {
    if (screenfull.isEnabled) {
      screenfull.toggle(videoAlone.current);
    }
  }

  return (
    <Layout>
      <FeedbackModal />
      <div>
        <div className="w-full h-full relative z-10" ref={videoAndFace}>
          <div ref={videoAlone}>
            <FileUpload />
          </div>
          <CopyUrl />
        </div>
        <FaceTime />
      </div>
    </Layout>
  );
}
