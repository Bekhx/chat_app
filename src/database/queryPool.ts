import { Pool } from 'pg';

const pgPool = new Pool({
    database: process.env.PG_DATABASE,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    max: 999999,
    idleTimeoutMillis: 30000
})

export const pgQueryPool = (sql: string, params?: any) => {
    return pgPool.query(sql, params);
};