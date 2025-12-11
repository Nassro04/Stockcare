const bcrypt = require('bcrypt');

async function test() {
    const hash = '$2b$10$mQb8LL/v6Bg0l1ihfIujNOvg4dGGH8/QXBBuTLNrlaFHSCBMKKKujm';
    const result = await bcrypt.compare('admin', hash);
    console.log('Hash:', hash);
    console.log('Password "admin" matches:', result);
}

test();
