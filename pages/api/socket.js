import { Server } from 'Socket.IO'
//import type { NextApiRequest, NextApiResponse } from 'next'

export default function SocketHandler(req, res) {
    const { pid } = req.query
    res.end(`Post: ${pid}`)

    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server)
        res.socket.server.io = io
    }
    res.end()

}