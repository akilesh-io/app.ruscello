import React, { useState, useContext } from 'react'
import dynamic from 'next/dynamic'
//import { Button, Grid, Container, Paper } from '@material-ui/core'
//import { CopyToClipboard } from 'react-copy-to-clipboard'
//import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons'

import { SocketContext } from '../pages/Context'

const Sidebar = ({ children }) => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
  } = useContext(SocketContext)
  const [idToCall, setIdToCall] = useState('')

  const CC = dynamic(
    () => import('./copy-clipboard').then((mod) => mod.CopyClipboard),
    { ssr: false },
  )

  return (
    <div className="container mx-auto">
      <div className="shadow-lg">
        <form noValidate autoComplete="off">
          <div className="grid grid-cols-4 gap-4">
            <div className="grid">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Your name
                </label>
                <input
                  type="text"
                  id="Name"
                  value={name}
                  placeholder="Input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-indigo-500 focus:ring-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
              {/* <CopyToClipboard text={me} className={classes.margin}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Assignment fontSize="large" />}
                >
                  Copy Your ID
                </Button>
              </CopyToClipboard> */}
            </div>
            <div className="grid">
              <div>
                <label
                  htmlFor="Make a call"
                  className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-400"
                >
                  Make a call
                </label>
                <input
                  type="ID to call"
                  id="Name"
                  value={idToCall}
                  placeholder="Input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-indigo-500 focus:ring-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setIdToCall(e.target.value)}
                ></input>
              </div>

              <div>
                {callAccepted && !callEnded ? (
                  <button
                    type="button"
                    onClick={leaveCall}
                    className="flex w-full items-center justify-center rounded-md border border-transparent md:py-3 md:px-10 md:text-lg text-white bg-red-400 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium  text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Hang Up
                  </button>
                ) : (
                  //startIcon={<PhoneDisabled fontSize="large" />}
                  <button
                    type="button"
                    onClick={() => callUser(idToCall)}
                    className="flex w-full items-center justify-center rounded-md border border-transparent focus:outline-none md:py-3 md:px-10 md:text-lg text-white bg-green-400 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-400 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Call
                  </button>
                  //startIcon={<Phone fontSize="large" />}
                )}
              </div>
            </div>
          </div>
        </form>
        <div>
          <CC content={me} />
        </div>
        {children}
      </div>
    </div>
  )
}

export default Sidebar
