import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { socket } from "@/context/socketUrl";

import Draggable from "react-draggable";

import styles from "@/styles/VideoCall.module.css";

import Mic from "@/public/svg/mic.svg";
import MicOff from "@/public/svg/mic off.svg";
import VideoCam from "@/public/svg/videocam.svg";
import VideoCamOff from "@/public/svg/videocam off.svg";
import CallEnd from "@/public/svg/call end.svg";

const FaceTime = () => {
  const router = useRouter();
  const { id: roomName } = router.query;
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);

  function toggleMic() {
    setMicActive((prev) => !prev);
  }

  const toggleCamera = () => {
    setCameraActive((prev) => !prev);
  };

  function leave() {
    router.push("/");
  }

  return (
    <div className={styles.container}>
      <Draggable bounds="parent">
        <div className="cursor-grab flex flex-col justify-end items-end fixed bottom-2 right-4 space-y-10">
          <div className="flex flex-row ">
            <video
              id="localVideo"
              className="w-40 bg-blue-100 rounded border-blue-400 mr-2"
              autoPlay
              muted
            />

            <video
              id="remoteVideo"
              className="w-40 bg-green-100 rounded border-green-400"
              autoPlay
            />
          </div>
        </div>
      </Draggable>

      <div className="flex flex-row justify-center items-center fixed bottom-0 w-full space-x-10">
        <button onClick={toggleMic} type="button">
          {micActive ? (
            <Image src={Mic} alt="Mic-on" />
          ) : (
            <Image src={MicOff} alt="Mic-off" />
          )}
        </button>
        <button onClick={leave} type="button">
          <Image src={CallEnd} alt="Call-end" />
        </button>
        <button onClick={toggleCamera} type="button">
          {cameraActive ? (
            <Image src={VideoCam} alt="Cam-on" />
          ) : (
            <Image src={VideoCamOff} alt="Cam-off" />
          )}
        </button>
      </div>
    </div>
  );
};

export default FaceTime;
