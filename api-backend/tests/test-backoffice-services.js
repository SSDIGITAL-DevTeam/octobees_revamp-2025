import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8080/api/v1';
const AUTH_URL = 'http://localhost:8080/api/auth';

// State
let state = {
    token: '',
    serviceId: ''
};

// Helpers
const log = {
    info: (msg) => console.log(`\x1b[36m${msg}\x1b[0m`), // Cyan
    success: (msg) => console.log(`\x1b[32m✅ ${msg}\x1b[0m`), // Green
    error: (msg, data) => console.error(`\x1b[31m❌ ${msg}\x1b[0m`, data || ''), // Red
    header: (msg) => console.log(`\n\x1b[1m${msg}\x1b[0m`) // Bold
};

const request = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...(state.token && { 'Authorization': `Bearer ${state.token}` }),
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        return { status: 500, error: error.message };
    }
};

// Tests
const tests = [
    {
        name: 'Back Office Login',
        run: async () => {
            const { data } = await request(`${AUTH_URL}/login`, {
                method: 'POST',
                body: JSON.stringify({
                    email: 'admin@octobees.com',
                    password: 'password123'
                })
            });

            if (data.accessToken) {
                state.token = data.accessToken;
                log.success('Login successful');
            } else {
                throw new Error(`Login failed: ${JSON.stringify(data)}`);
            }
        }
    },
    {
        name: 'Create Service',
        run: async () => {
            const { data } = await request('/back-office/partner/services', {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Test Service',
                    commissionPercentage: 15,
                    description: 'Test service description'
                })
            });

            if (data.status === 'success') {
                state.serviceId = data.data.id;
                log.success(`Service created: ${data.data.id}`);
            } else {
                throw new Error(`Create failed: ${JSON.stringify(data)}`);
            }
        }
    },
    {
        name: 'Get All Services',
        run: async () => {
            const { data } = await request('/back-office/partner/services?page=1&limit=10');
            if (data.status === 'success') {
                log.success(`Found ${data.data.length} services`);
            } else {
                throw new Error(`Get all failed: ${JSON.stringify(data)}`);
            }
        }
    },
    {
        name: 'Get Service By ID',
        run: async () => {
            const { data } = await request(`/back-office/partner/services/${state.serviceId}`);
            if (data.status === 'success' && data.data.name === 'Test Service') {
                log.success(`Retrieved service: ${data.data.name}`);
            } else {
                throw new Error(`Get by ID failed: ${JSON.stringify(data)}`);
            }
        }
    },
    {
        name: 'Update Service',
        run: async () => {
            const { data } = await request(`/back-office/partner/services/${state.serviceId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: 'Updated Test Service',
                    commissionPercentage: 20
                })
            });

            if (data.status === 'success' && data.data.commissionPercentage === 20) {
                log.success(`Updated service: ${data.data.name} (${data.data.commissionPercentage}%)`);
            } else {
                throw new Error(`Update failed: ${JSON.stringify(data)}`);
            }
        }
    },
    {
        name: 'Delete Service',
        run: async () => {
            const { data } = await request(`/back-office/partner/services/${state.serviceId}`, {
                method: 'DELETE'
            });

            if (data.status === 'success') {
                log.success('Service deleted');
            } else {
                throw new Error(`Delete failed: ${JSON.stringify(data)}`);
            }
        }
    }
];

// Runner
const run = async () => {
    console.clear();
    log.header('🚀 Starting Back Office Services Tests');

    for (const [index, test] of tests.entries()) {
        log.header(`${index + 1}. Testing ${test.name}...`);
        try {
            await test.run();
        } catch (error) {
            log.error(error.message);
            process.exit(1);
        }
    }

    log.header('\n✨ All tests passed successfully!');
};

run();
