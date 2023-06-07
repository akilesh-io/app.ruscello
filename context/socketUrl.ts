import { io } from "socket.io-client";

// https://api.filmingo.us/
// http://localhost:5000/
// process.env.API_URL

const URL = "https://api.filmingo.us/" || "http://localhost:5000/";

export const socket = io(URL, {
    reconnectionDelay: 1000,
    reconnection: true,
    reconnectionAttempts: 10,
    transports: ["websocket"],
    agent: false,
    upgrade: false,
    rejectUnauthorized: false,
});
