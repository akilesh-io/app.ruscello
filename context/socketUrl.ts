import { io } from "socket.io-client";

// https://oyster-app-s6lgs.ondigitalocean.app/
// http://localhost:5000/

const URL = "https://oyster-app-s6lgs.ondigitalocean.app/";

export const socket = io(URL, {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ["websocket"],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false,
});
