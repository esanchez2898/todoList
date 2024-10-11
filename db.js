import knex from 'knex';

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: '123',
        database: 'todolist'
    }
});

export default db;
