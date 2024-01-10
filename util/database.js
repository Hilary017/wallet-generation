const mysql = require('mysql2');
const { Client } = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    database: 'test-db',
    password: "@August11",
    port: 5432
});

module.exports = client;

// client.connect();

// client.query('select * from test_table', (err, result) => {
//     if(!err) {
//         console.log(result);
//         console.log(result.rows);
//     }
//     console.log('This is the error', err);
//     client.end();
// })

