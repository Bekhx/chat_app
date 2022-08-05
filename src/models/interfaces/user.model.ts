import { ValidatedRequestSchema } from "express-joi-validation";
import { IChat } from "./chat.model";

export interface IUser {
    id: number,
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    chats?: IChat[]
}

export interface IUserRegistration extends ValidatedRequestSchema {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IExists {
    exists: boolean
}

export interface IUserDetails {
    id: number,
    firstName: string,
    lastName: string,
}

export interface IUserId {
    id: number
}

export interface ITokenData {
    token: string,
    id: number
}

export interface ILogin extends ValidatedRequestSchema {
    email: string,
    password: string
}

export interface IUserAuth extends IUserDetails {
    token: string
    chats?: IChat[] | []
}