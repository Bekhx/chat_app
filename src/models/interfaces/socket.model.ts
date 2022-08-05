import { Socket } from "socket.io";

interface ISocket {

    handleConnection(socket: Socket): void;
    middlewareImplementation?(socket: Socket, next: any): void

}

export default ISocket;