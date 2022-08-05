import { pgQueryPool} from "../../database/queryPool";
import {IMessage, IMessageSend} from "../../models/interfaces/chat.model";

export class SocketRepository {
    static async saveMessage(params: IMessageSend, userId: number): Promise<IMessage> {
        let sql = `INSERT INTO messages (room, date, message, msg_from_id, msg_to_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;

        let result = await pgQueryPool(sql, [params.room, params.date, params.message, userId, params.interlocutorId]);

        return result.rows[0];
    }
}