import Layout from "@/components/layout";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { socket } from "@/context/socketUrl";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import screenfull from "screenfull";

const FaceTime = dynamic(() => import("@/components/FaceTime"), { ssr: false });
const FileUpload = dynamic(() => import("@/components/FileUpload"));

export default function Room() {
  const router = useRouter();
  const videoAndFace = useRef<any>(null);
  const videoAlone = useRef<any>(null);

  const fullPath =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://app-ruscello.vercel.app";

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
      <div className="m-2 top-0 left-0">
        <CopyToClipboard text={fullPath + router.asPath}>
          <ContentCopyIcon fontSize="large" />
        </CopyToClipboard>
      </div>
        <div className="w-full h-full" ref={videoAndFace}>
          <div className="top-0 left-0 w-full h-full" ref={videoAlone}>
            <FileUpload />
          </div>
          <FaceTime />
        </div>
    </Layout>
  );
}
