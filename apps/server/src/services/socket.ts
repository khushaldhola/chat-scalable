import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
    host: '__redis-aiven-cloud-host-name__',
    port: PORT,
    username: 'default',
    password: '__aiven-pswrd__'
});
const sub = new Redis({
    host: '__redis-aiven-cloud-host-name__',
    port: PORT,
    username: 'default',
    password: '__aiven-pswrd__'
});



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

        // creating a subscription
        sub.subscribe('MESSAGES');
    }

    //Handling Emiting
    public initListeners(){
        console.log("Initializing Socket listeners...")
        // initializing event listeners
        const io = this.io;
        // whenever usr is connected we handle them in here
        io.on("connect", (socket) => {
            console.log("new sokt Connected: ", socket.id);

            // set up event listener, client can emit event that is message and send msg then we console log it
            // means we get msg and user send it to here, {dfestruct msg} and {give type}
            socket.on("event:message", async ({message} : {message : string}) => {
                console.log("got new msg: ", message)
                // whenever we get msg i want to publish it to redis so every server has that msg
                // whenever we get msg we await and publish our publisher, pub is a redis, we publish(messages) in redis
                // param1: in which channel
                await pub.publish('MESSAGES', JSON.stringify({message}))
            })
        })
        // whenever we get msg i have function like in what chnl which msg came
        sub.on('message', (channel, message) =>{
            // if msg came to MESSAGES chnl i want forward to my all clients
            if (channel === 'MESSAGES'){
                console.log('msg frm redis: ', message)
                io.emit('message', message)
            }
        })
    }

    // Getter
    get io(){
        return this._io;
    }
}

export default SocketService;
