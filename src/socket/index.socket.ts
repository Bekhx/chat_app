import { Server, Socket } from "socket.io";

const WEBSOCKET_CORS = {
    origin: "*",
    methods: ['GET', 'POST']
}

class WebSocket extends Server {
    private static io: WebSocket;

    constructor(httpServer) {
        super(httpServer, {
            cors: WEBSOCKET_CORS
        });
    }

    public static getInstance(httpServer?): WebSocket {
        if (!WebSocket.io) {
            WebSocket.io = new WebSocket(httpServer);
        }

        return WebSocket.io;
    }

    public initializeHandlers(socketHandlers: Array<any>) {
        socketHandlers.forEach(element => {
            let namespace = WebSocket.io.of(element.path, (socket: Socket) => {
                element.handler.handleConnection(socket);
            });

            if (element.handler.middlewareImplementation) {
                namespace.use(element.handler.middlewareImplementation);
            }
        });
    }
}

export default WebSocket;