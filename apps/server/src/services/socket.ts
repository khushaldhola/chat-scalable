import { Server } from "socket.io";

class SocketService{
    private _io: Server; // of type server
    constructor(){
        console.log("Initializing new SocketService..."); // for debugging purposss
        this._io = new Server();
    }

    // Getter
    get io(){
        return this._io;
    }
}

export default SocketService;