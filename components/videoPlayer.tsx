import React, { useContext } from 'react'

import { SocketContext } from '../pages/Context'

const VideoPlayer = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
  } = useContext(SocketContext)

  return (
    <div className="justify-center">
      {stream && (
        <div className="shadow-lg">
          {/* Grid 1 */}
          <div className="grid grid-cols-1 gap-2">
            <h2 className="mt-2 text-lg font-semibold leading-8 tracking-tight text-indigo-600 sm:text-4xl">
              {name || 'Name'}
            </h2>

            <video playsInline muted ref={myVideo} autoPlay className="w-48" />
          </div>
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className="shadow-lg">
          {/* Grid 2 */}
          <div className="grid grid-cols-1 gap-2">
            <h2 className="mt-2 text-lg font-semibold leading-8 tracking-tight text-indigo-600 sm:text-4xl">
              {call.name || 'Name'}
            </h2>
            <video playsInline ref={userVideo} autoPlay className="w-48" />
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
