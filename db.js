import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.HOST,
        user: process.env.USERDB,
        password: process.env.PW,
        database: process.env.DB,
        ssl: {
            rejectUnauthorized: false // Develop enviroment
        }
    }
});

export default db;