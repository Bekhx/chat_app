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
                       id,
                       first_name AS "firstName",
                       last_name AS "lastName",
                       email,
                       password
                   FROM users
                   WHERE email = $1
                   GROUP BY id;`;

        let result = await pgQueryPool(sql, [email]);

        if (!result.rows || result.rows.length === 0) return null;

        return result.rows[0];
    }

}