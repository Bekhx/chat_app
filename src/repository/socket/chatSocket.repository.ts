import { pgQueryPool} from "../../database/queryPool";
import {IFileMessage, IMessage, IMessageSend} from "../../models/interfaces/chat.model";

export class SocketRepository {
    static async saveMessage(params: IMessageSend, userId: number): Promise<IMessage> {
        let sql = `INSERT INTO messages (room, date, message, msg_from_id, msg_to_id)
                    VALUES ($1, NOW(), $2, $3, $4)
                    RETURNING
                    id,
                    room,
                    date,
                    message,
                    file_path AS "filePath",
                    msg_from_id AS "from",
                    msg_to_id AS "to";`;

        let result = await pgQueryPool(sql, [params.room, params.message, userId, params.interlocutorId]);

        return result.rows[0];
    }

    static async saveFilePath(params: IFileMessage): Promise<IMessage> {
        let sql = `INSERT INTO messages (msg_from_id, msg_to_id, room, date, file_path)
                    VALUES ($1, $2, $3, NOW(), $4)
                    RETURNING
                    id,
                    room,
                    date,
                    message,
                    file_path AS "filePath",
                    msg_from_id AS "from",
                    msg_to_id AS "to";`;

        let result = await pgQueryPool(sql, [params.userId, params.interlocutorId, params.room, params.filePath]);

        return result.rows[0];
    }
}