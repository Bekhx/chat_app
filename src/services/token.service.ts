import * as JWT from 'jsonwebtoken';
import { IUserId } from "../models/interfaces/user.model";
import { ITokens } from "../models/interfaces/auth.model";
import { redisClient } from "../database/redis";

export class TokenService {

    static async generateTokens(payload: IUserId): Promise<ITokens> {
        const accessToken = JWT.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRE });
        const refreshToken = JWT.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });

        await redisClient.hSet('userTokens', payload.id, refreshToken);

        return {
            accessToken,
            refreshToken
        }
    }

    static async verifyAccessToken(token: string): Promise<IUserId> {
        const tokenData = await JWT.verify(token, process.env.JWT_ACCESS_SECRET);
        // @ts-ignore
        return { id: tokenData.id };
    }

    static async verifyRefreshToken(token: string): Promise<IUserId> {
        const tokenData = await JWT.verify(token, process.env.JWT_REFRESH_SECRET);
        // @ts-ignore
        return { id: tokenData.id };
    }

    static async getRefreshTokenById(userId: number): Promise<string> {
        return await redisClient.hGet('userTokens', userId.toString());
    }

    static async removeRefreshToken(userId: number): Promise<void> {
        await redisClient.hDel('userTokens', userId.toString());
    }

}