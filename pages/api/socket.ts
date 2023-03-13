// pages/api/socket.js
import { Server, Namespace } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from 'next'

import messageHandler from '@/utils/sockets/messageHandler';

import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import type { Server as IOServer } from 'socket.io'

interface SocketServer extends HTTPServer {
    io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
    server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}
interface ServerToClientEvents {
    'created': () => void;
    'joined': () => void;
    'full': () => void;
    'ready': () => void;
    'ice-candidate': (candidate: RTCIceCandidate) => void;
    'offer': (offer: RTCSessionDescriptionInit) => void;
    'answer': (answer: RTCSessionDescriptionInit) => void;
    'leave': () => void;
    'newIncomingMessage': (msg: string) => void;
    'update-playing': (playing: boolean) => void;    
}

interface ClientToServerEvents {
    'join': (roomName: string) => void;
    'ready': (roomName: string) => void;
    'ice-candidate': (candidate: RTCIceCandidate, roomName: string) => void;
    'offer': (offer: RTCSessionDescriptionInit, roomName: string) => void;
    'answer': (answer: RTCSessionDescriptionInit, roomName: string) => void;
    'leave': (roomName: string) => void;
    'createdMessage': (msg: string) => void;
    'setPlaying': (playing: boolean) => void;    
}


export default function SocketHandler(
    req: NextApiRequest,
    res: NextApiResponseWithSocket) {
    //    console.log(res.socket.server.io);

    // CORS headers 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    
    if (res.socket.server.io != null) {
        console.log('Socket is already running');
        //res.socket.server.io.removeAllListeners("connection");
        
        //    res.end();
    } else {
        console.log('Socket is initializing');

        //cors
        const io = new Server<ClientToServerEvents, ServerToClientEvents>(res.socket.server, {
            cors: {
                origin: 'https://app-ruscello.vercel.app/api/socket',
                methods: ['GET', 'POST'],
                credentials: true
            }
        });


        io.engine.on("connection_error", (err: unknown) => {
            console.log(`Connection error: ${err}`);
          });

        res.socket.server.io = io;

        io.on("connection", (socket) => {
            console.log(`User Connected :${socket.id}`);

            // Triggered when a peer hits the join room button.
            socket.on("join", (roomName) => {

                const { rooms } = io.sockets.adapter;
                const room = rooms.get(roomName);

                // room == undefined when no such room exists.
                if (room === undefined) {
                    socket.join(roomName);
                    socket.emit("created");
                } else if (room.size === 1) {
                    // room.size == 1 when one person is inside the room.
                    socket.join(roomName);
                    socket.emit("joined");
                } else {
                    // when there are already two people inside the room.
                    socket.emit("full");
                }
                //console.log(rooms);
                console.log("🚀 ~ file: stack.ts:35 ~ socket.on ~ rooms", rooms)
            });

            // Triggered when the person who joined the room is ready to communicate.
            socket.on("ready", (roomName) => {
                socket.broadcast.to(roomName).emit("ready"); // Informs the other peer in the room.
            });

            // Triggered when server gets an icecandidate from a peer in the room.
            socket.on("ice-candidate", (candidate, roomName: string) => {
                // console.log(candidate);
                console.log("🚀 ~ file: stack.ts:46 ~ socket.on ~ candidate", candidate)
                socket.broadcast.to(roomName).emit("ice-candidate", candidate); // Sends Candidate to the other peer in the room.
            });

            // Triggered when server gets an offer from a peer in the room.
            socket.on("offer", (offer, roomName) => {
                socket.broadcast.to(roomName).emit("offer", offer); // Sends Offer to the other peer in the room.
            });

            // Triggered when server gets an answer from a peer in the room
            socket.on("answer", (answer, roomName) => {
                socket.broadcast.to(roomName).emit("answer", answer); // Sends Answer to the other peer in the room.
            });

            socket.on("leave", (roomName) => {
                socket.leave(roomName);
                socket.broadcast.to(roomName).emit("leave");
            });

            socket.on("createdMessage", (msg) => {
                socket.broadcast.emit("newIncomingMessage", msg);
            });

            socket.on('setPlaying', (playing) => {
                socket.broadcast.emit('update-playing', (playing))
            })

        });

    }
    return res.end();
};
