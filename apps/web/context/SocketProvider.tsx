'use client' // cause all of the context should be executed on client
import React, { useCallback, useEffect } from "react"
import {io} from "socket.io-client"

interface SocketProviderProps{
    children?: React.ReactNode;
}
// I-interface
// adding utility funcs, we can send and receive msgs
interface ISocketContext{
    sendMessage: (message: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider:React.FC<SocketProviderProps> = ({children}) => {

    const sendMessage: ISocketContext["sendMessage"] = useCallback((msg) => {
        console.log("Sending message: ", msg)
    }, [])

    useEffect(() => {
        // whenever this provider gets mounted wht happened is that...
        const _socket = io('http://localhost:8000') // in here we have to give address of our backend, works as a connection for us

        // cleaner func
        return() =>{
            _socket.disconnect();
        }
    }, [])

    return(
        <SocketContext.Provider value={{sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}