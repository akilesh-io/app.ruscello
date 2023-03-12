// eslint-disable-next-line import/no-anonymous-default-export
export default (io, socket) => {
    const createdMessage = (msg) => {
      socket.broadcast.emit("newIncomingMessage", msg);
    };
  
    socket.on("createdMessage", createdMessage);
  };