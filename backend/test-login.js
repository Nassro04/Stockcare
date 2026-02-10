async function testLogin() {
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }

        const data = await response.json();
        console.log('Login successful:', data);
    } catch (error) {
        console.error('Login failed:', error.message);
    }
}

testLogin();
