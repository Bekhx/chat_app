import * as express from "express";
import { createValidator } from "express-joi-validation";
import {userData, login, refreshToken} from '../validation/auth.validate';
import { AuthController } from "../controllers/auth.controller";
import {checkApiToken} from "../middleware/checkToken";

const validator = createValidator({ passError: true });

export const authRoutes = (app: express.Application) => {

    app.post('/signup', validator.body(userData), AuthController.signup);
    app.post('/login', validator.body(login), AuthController.login);
    app.post('/refresh-token', validator.body(refreshToken), AuthController.refresh);
    app.post('/logout', checkApiToken, validator.body(refreshToken), AuthController.logout);

}