import {IValidatedRequest} from "../models/requestModels/validatedRequest.model";
import {IValidatedRequestBody} from "../models/requestModels/validatedRequestBody.model";
import {ILogin, ITokenData, IUserAuth, IUserRegistration} from "../models/interfaces/user.model";
import {UserRepository} from "../repository/user.repository";
import {ErrorService} from "../services/error.service";
import {TokenService} from "../services/token.service";
import {ErrorEnum} from "../models/enums/error.enum";
import StatusCodes from "http-status-codes";
import {ChatRepository} from "../repository/chat.repository";

const bcrypt = require('bcrypt');

export class UserController {

    static async signup(req: IValidatedRequest<IValidatedRequestBody<IUserRegistration>>, res: any) {
        try {
            const isUser = await UserRepository.checkExistenceUser(req.body.email);
            if (isUser.exists) return ErrorService.error(res, {}, StatusCodes.CONFLICT, ErrorEnum.userAlreadyExists);

            req.body.password = await bcrypt.hash(req.body.password, 10);
            const userDetails = await UserRepository.registration(req.body);

            const token = await TokenService.generateToken(60);

            const user: IUserAuth = {
                ...userDetails,
                token
            }

            const tokenData: ITokenData = {
                token,
                id: userDetails.id
            }

            await TokenService.addUserToken(tokenData);

            return res.send(user);

        } catch (error) {
            return ErrorService.error(res, error);
        }
    }

    static async login(req: IValidatedRequest<IValidatedRequestBody<ILogin>>, res: any) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        try {
            let user = await UserRepository.getUserByEmail(email);

            if (!user) return ErrorService.error(res, {}, StatusCodes.UNPROCESSABLE_ENTITY, ErrorEnum.usernameNotFound);

            let isPassword = bcrypt.compare(password, user.password);
            if (!isPassword) return ErrorService.error(res, {}, StatusCodes.UNPROCESSABLE_ENTITY, ErrorEnum.passwordNotFound);

            user.chats = await ChatRepository.getChats(user.id);

            const token = await TokenService.generateToken(60);

            const tokenData: ITokenData = {
                token,
                id: user.id
            }

            await TokenService.addUserToken(tokenData);

            let response: IUserAuth = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                token,
                chats: user.chats
            };

            return res.send(response);

        } catch (e) {
            return ErrorService.error(res, e);
        }
    }
}