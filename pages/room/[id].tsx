import Layout from "@/components/layout";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { socket } from "@/context/socketUrl";
import { useRouter } from "next/router";
import screenfull from "screenfull";
import FeedbackModal from "@/components/Feedback";
import CopyUrl from "@/components/CopyUrl";
import { Toaster, toast } from 'sonner';

const FaceTime = dynamic(() => import("@/components/FaceTime"), { ssr: false });
const FileUpload = dynamic(() => import("@/components/FileUpload"));

export default function Room() {
  const router = useRouter();
  const videoAndFace = useRef<any>(null);
  const videoAlone = useRef<any>(null);

  const { id: roomName } = router.query;

  useEffect(() => {
    socket.emit("join", { room: roomName, socketId: socket.io.engine.id });
    // prevent space bar from scrolling this page down 
    window.onkeydown = function (e) {
      return !(e.keyCode == 32);
    };
  }, [roomName]);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = () => {
    socket.on("new", (data) => {
      toast.success("New user joined");
    });

    socket.on("user-disconnected", (data) => {
      toast.error("User disconnected");
    });
  }

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
      {/* <FeedbackModal /> */}
      <CopyUrl />

      <div>
        <div ref={videoAndFace}>
          <div ref={videoAlone}>
            <FileUpload />
          </div>
        </div>
        {/* <FaceTime /> */}
        <Toaster />

      </div>
    </Layout>
  );
}
