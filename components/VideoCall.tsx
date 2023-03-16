import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

import Draggable from 'react-draggable'

import useSocket from '@/hooks/useSocket'
import FileUpload from '@/components/FileUpload'

import styles from '@/styles/VideoCall.module.css'

const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
  ],
}

const VideoCall = () => {
  useSocket()
  const [micActive, setMicActive] = useState(true)
  const [cameraActive, setCameraActive] = useState(true)

  const router = useRouter()
  const userVideoRef = useRef<any>(null)
  const peerVideoRef = useRef<any>(null)
  const rtcConnectionRef = useRef<any>(null)
  const socketRef = useRef<any>(null)
  const userStreamRef = useRef<any>()
  const hostRef = useRef<any>(false)

  const { id: roomName } = router.query

  useEffect(() => {
    socketRef.current = io()

    // First we join a room
    socketRef.current.emit('join', roomName)

    socketRef.current.on('joined', handleRoomJoined)
    // If the room didn't exist, the server would emit the room was 'created'
    socketRef.current.on('created', handleRoomCreated)
    // Whenever the next person joins, the server emits 'ready'
    socketRef.current.on('ready', initiateCall)

    // Emitted when a peer leaves the room
    socketRef.current.on('leave', onPeerLeave)

    // If the room is full, we show an alert
    socketRef.current.on('full', () => {
      window.location.href = '/'
    })

    // Event called when a remote user initiating the connection and
    socketRef.current.on('offer', handleReceivedOffer)
    socketRef.current.on('answer', handleAnswer)
    socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg)

    // clear up after
    return () => socketRef.current.disconnect()
  }, [roomName]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 500, height: 500 },
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream
        userVideoRef.current.srcObject = stream
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current.play()
        }
        socketRef.current.emit('ready', roomName)
      })
      .catch((err) => {
        /* handle the error */
        console.log('error', err)
      })
  }

  const handleRoomCreated = () => {
    hostRef.current = true
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 500, height: 500 },
      })
      .then((stream) => {
        /* use the stream */
        userStreamRef.current = stream
        userVideoRef.current.srcObject = stream
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current.play()
        }
      })
      .catch((err) => {
        /* handle the error */
        console.log(err)
      })
  }

  const initiateCall = () => {
    if (hostRef.current) {
      rtcConnectionRef.current = createPeerConnection()
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[0],
        userStreamRef.current,
      )
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[1],
        userStreamRef.current,
      )
      rtcConnectionRef.current
        .createOffer()
        .then((offer) => {
          rtcConnectionRef.current.setLocalDescription(offer)
          socketRef.current.emit('offer', offer, roomName)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const onPeerLeave = () => {
    // This person is now the creator because they are the only person in the room.
    hostRef.current = true
    if (peerVideoRef.current.srcObject) {
      peerVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop()) // Stops receiving all track of Peer.
    }

    // Safely closes the existing connection established with the peer who left.
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null
      rtcConnectionRef.current.onicecandidate = null
      rtcConnectionRef.current.close()
      rtcConnectionRef.current = null
    }
  }

  /**
   * Takes a userid which is also the socketid and returns a WebRTC Peer
   *
   * @param  {string} userId Represents who will receive the offer
   * @returns {RTCPeerConnection} peer
   */

  const createPeerConnection = () => {
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(ICE_SERVERS)

    // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
    connection.onicecandidate = handleICECandidateEvent

    // We implement our onTrack method for when we receive tracks
    connection.ontrack = handleTrackEvent
    return connection
  }

  const handleReceivedOffer = (offer) => {
    if (!hostRef.current) {
      rtcConnectionRef.current = createPeerConnection()
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[0],
        userStreamRef.current,
      )
      rtcConnectionRef.current.addTrack(
        userStreamRef.current.getTracks()[1],
        userStreamRef.current,
      )
      rtcConnectionRef.current.setRemoteDescription(offer)

      rtcConnectionRef.current
        .createAnswer()
        .then((answer) => {
          rtcConnectionRef.current.setLocalDescription(answer)
          socketRef.current.emit('answer', answer, roomName)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  const handleAnswer = (answer) => {
    rtcConnectionRef.current
      .setRemoteDescription(answer)
      .catch((err) => console.log(err))
  }

  const handleICECandidateEvent = (event) => {
    if (event.candidate) {
      socketRef.current.emit('ice-candidate', event.candidate, roomName)
    }
  }

  const handlerNewIceCandidateMsg = (incoming) => {
    // We cast the incoming candidate to RTCIceCandidate
    const candidate = new RTCIceCandidate(incoming)
    rtcConnectionRef.current
      .addIceCandidate(candidate)
      .catch((e) => console.log(e))
  }

  const handleTrackEvent = (event) => {
    // eslint-disable-next-line prefer-destructuring
    peerVideoRef.current.srcObject = event.streams[0]
  }

  const toggleMediaStream = (type, state) => {
    userStreamRef.current.getTracks().forEach((track) => {
      if (track.kind === type) {
        // eslint-disable-next-line no-param-reassign
        track.enabled = !state
      }
    })
  }

  const toggleMic = () => {
    toggleMediaStream('audio', micActive)
    setMicActive((prev) => !prev)
  }

  const toggleCamera = () => {
    toggleMediaStream('video', cameraActive)
    setCameraActive((prev) => !prev)
  }

  const leaveRoom = () => {
    socketRef.current.emit('leave', roomName) // Let's the server know that user has left the room.

    if (userVideoRef.current.srcObject) {
      userVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop()) // Stops receiving all track of User.
    }
    if (peerVideoRef.current.srcObject) {
      peerVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop()) // Stops receiving audio track of Peer.
    }

    // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null
      rtcConnectionRef.current.onicecandidate = null
      rtcConnectionRef.current.close()
      rtcConnectionRef.current = null
    }
    router.push('/')
  }

  return (
    // create a inline css

    <div className={styles.container}>
      <div>
        <FileUpload />
      </div>

      {/* bottom allign right */}
      <Draggable bounds="parent">
        <div className="flex flex-col justify-end items-end fixed bottom-0 right-0 space-y-10">
          {/* Align video side by side */}
          <div className="flex flex-row justify-center items-center">
            <video
              className="w-72 bg-blue-100 rounded border-blue-400"
              autoPlay
              muted
              ref={userVideoRef}
            />
            <video
              className="w-72 bg-green-100 rounded border-green-400"
              autoPlay
              ref={peerVideoRef}
            />
          </div>
        </div>
      </Draggable>

      {/* Align buttons in center bottom fixed */}
      <div className=" flex flex-row justify-center items-center fixed bottom-0 w-full space-x-10">
        <button onClick={toggleMic} type="button">
          {micActive ? 'Mute' : 'UnMute'}
        </button>
        <button onClick={leaveRoom} type="button">
          Leave
        </button>
        <button onClick={toggleCamera} type="button">
          {cameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>
    </div>
  )
}

export default VideoCall
