import { IUserDetails, IExists, IUserId, IUser } from "../models/interfaces/user.model";
import { IUserRegistration } from "../models/interfaces/auth.model";
import { pgQueryPool } from "../database/queryPool";

export class AuthRepository {

    static async registration( params: IUserRegistration ): Promise<IUserDetails | null> {
        const sql =  `INSERT INTO users (first_name, last_name, email, password)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, first_name AS "firstName", last_name AS "lastName", email;`;

        const result = await pgQueryPool(sql, [params.firstName, params.lastName, params.email, params.password]);

        if (!result.rows || result.rows.length === 0) return null;

        return result.rows[0];
    }

    static async checkExistenceUser( email: string ): Promise<IExists> {
        const sql =  `SELECT EXISTS (SELECT id FROM users WHERE email=$1)::boolean;`;

        const result = await pgQueryPool(sql, [email]);

        return result.rows[0];
    }

    static async getUserById(id: number): Promise<IUserId | null> {
        const sql = `SELECT id FROM users WHERE id = $1;`;

        const result = await pgQueryPool(sql, [id]);

        if (!result.rows || result.rows.length === 0) return null;

        return result.rows[0];
    }

    static async getUserByEmail(email: string): Promise<IUser | null> {
        const sql = `SELECT
                       id,
                       first_name AS "firstName",
                       last_name AS "lastName",
                       email,
                       password
                   FROM users
                   WHERE email = $1
                   GROUP BY id;`;

        const result = await pgQueryPool(sql, [email]);

        if (!result.rows || result.rows.length === 0) return null;

        return result.rows[0];
    }

}