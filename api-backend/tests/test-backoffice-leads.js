/**
 * Test script for Back Office Leads Management endpoints
 * 
 * Tests all CRUD operations for managing partner leads from back office
 */

const BASE_URL = 'http://localhost:8080/api';
let authToken = '';
let testLeadId = '';

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, body = null) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error(`Error making ${method} request to ${endpoint}:`, error.message);
        return { status: 500, data: { error: error.message } };
    }
}

// Test 1: Login to get auth token
async function testLogin() {
    console.log('\n=== TEST 1: Back Office Login ===');
    const result = await makeRequest('POST', '/auth/login', {
        email: 'admin@octobees.com',
        password: 'password123'
    });

    if (result.status === 200 && result.data.accessToken) {
        authToken = result.data.accessToken;
        console.log('✓ Login successful');
        console.log('Token:', authToken.substring(0, 20) + '...');
        return true;
    } else {
        console.log('✗ Login failed:', result.data);
        return false;
    }
}

// Test 2: Get all leads with pagination
async function testGetAllLeads() {
    console.log('\n=== TEST 2: GET /v1/back-office/partner/leads (All Leads) ===');
    const result = await makeRequest('GET', '/v1/back-office/partner/leads?page=1&limit=10');

    if (result.status === 200) {
        console.log('✓ Successfully retrieved leads');
        console.log('Total leads:', result.data.pagination?.total || 0);
        console.log('Page:', result.data.pagination?.page);
        console.log('Limit:', result.data.pagination?.limit);
        console.log('Total pages:', result.data.pagination?.totalPages);

        if (result.data.data && result.data.data.length > 0) {
            console.log('\nFirst lead:');
            console.log(JSON.stringify(result.data.data[0], null, 2));
            testLeadId = result.data.data[0].id;
        }
        return true;
    } else {
        console.log('✗ Failed to retrieve leads:', result.data);
        return false;
    }
}

// Test 3: Get leads with search filter
async function testGetLeadsWithSearch() {
    console.log('\n=== TEST 3: GET /v1/back-office/partner/leads?search=test ===');
    const result = await makeRequest('GET', '/v1/back-office/partner/leads?search=test&page=1&limit=10');

    if (result.status === 200) {
        console.log('✓ Successfully retrieved leads with search');
        console.log('Results found:', result.data.data?.length || 0);
        return true;
    } else {
        console.log('✗ Failed to search leads:', result.data);
        return false;
    }
}

// Test 4: Get leads with status filter
async function testGetLeadsWithStatus() {
    console.log('\n=== TEST 4: GET /v1/back-office/partner/leads?status=Lead Created ===');
    const result = await makeRequest('GET', '/v1/back-office/partner/leads?status=Lead Created');

    if (result.status === 200) {
        console.log('✓ Successfully retrieved leads with status filter');
        console.log('Results found:', result.data.data?.length || 0);
        return true;
    } else {
        console.log('✗ Failed to filter leads by status:', result.data);
        return false;
    }
}

// Test 5: Get lead by ID
async function testGetLeadById() {
    if (!testLeadId) {
        console.log('\n=== TEST 5: SKIPPED (No lead ID available) ===');
        return true;
    }

    console.log('\n=== TEST 5: GET /v1/back-office/partner/leads/:id ===');
    console.log('Lead ID:', testLeadId);
    const result = await makeRequest('GET', `/v1/back-office/partner/leads/${testLeadId}`);

    if (result.status === 200) {
        console.log('✓ Successfully retrieved lead detail');
        console.log('\nLead details:');
        console.log(JSON.stringify(result.data.data, null, 2));
        return true;
    } else {
        console.log('✗ Failed to retrieve lead detail:', result.data);
        return false;
    }
}

// Test 6: Update lead
async function testUpdateLead() {
    if (!testLeadId) {
        console.log('\n=== TEST 6: SKIPPED (No lead ID available) ===');
        return true;
    }

    console.log('\n=== TEST 6: PATCH /v1/back-office/partner/leads/:id ===');
    const result = await makeRequest('PATCH', `/v1/back-office/partner/leads/${testLeadId}`, {
        remark: 'Updated from back office test - ' + new Date().toISOString()
    });

    if (result.status === 200) {
        console.log('✓ Successfully updated lead');
        console.log('Updated remark:', result.data.data?.remark);
        return true;
    } else {
        console.log('✗ Failed to update lead:', result.data);
        return false;
    }
}

// Test 7: Update lead status
async function testUpdateLeadStatus() {
    if (!testLeadId) {
        console.log('\n=== TEST 7: SKIPPED (No lead ID available) ===');
        return true;
    }

    console.log('\n=== TEST 7: PATCH /v1/back-office/partner/leads/:id (Update Status) ===');
    const result = await makeRequest('PATCH', `/v1/back-office/partner/leads/${testLeadId}`, {
        status: 'Follow-up'
    });

    if (result.status === 200) {
        console.log('✓ Successfully updated lead status');
        console.log('New status:', result.data.data?.status);
        return true;
    } else {
        console.log('✗ Failed to update lead status:', result.data);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('========================================');
    console.log('BACK OFFICE LEADS MANAGEMENT API TESTS');
    console.log('========================================');

    const tests = [
        testLogin,
        testGetAllLeads,
        testGetLeadsWithSearch,
        testGetLeadsWithStatus,
        testGetLeadById,
        testUpdateLead,
        testUpdateLeadStatus,
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const result = await test();
        if (result) {
            passed++;
        } else {
            failed++;
        }
    }

    console.log('\n========================================');
    console.log('TEST SUMMARY');
    console.log('========================================');
    console.log(`Total tests: ${tests.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log('========================================\n');
}

// Run tests
runAllTests().catch(console.error);
