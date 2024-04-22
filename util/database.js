const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    database: 'test-db',
    password: "@August11",
    port: 5432
});

module.exports = client;
