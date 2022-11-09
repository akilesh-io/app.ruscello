import React, { useContext } from 'react'

import { SocketContext } from '../pages/Context'

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext)

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <button
            className="flex w-52 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-3 md:px-10 md:text-lg"
            onClick={answerCall}
          >
            Answer
          </button>
        </div>
      )}
    </>
  )
}

export default Notifications
