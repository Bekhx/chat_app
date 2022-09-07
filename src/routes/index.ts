import * as express from "express";
import { authRoutes } from './auth.routes';
import { chatRoutes } from './chat.routes';
import { errorHandler } from '../middleware/errorHandler';
import { response } from "../middleware/response";

function nestedRoutes(path, configure) {
    const router = express.Router({mergeParams: true});
    this.use(path, router);
    configure(router);
    return router;
}

express.application['prefix'] = nestedRoutes;
express.Router['prefix'] = nestedRoutes;

const expressRouter = express.Router({mergeParams: true});
expressRouter.use(response);

export const routes = (app: express.Application) => {

    expressRouter['prefix']('/api', api => {
        api['prefix']('/auth', apis => {
            authRoutes(apis);
        })
        api['prefix']('/chat', apis => {
            chatRoutes(apis);
        })
    })

    app.use(expressRouter);
    app.use(errorHandler);
}