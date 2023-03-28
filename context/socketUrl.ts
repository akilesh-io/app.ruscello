import { io } from "socket.io-client";

// https://ruscello-api-ecfbf.ondigitalocean.app/
// http://localhost:5000/

const URL = "http://localhost:5000/";

export const socket = io(URL, {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ["websocket"],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false,
});
