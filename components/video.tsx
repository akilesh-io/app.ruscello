// create a video player using hls.js than can play local video on drag and drop using tailwindcss and react-dropzone.

import React, { useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Container } from '@material-ui/core'

import { useEffect } from 'react'
import io from 'socket.io-client'

import Control from '@/components/Control'
import { formatTime } from '@/components/format'

import styles from '@/styles/Video.module.css'

let socket
let count = 0

export default function Video({ videoFilePath }) {
  //const [playing, setPlaying] = useState(false)

  const videoPlayerRef = useRef<any>(null)
  const controlRef = useRef<any>(null)

  const [videoState, setVideoState] = useState({
    playing: true,
    muted: false,
    volume: 0.5,
    played: 0,
    seeking: false,
    buffer: true,
  })

  //Destructuring the properties from the videoState
  const { playing, muted, volume, played, seeking, buffer } = videoState

  const currentTime = videoPlayerRef.current
    ? videoPlayerRef.current.getCurrentTime()
    : '00:00'
  const duration = videoPlayerRef.current
    ? videoPlayerRef.current.getDuration()
    : '00:00'

  const formatCurrentTime = formatTime(currentTime)
  const formatDuration = formatTime(duration)

  const playPauseHandler = () => {
    //plays and pause the video (toggling)
    setVideoState({ ...videoState, playing: !videoState.playing })
  }

  const rewindHandler = () => {
    //Rewinds the video player reducing 5
    videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() - 5)
  }

  const handleFastFoward = () => {
    //FastFowards the video player by adding 10
    videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() + 10)
  }

  //console.log("========", (controlRef.current.style.visibility = "false"));
  const progressHandler = (state) => {
    if (count > 3) {
      console.log('close')
      controlRef.current.style.visibility = 'hidden' // toggling player control container
    } else if (controlRef.current.style.visibility === 'visible') {
      count += 1
    }

    if (!seeking) {
      setVideoState({ ...videoState, ...state })
    }
  }

  const seekHandler = (e, value) => {
    setVideoState({ ...videoState, played: parseFloat(value) / 100 })
    videoPlayerRef.current.seekTo(parseFloat(value) / 100)
  }

  const seekMouseUpHandler = (e, value) => {
    console.log(value)

    setVideoState({ ...videoState, seeking: false })
    videoPlayerRef.current.seekTo(value / 100)
  }

  const volumeChangeHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: Number(newVolume) === 0 ? true : false, // volume === 0 then muted
    })
  }

  const volumeSeekUpHandler = (e, value) => {
    const newVolume = parseFloat(value) / 100

    setVideoState({
      ...videoState,
      volume: newVolume,
      muted: newVolume === 0 ? true : false,
    })
  }

  const muteHandler = () => {
    //Mutes the video player
    setVideoState({ ...videoState, muted: !videoState.muted })
  }

  const onSeekMouseDownHandler = (e) => {
    setVideoState({ ...videoState, seeking: true })
  }

  const mouseMoveHandler = () => {
    controlRef.current.style.visibility = 'visible'
    count = 0
  }

  const bufferStartHandler = () => {
    console.log('Bufering.......')
    setVideoState({ ...videoState, buffer: true })
  }

  const bufferEndHandler = () => {
    console.log('buffering stoped ,,,,,,play')
    setVideoState({ ...videoState, buffer: false })
  }

  useEffect(() => {
    socketInitializer()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const socketInitializer = () => {
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-playing', (playing) => {
      // setPlaying(playing)
    })
  }

  // ------------------ pauser & play socket ------------------
  function toggle(e) {
    // setPlaying(e)
    socket.emit('setPlaying', e)
  }

  return (
    // <div className="video_container">
      <div className="flex flex-col items-center justify-center w-full min-h-screen py-2">
        {/* <div onClick={() => toggle(!playing)}> */}
        <Container maxWidth="md" className="relative">
          <div className="relative" onMouseMove={mouseMoveHandler}>
            <ReactPlayer
              className={styles.player}
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

            <Control
              controlRef={controlRef}
              onPlayPause={playPauseHandler}
              playing={playing}
              onRewind={rewindHandler}
              onForward={handleFastFoward}
              played={played}
              onSeek={seekHandler}
              onSeekMouseUp={seekMouseUpHandler}
              volume={volume}
              onVolumeChangeHandler={volumeChangeHandler}
              onVolumeSeekUp={volumeSeekUpHandler}
              mute={muted}
              onMute={muteHandler}
              duration={formatDuration}
              currentTime={formatCurrentTime}
              onMouseSeekDown={onSeekMouseDownHandler}
            />
          </div>
        </Container>
      </div>
  )
}
