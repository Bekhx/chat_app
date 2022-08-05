import * as express from "express";
import { userRoutes } from './user.routes';
import { chatRoutes } from './chat.routes';
import { errorHandler } from '../middleware/errorHandler';

function nestedRoutes(path, configure) {
    const router = express.Router({mergeParams: true});
    this.use(path, router);
    configure(router);
    return router;
}

express.application['prefix'] = nestedRoutes;
express.Router['prefix'] = nestedRoutes;

const expressRouter = express.Router({mergeParams: true});

export const routes = (app: express.Application) => {

    expressRouter['prefix']('/api', api => {
        api['prefix']('/user', apis => {
            userRoutes(apis);
        })
        api['prefix']('/chat', apis => {
            chatRoutes(apis);
        })
    })

    app.use(expressRouter);
    app.use(errorHandler);
}