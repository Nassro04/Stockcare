const bcrypt = require('bcrypt');

const password = 'admin';
const hash = '$2b$10$15TxsuFMxy0zKlDcNcDFoOxKi5z5R3adGXmbHWJ4W4ssH5sZBaycGO';

bcrypt.compare(password, hash).then(result => {
    console.log('Password matches:', result);
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
