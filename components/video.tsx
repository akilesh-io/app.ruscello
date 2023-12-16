// create a video player using hls.js than can play local video on drag and drop using tailwindcss and react-dropzone.

import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import screenfull from "screenfull";

import Control from "@/components/Control";
import { formatTime } from "@/components/format";
import { socket } from "@/context/socketUrl";

let count = 0;

export default function Video({ videoFilePath }) {
  const videoPlayerRef = useRef<any>(null);
  const controlRef = useRef<any>(null);
  const router = useRouter();
  const videoAndControl = useRef<any>(null);
  const { id: roomName } = router.query;
  const [videoState, setVideoState] = useState({
    playing: false,
    muted: false,
    volume: 1,
    played: 0,
    seeking: false,
    buffer: true,
    fullScreen: false,
  });

  //Destructuring the properties from the videoState
  const { playing, muted, volume, played, seeking, fullScreen } = videoState;

  const currentTime = videoPlayerRef.current
    ? videoPlayerRef.current.getCurrentTime()
    : "00:00";
  const duration = videoPlayerRef.current
    ? videoPlayerRef.current.getDuration()
    : "00:00";

  const formatCurrentTime = formatTime(currentTime);
  const formatDuration = formatTime(duration);

  const playPauseHandler = () => {
    //plays and pause the video (toggling)
    setVideoState({ ...videoState, playing: !videoState.playing });
    socket.emit("playPause", playing, { room: roomName });
  };

  const rewindHandler = () => {
    //Rewinds the video player reducing 5
    videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() - 5);

    socket.emit("Winds", videoPlayerRef.current.getCurrentTime() - 5, {
      room: roomName,
    });
  };

  const handleFastFoward = () => {
    //FastFowards the video player by adding 10
    videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() + 10);

    socket.emit("Winds", videoPlayerRef.current.getCurrentTime() + 10, {
      room: roomName,
    });
  };

  //console.log("========", (controlRef.current.style.visibility = "false"));
  const progressHandler = (state) => {
    if (count > 0.5) {
      //2
      console.log("close");
      controlRef.current.style.visibility = "hidden"; // toggling player control container
    } else if (controlRef.current.style.visibility === "visible") {
      count += 1; //1
    }

    if (!seeking) {
      setVideoState({ ...videoState, ...state });
    }
  };

  const seekHandler = (e, value) => {
    setVideoState({ ...videoState, played: parseFloat(value) / 100 });
    videoPlayerRef.current.seekTo(parseFloat(value) / 100);

    socket.emit("videoSeek", value, { room: roomName });

    //videoState
  };

  const seekMouseUpHandler = (e, value) => {
    setVideoState({ ...videoState, seeking: false });
    videoPlayerRef.current.seekTo(value / 100);
  };

  const volumeChangeHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
      //muted: newVolume === 0 ? true : false,
    });
  };

  const volumeSeekUpHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100;

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: newVolume === 0 ? true : false,
    });
  };

  const muteHandler = () => {
    //Mutes the video player
    setVideoState({ ...videoState, muted: !videoState.muted });
  };

  const onSeekMouseDownHandler = (e) => {
    setVideoState({ ...videoState, seeking: true });
  };

  const mouseMoveHandler = () => {
    controlRef.current.style.visibility = "visible";
    count = 0;
  };

  const bufferStartHandler = () => {
    console.log("Bufering.......");
    setVideoState({ ...videoState, buffer: true });
  };

  const bufferEndHandler = () => {
    console.log("buffering stoped ,,,,,,play");
    setVideoState({ ...videoState, buffer: false });
  };

  const syncVideoHandler = () => {
    const currentTime = videoPlayerRef.current.getCurrentTime();
    socket.emit("syncVideo", currentTime, { room: roomName });
  };
  useEffect(() => {
    socketInitializer();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const socketInitializer = () => {
    socket.on("updatePlayPause", (data) => {
      setVideoState({ ...videoState, playing: !data });
    });

    socket.on("updateSeek", (videoState) => {
      videoPlayerRef.current.seekTo(parseFloat(videoState) / 100);
    });

    socket.on("updateWinds", (videoState) => {
      videoPlayerRef.current.seekTo(parseFloat(videoState));
    });

    socket.on("updateVideo", (currentTime) => {
      videoPlayerRef.current.seekTo(currentTime);
    });
  };

  function handleClickFullscreen() {
    if (screenfull.isEnabled) {
      setVideoState({ ...videoState, fullScreen: !videoState.fullScreen });
    }
    screenfull.toggle(videoAndControl.current);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-2">
      <div ref={videoAndControl} className="relative">
        <div
          className={videoState.fullScreen ? 'h-full': 'md:max-w-screen-lg xl:max-w-screen-lg 2xl:max-w-screen-xl h-full' }
          onMouseMove={mouseMoveHandler}
        >
            <ReactPlayer
              className="object-cover p-0 m-0 pointer-events-none"
              ref={videoPlayerRef}
              url={videoFilePath}
              width="100%"
              height="100%"
              playing={playing}
              volume={volume}
              muted={muted}
              onProgress={progressHandler}
              onBuffer={bufferStartHandler}
              onBufferEnd={bufferEndHandler}
            />
          <div className="object-cover p-0 m-0">
            <Control
              onPlayPause={playPauseHandler}
              playing={playing}
              onRewind={rewindHandler}
              onForward={handleFastFoward}
              played={played}
              onSeek={seekHandler}
              onSeekMouseUp={seekMouseUpHandler}
              onVolumeChangeHandler={volumeChangeHandler}
              onVolumeSeekUp={volumeSeekUpHandler}
              volume={volume}
              mute={muted}
              onMute={muteHandler}
              duration={formatDuration}
              currentTime={formatCurrentTime}
              onMouseSeekDown={onSeekMouseDownHandler}
              fullScreen={fullScreen}
              handleClickFullscreen={handleClickFullscreen}
              controlRef={controlRef}
              onSync={syncVideoHandler}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
