import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor";
import { useEffect, useState } from "react";
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
import Call from "@/public/svg/call.svg";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

const FaceTime = () => {
  const router = useRouter();
  const { id: roomName } = router.query;
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [reRender, setReRender] = useState(true);
  const forceUpdate = useForceUpdate();
  // function toggleMic() {
  //   setMicActive((prev) => !prev);
  // }

  // const toggleCamera = () => {
  //   console.log(webRTCAdaptor.mediaManager.cameraEnabled);
  //   if (webRTCAdaptor.mediaManager.cameraEnabled) {
  //     webRTCAdaptor.turnOffLocalCamera(roomName);
  //     setCameraActive(false);
  //     console.log("1");
  //   } else {
  //     webRTCAdaptor.turnOnLocalCamera(roomName);
  //     setCameraActive(true);
  //     console.log("2");
  //   }
  // };

  function join() {
    webRTCAdaptor.join(roomName);
    console.log("🚀 ~ file: faceTime.tsx:33 ~ join ~ roomName:", roomName);
  }

  function leave() {
    socket.emit("leave", roomName); // Let's the server know that user has left the room.
    webRTCAdaptor.leave(roomName);
    router.push("/");
  }

  function turnOffLocalCamera() {
    webRTCAdaptor.turnOffLocalCamera(roomName);
    setCameraActive(false);
  }

  function turnOnLocalCamera() {
    webRTCAdaptor.turnOnLocalCamera(roomName);
    setCameraActive(true);
  }

  function muteLocalMic() {
    webRTCAdaptor.muteLocalMic();
    setMicActive(false);
  }

  function unmuteLocalMic() {
    webRTCAdaptor.unmuteLocalMic();
    setMicActive(true);
  }

  //----------------------------------
  var pc_config = {
    iceServers: [
      {
        urls: "stun:stun1.l.google.com:19302",
      },
    ],
  };

  var sdpConstraints = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
  };
  var mediaConstraints = {
    video: true,
    audio: true,
  };

  var webRTCAdaptor = new WebRTCAdaptor({
    websocket_url: "wss://ant.akilesh.io:5443/Ruscello/websocket",
    mediaConstraints: mediaConstraints,
    peerconnection_config: pc_config,
    sdp_constraints: sdpConstraints,
    localVideoId: "localVideo",
    remoteVideoId: "remoteVideo",
    callback: function (info) {
      if (info == "initialized") {
        console.log("initialized");
      } else if (info == "joined") {
        //joined the stream
        // chech if the camera is on or off
        if (webRTCAdaptor.mediaManager.cameraEnabled) {
          setCameraActive(true);
          console.log(cameraActive);
        } else {
          setCameraActive(false);
          console.log(cameraActive);
        }
        console.log("joined");
      } else if (info == "leaved") {
        //leaved the stream
        console.log("leaved");
        forceUpdate();
      }
    },
    callbackError: function (error) {
      //some of the possible errors, NotFoundError, SecurityError,PermissionDeniedError

      console.log("error callback: " + error);
      //alert(error);
    },
  });
  // call a function after all the components have been rendered rather than using useEffect

  return (
    //---------------
    <div className={styles.container}>
      <Draggable bounds="parent">
        <div className="flex flex-col justify-end items-end fixed bottom-2 right-4 space-y-10">
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
        {micActive ? (
          <button onClick={muteLocalMic} type="button">
            <Image src={MicOff} alt="Mic-off" />
          </button>
        ) : (
          <button onClick={unmuteLocalMic} type="button">
            <Image src={Mic} alt="Mic-on" />
          </button>
        )}

        <button onClick={leave} type="button">
          <Image src={CallEnd} alt="Call-end" />
        </button>

        <button onClick={join} type="button">
          <Image src={Call} alt="Call" />
        </button>

        {cameraActive ? (
          <button onClick={turnOffLocalCamera} type="button">
            <Image src={VideoCamOff} alt="Cam-off" />
          </button>
        ) : (
          <button onClick={turnOnLocalCamera} type="button">
            <Image src={VideoCam} alt="Cam-on" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceTime;

//-----------------------------

{
  /* 
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

*/
}
