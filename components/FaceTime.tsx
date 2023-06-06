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
  const [cameraActive, setCameraActive] = useState(true);
  const renderVideo = useRef<any>(null);
  const userVideoRef = useRef<any>();
  const [videoSources, setVideoSources] = useState<any>([]);
  //let myVideoStream = { id: socket.id, stream: userVideoRef.current.srcObject };

  const peer = new Peer();

  
  // get user media
  useEffect(() => {
    const userMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        userVideoRef.current.srcObject = stream;
      } catch (err) {
        console.log("Failed to get local stream" + err);
      }
    };
    userMedia();

    peer.on("open", (id) => {
      //console.log("My peer ID is: " + id);
      //myVideoStream.id = id;
      socket.emit("joinUser", roomName, id);
    });

    peer.on("error", (error) => {
      console.error(error);
    });

    // Handle incoming voice/video connection
    peer.on("call", (call) => {
      const getRemoteMedia = async () => {
        try {
          const remoteStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          // Answer the call with an A/V stream.
          call.answer(remoteStream);
          call.on("stream", (remoteStream) => {
            setVideoSources((videoSources) => {
              if (!videoSources.some((e) => e.id === call.peer)) {
                return [
                  ...videoSources,
                  { id: call.peer, stream: remoteStream },
                ];
              } else {
                return videoSources;
              }
            });
            //  Show stream in some video/canvas element.
            renderVideo.current.srcObject = remoteStream;
          });
        } catch (err) {
          console.log("Failed to get local stream" + err);
        }
      };
      getRemoteMedia();
    });

    socket.on("user-connected", (userId) => {
      // Call the new user
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
        renderVideo.current.srcObject = remoteStream;
      });

      // If they leave, remove their video (doesn't work)
      call.on("close", () => {
        //  If the call gives an error
        call.on("error", (err) => {
          console.log(err);
        });
      });
    });

    // If a user disconnect
    socket.on("user-disconnected", (userId) => {
      renderVideo.current.srcObject = null;
    });

    return () => {
      socket.off("user-connected");
      socket.off("user-disconnected");
      peer.off("open");
      peer.off("call");
    };
  }, []);

  function toggleMic() {
    setMicActive((prev) => !prev);

    if (micActive) {
      userVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
    }
    if (!micActive) {
      userVideoRef.current.srcObject.getAudioTracks()[0].enabled = true;
    }
  }

  const toggleCamera = () => {
    setCameraActive((prev) => !prev);

    if (cameraActive) {
      userVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
    }
    if (!cameraActive) {
      userVideoRef.current.srcObject.getVideoTracks()[0].enabled = true;
    }
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
      <Draggable bounds="parent" defaultClassName="z-20">
        <div className="cursor-grab flex flex-col justify-end items-end fixed bottom-16 right-4 space-y-10">
          <div className="flex flex-row ">
            <video
              ref={userVideoRef}
              className="w-40 bg-blue-100 rounded border-blue-400 mr-2"
              autoPlay
              muted
            />

            <video
              ref={renderVideo}
              className="w-40 bg-green-100 rounded border-green-400"
              autoPlay
            />
          </div>
        </div>
      </Draggable>
      <div className="flex flex-row justify-center items-center fixed bottom-0 w-full space-x-10 z-20">
        <button
          onClick={toggleMic}
          type="button"
          className="text-white bg-gradient-to-br from-teal-300  to-lime-300  hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          {micActive ? (
            <MicIcon className="text-black" fontSize="medium" />
          ) : (
            <MicOffIcon className="text-black" fontSize="medium" />
          )}
        </button>
        <button onClick={leave} type="button">
          <CallEndIcon className="text-secondary" fontSize="large" />
        </button>
        <button
          className="text-white bg-gradient-to-br from-teal-300  to-lime-300  hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
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
  );
}
