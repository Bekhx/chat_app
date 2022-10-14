import { IValidatedRequest } from "../models/requestModels/validatedRequest.model";
import { IValidatedRequestBody } from "../models/requestModels/validatedRequestBody.model";
import {ILogin, IRefreshToken, IUserAuth, IUserRegistration} from "../models/interfaces/auth.model";
import { AuthRepository } from "../repository/auth.repository";
import { ErrorService } from "../services/error.service";
import { TokenService } from "../services/token.service";
import { ErrorEnum } from "../models/enums/error.enum";
import StatusCodes from "http-status-codes";
import { ChatRepository } from "../repository/chat.repository";
import bcrypt from 'bcrypt';

export class AuthController {

    static async signup(req: IValidatedRequest<IValidatedRequestBody<IUserRegistration>>, res: any) {
        try {
            const isUser = await AuthRepository.checkExistenceUser(req.body.email);
            if (isUser.exists) return ErrorService.error(res, {}, StatusCodes.CONFLICT, ErrorEnum.userAlreadyExists);

            req.body.password = await bcrypt.hash(req.body.password, 10);
            const userDetails = await AuthRepository.registration(req.body);

            const tokens = await TokenService.generateTokens({ id: userDetails.id });

            const user: IUserAuth = {
                ...userDetails,
                ...tokens
            }

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: process.env.JWT_REFRESH_EXPIRE_IN_MILLISECONDS, httpOnly: true }); // if https? use: secure: true
            return res.send(user);

        } catch (error) {
            return ErrorService.error(res, error, error.status, error.message);
        }
    }

    static async login(req: IValidatedRequest<IValidatedRequestBody<ILogin>>, res: any) {
        const email: string = req.body.email;
        const password: string = req.body.password;

        try {
            const user = await AuthRepository.getUserByEmail(email);

            if (!user) return ErrorService.error(res, {}, StatusCodes.UNPROCESSABLE_ENTITY, ErrorEnum.userEmailNotFound);

            const isPassword = bcrypt.compare(password, user.password);
            if (!isPassword) return ErrorService.error(res, {}, StatusCodes.UNPROCESSABLE_ENTITY, ErrorEnum.invalidPassword);

            user.chats = await ChatRepository.getChats(user.id);

            const tokens = await TokenService.generateTokens({ id: user.id });

            const response: IUserAuth = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                chats: user.chats,
                ...tokens
            };

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: process.env.JWT_REFRESH_EXPIRE_IN_MILLISECONDS, httpOnly: true }); // if https? use: secure: true
            return res.send(response);

        } catch (error) {
            return ErrorService.error(res, error, error.status, error.message);
        }
    }

    static async refresh(req: IValidatedRequest<IValidatedRequestBody<IRefreshToken>>, res: any) {
        try {
            const userData = await TokenService.verifyRefreshToken(req.body.refreshToken);
            if (!userData || !userData.id) return ErrorService.error(res, {}, StatusCodes.UNAUTHORIZED, ErrorEnum.invalidRefreshToken);

            const refreshTokenFromDB = await TokenService.getRefreshTokenById(userData.id);
            if (req.body.refreshToken !== refreshTokenFromDB) return ErrorService.error(res, {}, StatusCodes.UNAUTHORIZED, ErrorEnum.invalidRefreshToken);

            const tokens = await TokenService.generateTokens(userData);

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: process.env.JWT_REFRESH_EXPIRE_IN_MILLISECONDS, httpOnly: true }); // if https? use: secure: true
            res.send(tokens);
        } catch (error) {
            return ErrorService.error(res, error, error.status, error.message);
        }
    }

    static async logout(req: IValidatedRequest<IValidatedRequestBody<IRefreshToken>>, res: any) {
        try {
            const userData = await TokenService.verifyRefreshToken(req.body.refreshToken);
            if (!userData || !userData.id) return ErrorService.error(res, {}, StatusCodes.UNAUTHORIZED);

            await TokenService.removeRefreshToken(userData.id);

            res.clearCookie('refreshToken');
            res.send();
        } catch (error) {
            return ErrorService.error(res, error, error.status, error.message);
        }
    }
}