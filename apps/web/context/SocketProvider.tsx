'use client' // cause all of the context should be executed on client
import React, { useCallback, useContext, useEffect, useState } from "react"
import {io, Socket} from "socket.io-client"

interface SocketProviderProps{
    children?: React.ReactNode;
}
// I-interface
// adding utility funcs, we can send and receive msgs
interface ISocketContext{
    sendMessage: (message: string) => any;
    messages: string[];
}

export const useSocket = () => {
    const state = useContext(SocketContext)
    // console.log("state: ", state)
    if(!state) throw new Error("state is undefined | SocketProvider not found")

    return state
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider:React.FC<SocketProviderProps> = ({children}) => {

    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([]) // str array

    const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
        console.log("Sending message: ", msg)
        if(socket){
            // we want to emit event, and that event is event:message
            socket.emit("event:message", {message: msg});
        }
    }, [socket]);

    const onMessageReceived = useCallback((msg : string) => {
        console.log("Received message from server: ", msg)
        const {message} = JSON.parse(msg) as {message: string}  //  as {message: string} is property in msg
        // set all the prev msg, + new msg
        setMessages(prev => [...prev, message])
    }, [])

    useEffect(() => {
        // whenever this provider gets mounted wht happened is that...
        const _socket = io('http://localhost:8000') // in here we have to give address of our backend, works as a connection for us

        // whenever msg comes call onMessageReceived
        _socket.on('message', onMessageReceived)
        setSocket(_socket)

        // cleaner func
        return() =>{
            _socket.disconnect();
            _socket.off('message', onMessageReceived); // clean up task
            setSocket(undefined);
        }
    }, [])

    return(
         // add messages(in context) in here and to put here we have to write it in type as well
        <SocketContext.Provider value={{sendMessage, messages}}>
            {children}
        </SocketContext.Provider>
    )
}