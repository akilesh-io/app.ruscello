// create a video player using hls.js than can play local video on drag and drop using tailwindcss and react-dropzone.

import React, { useRef, useState } from 'react'
import ReactPlayer from 'react-player'

import { useEffect } from 'react'
import io from 'socket.io-client'

let socket

export default function Video({ videoFilePath }) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    socketInitializer()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-playing', (playing) => {
      setPlaying(playing)
    })
  }

  function toggle(e) {
    setPlaying(e)
    socket.emit('setPlaying', e)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div onClick={() => toggle(!playing)}>
        <ReactPlayer
          url={videoFilePath}          
          //controls={true}
          playing={playing}
        />
      </div>
    </div>
  )
}
