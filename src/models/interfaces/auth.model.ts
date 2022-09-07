import { ValidatedRequestSchema } from "express-joi-validation";
import { IChat } from "./chat.model";
import { IUserDetails } from "./user.model";

export interface IUserRegistration extends ValidatedRequestSchema {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export interface ILogin extends ValidatedRequestSchema {
    email: string,
    password: string
}
export interface IUserAuth extends IUserDetails, ITokens {
    chats?: IChat[] | []
}
export interface ITokens extends IRefreshToken {
    accessToken: string
}

export interface IRefreshToken {
    refreshToken: string
}