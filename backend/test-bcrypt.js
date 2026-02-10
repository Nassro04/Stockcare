const bcrypt = require('bcrypt');

async function test() {
    const password = 'admin';

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashed);

    // Test comparison
    const match1 = await bcrypt.compare(password, hashed);
    console.log('Password matches:', match1);

    // Test with another hash
    const match2 = await bcrypt.compare('admin', hashed);
    console.log('Admin matches:', match2);
}

test();
