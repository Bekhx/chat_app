import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as Http from 'http';
import * as BodyParser from 'body-parser';
import Cors from 'cors';
import morgan from 'morgan';
import { routes } from './routes';
import WebSocket from "./socket/index.socket";
import ChatSocket from "./controllers/socket/chatSocket.controller";
import * as swaggerUi from 'swagger-ui-express';
import path from "path";
import * as http from "http";

const swaggerJSDoc = require('../swagger');

class ServerModule {

    public host;
    public port;
    public http: http.Server | undefined;
    public app: any;
    public io: WebSocket;

    constructor() {
        this.host = process.env.HOST;
        this.port = process.env.PORT;
        this.start();
    }

    private start() {
        this.app = express();
        this.app.use(BodyParser.json({limit: '50mb'}));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(Cors());
        this.app.use(morgan('combined'));
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        this.app.use('/files', express.static('uploads'));
        this.app.use((req: any, res: { setHeader: (arg0: string, arg1: string) => void; }, next: () => void) => {
            res.setHeader('Access-Control-Expose-Headers', 'original-name, Content-Disposition');
            next();
        });
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));
        this.app.get('/api', (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
            res.status(200).json({
                message: 'Server is running!'
            });
        });
        routes(this.app);
        this.http = Http.createServer(this.app);
        this.io = WebSocket.getInstance(this.http);
        this.io.initializeHandlers([
            { path: '/chat', handler: new ChatSocket() }
        ]);

        this.http.listen(
            this.port,
            () => console.log(`Server running on http://${this.host}:${this.port}`)
        )
    }
}

new ServerModule();

// TODO Realize logging via winston.
// TODO Add email OTP to registration API.