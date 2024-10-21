import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.HOST, // Cambiado a process.env.HOST
        user: process.env.USERDB, // Cambiado a process.env.USER
        password: process.env.PW, // Cambiado a process.env.PW
        database: process.env.DB, // Cambiado a process.env.DB
        ssl: {
            rejectUnauthorized: false // Mantener esto si es necesario
        }
    }
});

export default db;