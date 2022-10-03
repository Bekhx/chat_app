import * as express from "express";
import { authRoutes } from './auth.routes';
import { chatRoutes } from './chat.routes';
import { errorHandler } from '../middleware/errorHandler';
import { Router } from "express-serve-static-core";

function nestedRoutes(path: any, configure: (arg0: Router) => void) {
    const router = express.Router({mergeParams: true});
    this.use(path, router);
    configure(router);
    return router;
}

// @ts-ignore
express.application.prefix =  nestedRoutes;
// @ts-ignore
express.Router.prefix = nestedRoutes;

const expressRouter = express.Router({mergeParams: true});

export const routes = (app: express.Application) => {

    // @ts-ignore
    expressRouter.prefix('/api', (api: { prefix: (arg0: string, arg1: { (apis: any): void; (apis: any): void; }) => void; }) => {
        api.prefix('/auth', apis => {
            authRoutes(apis);
        })
        api.prefix('/chat', apis => {
            chatRoutes(apis);
        })
    })

    app.use(expressRouter);
    // @ts-ignore
    app.use(errorHandler);
}