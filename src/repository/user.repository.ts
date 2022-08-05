import {IUserRegistration, IUserDetails, IExists, IUserId, IUser} from "../models/interfaces/user.model";
import { pgQueryPool } from "../database/queryPool";

export class UserRepository {

    static async registration( params: IUserRegistration ): Promise<IUserDetails | null> {
        let sql =  `INSERT INTO users (first_name, last_name, email, password) 
                    VALUES ($1, $2, $3, $4) 
                    RETURNING id, first_name AS "firstName", last_name AS "lastName";`;

        let result = await pgQueryPool(sql, [params.firstName, params.lastName, params.email, params.password]);

        if (!result.rows || result.rows.length === 0) return null;

        return result.rows[0];
    }

    static async checkExistenceUser( email: string ): Promise<IExists> {
        let sql =  `SELECT EXISTS (SELECT id FROM users WHERE email=$1)::boolean;`;

        let result = await pgQueryPool(sql, [email]);

        return result.rows[0];
    }

    static async getUserById(id: number): Promise<IUserId | null> {
        let sql = `SELECT id FROM users WHERE id = $1;`;

        let result = await pgQueryPool(sql, [id]);

        if (!result.rows || result.rows.length === 0) return null;

        return result.rows[0];
    }

    static async getUserByEmail(email: string): Promise<IUser | null> {
        let sql = `SELECT
                       u.id,
                       u.first_name AS "firstName",
                       u.last_name AS "lastName",
                       u.email,
                       u.password,
                       array_agg(
                               json_build_object(
                                       'interlocutor', json_build_object(
                                       'id', u2.id,
                                       'firstName', u2.first_name,
                                       'lastName', u2.last_name,
                                       'email', u2.email
                                   ),
                                       'room', uch.room
                                   )
                           ) AS "chats"
                   FROM users u
                            JOIN user_chats uch ON uch.user_id = u.id
                            JOIN users u2 on u2.id = uch.interlocutor_id
                   WHERE u.email = $1
                   GROUP BY u.id;`;

        let result = await pgQueryPool(sql, [email]);

        if (!result.rows || result.rows.length === 0) return null;

        return result.rows[0];
    }

}