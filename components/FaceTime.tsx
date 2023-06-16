import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { socket } from "@/context/socketUrl";
import { Peer } from "peerjs";

import Draggable from "react-draggable";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";

export default function FaceTime() {
  const router = useRouter();
  const { id: roomName } = router.query;
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const renderVideo = useRef<any>(null);
  const userVideoRef = useRef<any>(null);
  const [videoSources, setVideoSources] = useState<any>([]);

  const peer = new Peer({
    config: {
      iceServers: [
        { url: "stun:stun1.l.google.com:19302" },
        { url: "stun:stun2.l.google.com:19302" },
      ],
    },
  });

  // get user media
  useEffect(() => {
    peer.on("open", (id) => {
      socket.emit("joinUser", roomName, id);
    });

    peer.on("error", (error) => {
      console.error(error);
    });

    // Handle incoming voice/video connection
    peer.on("call", (call) => {
      // Answer the call with an A/V stream.
      call.answer();
      call.on("stream", (remoteStream) => {
        setVideoSources((videoSources) => {
          if (!videoSources.some((e) => e.id === call.peer)) {
            return [...videoSources, { id: call.peer, stream: remoteStream }];
          } else {
            return videoSources;
          }
        });
        //  Show stream in some video/canvas element.
        renderVideo.current.srcObject = remoteStream;
      });
    });

    socket.on("user-connected", (userId) => {
      // Call the new user
      if (userVideoRef.current.srcObject) {
        const call = peer.call(userId, userVideoRef.current.srcObject);

        // When they answer, add their video
        call.on("stream", (remoteStream) => {
          setVideoSources((videoSources) => {
            if (!videoSources.some((e) => e.id === userId)) {
              return [...videoSources, { id: userId, stream: remoteStream }];
            } else {
              return videoSources;
            }
          });

          //  Show stream in some video/canvas element.
          renderVideo.current.srcObject = remoteStream;
        });

        // If they leave, remove their video (doesn't work)
        call.on("close", () => {
          //  If the call gives an error
          call.on("error", (err) => {
            console.log(err);
          });
        });
      }
    });

    // If a user disconnect
    socket.on("user-disconnected", (userId) => {
      renderVideo.current.srcObject = null;
      setVideoSources((videoSources) => {
        return videoSources.filter((e) => e.id !== userId);
      });
    });

    return () => {
      socket.off("user-connected");
      socket.off("user-disconnected");
      peer.off("open");
      peer.off("call");
    };
  }, [cameraActive, renderVideo, roomName, userVideoRef]);

  function toggleMic() {
    setMicActive((prev) => !prev);

    if (micActive === false) {
      userVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
    } else {
      userVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  }

  const toggleCamera = async () => {
    if (!userVideoRef.current.srcObject) {
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          userVideoRef.current.srcObject = stream;
        })
    }

    if (cameraActive) {
      userVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
    } else {
      userVideoRef.current.srcObject.getVideoTracks()[0].enabled = true;
    }

    setCameraActive((prev) => !prev);
  };

  async function leave() {
    if (userVideoRef.current.srcObject) {
      await userVideoRef.current.srcObject.getTracks().forEach((track) => {
        console.log("before", track);
        track.stop();
        console.log("after", track);
      });
    }
    socket.emit("leaveRoom", roomName);
    peer.disconnect();
    await router.push("/");
  }

  return (
    <div className="h-screen p-2">
      <Draggable cancel="button" bounds="parent">
        <div className="cursor-grab flex flex-col justify-end items-end fixed bottom-16 right-4 space-y-10 box">
          <div className="flex flex-row ">
            <video
              ref={userVideoRef}
              className="w-40 bg-blue-100 rounded border-blue-400 mr-2 h-min"
              autoPlay
              muted
            />

            <video
              ref={renderVideo}
              className="w-40 bg-green-100 rounded border-green-400 mr-2 h-min"
              autoPlay
            />

            <div className="flex relative flex-col items-center justify-between pl-2">
              <button
                onClick={toggleMic}
                type="button"
                className="text-white bg-gradient-to-br from-teal-300  to-lime-300  hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2"
              >
                {micActive ? (
                  <MicIcon className="text-black" fontSize="medium" />
                ) : (
                  <MicOffIcon className="text-black" fontSize="medium" />
                )}
              </button>
              <button
                onClick={leave}
                type="button"
                className="font-medium rounded-lg text-sm text-center mr-2 mb-2"
              >
                <CallEndIcon className="text-secondary" fontSize="large" />
              </button>
              <button
                className="text-white bg-gradient-to-br from-teal-300  to-lime-300  hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-2 py-2 text-center mr-2 mb-2"
                onClick={toggleCamera}
                type="button"
              >
                {cameraActive ? (
                  <VideocamIcon className="text-black" fontSize="medium" />
                ) : (
                  <VideocamOffIcon className="text-black" fontSize="medium" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
}
