import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080/api';

async function testBackOfficeEndpoints() {
    try {
        // 1. Login as Admin
        console.log('🔐 Logging in as Admin...');
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@octobees.com',
                password: 'password123'
            })
        });

        if (!loginResponse.ok) {
            throw new Error(`Login failed: ${loginResponse.statusText}`);
        }

        const loginData = await loginResponse.json();
        const token = loginData.accessToken;
        console.log('✅ Login successful. Token obtained.\n');

        // 2. Test Get Stats
        console.log('📊 Testing GET /v1/back-office/affiliate/applications/stats ...');
        const statsResponse = await fetch(`${BASE_URL}/v1/back-office/affiliate/applications/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            console.log('✅ Stats Response:', JSON.stringify(stats, null, 2));
        } else {
            console.error('❌ Stats Request Failed:', statsResponse.status, await statsResponse.text());
        }
        console.log('\n');

        // 3. Test Get Applications List
        console.log('📋 Testing GET /v1/back-office/affiliate/applications ...');
        const listResponse = await fetch(`${BASE_URL}/v1/back-office/affiliate/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (listResponse.ok) {
            const list = await listResponse.json();
            console.log('✅ Applications List Response:', JSON.stringify(list, null, 2));
        } else {
            console.error('❌ List Request Failed:', listResponse.status, await listResponse.text());
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testBackOfficeEndpoints();
