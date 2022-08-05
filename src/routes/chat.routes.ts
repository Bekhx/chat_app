import * as express from 'express';
import { createValidator } from "express-joi-validation";
import { checkApiToken } from "../middleware/checkToken";
import { ChatController } from "../controllers/chat.controller";
import { chatData } from "../validation/chat.validate";
import { room } from "../validation/chat.validate";

const validator = createValidator({ passError: true });

export const chatRoutes = (app: express.Application) => {

    app.post('/', checkApiToken, validator.body(chatData), ChatController.create);
    app.get('/', checkApiToken, ChatController.list);
    app.get('/:room', checkApiToken, validator.params(room), ChatController.getChat);

}