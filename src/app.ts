import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as Http from 'http';
import * as BodyParser from 'body-parser';
import Cors from 'cors';
import morgan from 'morgan';
import { routes } from './routes';
import WebSocket from "./socket/index.socket";
import ChatSocket from "../src/controllers/socket/chatSocket.controller";
import * as swaggerUi from 'swagger-ui-express';

const swaggerJSDoc = require('../swagger');

class ServerModule {

    public host;
    public port;
    public http: any;
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
        this.app.use((req, res, next) => {
            res.setHeader('Access-Control-Expose-Headers', 'original-name, Content-Disposition');
            next();
        });
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc, { "showExplorer": true }));
        this.app.get('/api', (req, res) => {
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