import { pgQueryPool} from "../database/queryPool";
import {
    IChat,
    IChatParticipants,
    ICreateChatParams, IFileMessage,
    IInterlocutor,
    IMessage,
    IRoom
} from "../models/interfaces/chat.model";
import {IExists} from "../models/interfaces/user.model";

export class ChatRepository {
    static async createChat(params: ICreateChatParams): Promise<IRoom> {
        const sql = `INSERT INTO user_chats (user_id, interlocutor_id, room) VALUES ($1, $2, $3) RETURNING room;`;

        const result = await pgQueryPool(sql, [params.userId, params.interlocutorId, params.room]);

        return result.rows[0];
    }

    static async createChatForInterlocutor(params: ICreateChatParams): Promise<void> {
        const sql = `INSERT INTO user_chats (user_id, interlocutor_id, room) VALUES ($1, $2, $3);`;

        await pgQueryPool(sql, [params.interlocutorId, params.userId, params.room]);
    }

    static async getChat(params: IChatParticipants): Promise<IRoom> {
        const sql = `SELECT room
                   FROM user_chats
                   WHERE user_id = $1
                     AND interlocutor_id = $2;`;

        const result = await pgQueryPool(sql, [params.userId, params.interlocutorId]);

        return result.rows[0];
    }

    static async checkInterlocutorByEmail(email: string): Promise<IInterlocutor> {
        const sql = `SELECT
                        id,
                        first_name AS "firstName",
                        last_name AS "lastName",
                        email
                   FROM users WHERE email = $1;`;

        const result = await pgQueryPool(sql, [email]);

        return result.rows[0];
    }

    static async getChats(userId: number): Promise<IChat[]> {
        const sql = `SELECT
                       json_build_object(
                               'id', u.id,
                               'firstName', u.first_name,
                               'lastName', u.last_name,
                               'email', u.email
                           ) AS "interlocutor",
                       uch.room
                   FROM user_chats uch
                            JOIN users u on u.id = uch.interlocutor_id
                   WHERE uch.user_id = $1;`;

        const result = await pgQueryPool(sql, [userId]);

        return result.rows;
    }

    static async getChatMessages(room: string): Promise<IMessage[] | []> {
        const sql = `SELECT
                        id,
                        room,
                        date,
                        message,
                        file_path AS "filePath",
                        msg_from_id AS "msgFromId",
                        msg_to_id AS "msgToId"
                   FROM messages
                   WHERE room = $1
                   ORDER BY date;`;

        const result = await pgQueryPool(sql, [room]);

        return result.rows;
    }

    static async checkRoom(room: string, userId: number): Promise<IExists> {
        const sql = `SELECT EXISTS (
                          SELECT uc.id
                          FROM users u
                          JOIN user_chats uc on u.id = uc.user_id
                          WHERE u.id = $1
                          AND uc.room = $2
                   )::boolean;`;

        const result = await pgQueryPool(sql, [userId, room]);

        return result.rows[0];
    }
}
