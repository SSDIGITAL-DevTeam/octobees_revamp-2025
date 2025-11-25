import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080/api';

async function testPartnerDashboard() {
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
        console.log('✅ Login successful.\n');

        // 2. Test Stats
        console.log('📊 Testing GET /v1/back-office/partner/dashboard/stats ...');
        const statsResponse = await fetch(`${BASE_URL}/v1/back-office/partner/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statsResponse.ok) {
            console.log('✅ Stats:', JSON.stringify(await statsResponse.json(), null, 2));
        } else {
            console.error('❌ Stats Failed:', await statsResponse.text());
        }
        console.log('\n');

        // 3. Test Recent Leads
        console.log('📋 Testing GET /v1/back-office/partner/dashboard/recent-leads ...');
        const leadsResponse = await fetch(`${BASE_URL}/v1/back-office/partner/dashboard/recent-leads`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (leadsResponse.ok) {
            console.log('✅ Recent Leads:', JSON.stringify(await leadsResponse.json(), null, 2));
        } else {
            console.error('❌ Recent Leads Failed:', await leadsResponse.text());
        }
        console.log('\n');

        // 4. Test Pending Commissions
        console.log('💰 Testing GET /v1/back-office/partner/dashboard/pending-commissions ...');
        const commResponse = await fetch(`${BASE_URL}/v1/back-office/partner/dashboard/pending-commissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (commResponse.ok) {
            console.log('✅ Pending Commissions:', JSON.stringify(await commResponse.json(), null, 2));
        } else {
            console.error('❌ Pending Commissions Failed:', await commResponse.text());
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testPartnerDashboard();
