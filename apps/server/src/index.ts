import http from "http"
import SocketService from "./services/socket";

async function init(){
    const socketService = new SocketService();

    const httpServer = http.createServer();
    const PORT = process.env.PORT ? process.env.PORT : 8000;

    // http server attached to socket service
    //  io: is the core object that manages socket connections, event handling, and communication.
    socketService.io.attach(httpServer);
    //  is used to integrate the socket.io server with your existing HTTP server so that both WebSocket and HTTP traffic can be handled concurrently, enabling real-time communication

    httpServer.listen(PORT, () => console.log(`server listening on ${PORT}`))

    // initialized all event listeners
    socketService.initListeners();
}

init();