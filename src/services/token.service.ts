import { redisClient } from "../database/redis";
import { ITokenData } from "../models/interfaces/user.model";

export class TokenService {

    static async generateToken(count: number): Promise<string> {
        let _sym: string = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let str: string = '';
        for (let i = 0; i < count; i++) {
            str += _sym[Math.floor(Math.random() * (_sym.length))];
        }
        return str;
    }

    static async addUserToken(params: ITokenData): Promise<void> {
        let users = await redisClient.hGetAll('usersTokens');

        for (let token in users) {
            if (JSON.parse(users[token]) === params.id) await redisClient.hDel('usersTokens', token);
        }

        await redisClient.hSet('usersTokens', params.token, params.id);
    }

    static async getUserIdByToken(token: string): Promise<number | null> {
        let userId = await redisClient.hGet('usersTokens', token);

        if (!userId) return null;

        return JSON.parse(userId);
    }

    static async removeOperatorToken(params: ITokenData) {
        await redisClient.hDel('usersTokens', params.token);
    }
}