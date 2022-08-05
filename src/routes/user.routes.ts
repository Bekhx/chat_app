import * as express from "express";
import { createValidator } from "express-joi-validation";
import { userData, login } from '../validation/user.validate';
import { UserController } from "../controllers/user.controller";

const validator = createValidator({ passError: true });

export const userRoutes = (app: express.Application) => {

    app.post('/signup', validator.body(userData), UserController.signup);
    app.post('/login', validator.body(login), UserController.login);

}