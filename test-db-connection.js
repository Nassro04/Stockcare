
const { Client } = require('pg');

const client = new Client({
    user: 'admin',
    host: '127.0.0.1',
    database: 'stockcare',
    password: 'admin123',
    port: 5433,
});

console.log('Attempting to connect to DB at 127.0.0.1:5433...');

client.connect()
    .then(() => {
        console.log('SUCCESS: Connected to database!');
        return client.query('SELECT NOW()');
    })
    .then(res => {
        console.log('Query Result:', res.rows[0]);
        return client.end();
    })
    .catch(err => {
        console.error('FAILURE: Could not connect.', err);
    });
