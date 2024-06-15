import { Server } from "socket.io";

class SocketService{
    private _io: Server; // of type server
    constructor(){
        console.log("Initializing new SocketService..."); // for debugging purposss
        this._io = new Server({
            cors:{
                allowedHeaders: ["*"],
                origin: "*"
            }
        });
    }

    //Handling Emiting
    public initListeners(){
        console.log("Initializing Socket listeners...")
        // initializing event listeners
        const io = this.io;
        // whenever usr is connected we handle them in here
        io.on('connect', (socket) => {
            console.log("new sokt Connected: ", socket.id);

            // set up event listener, client can emit event that is message and send msg then we console log it
            // means we get msg and user send it to here, {dfestruct msg} and {give type}
            io.on('event:message', async ({message} : {message : string}) => {
                console.log("got new msg: ", message)
            })
        })
    }

    // Getter
    get io(){
        return this._io;
    }
}

export default SocketService;