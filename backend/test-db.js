const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'stockcare',
    password: 'postgres',
    port: 5433,
});
console.log('Attempting to connect to DB...');
client.connect()
    .then(() => console.log('Connected successfully!'))
    .catch(e => console.error('Connection error:', e))
    .finally(() => client.end());
