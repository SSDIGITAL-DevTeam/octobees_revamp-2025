import bcrypt from "bcryptjs";
import { db } from "../../drizzle/db.js";
import {
    affiliateApplication,
    affiliateUser,
    partnerService,
    partnerLead,
    partnerCommission,
} from "../../drizzle/schema.js";
import { v4 as uuidv7 } from "uuid";

const createTestData = async () => {
    try {
        console.log("🌱 Creating test data for partner API...\n");

        // 1. Create Partner Services
        console.log("1️⃣  Creating partner services...");
        const services = [
            {
                id: uuidv7(),
                name: "Web Development",
                commissionPercentage: 15,
                description: "Custom website & web application development",
                isActive: true,
            },
            {
                id: uuidv7(),
                name: "Marketing Automation",
                commissionPercentage: 12,
                description: "Workflow setup, CRM integration, and optimization",
                isActive: true,
            },
            {
                id: uuidv7(),
                name: "Cloud Migration",
                commissionPercentage: 18,
                description: "Full assessment and migration to scalable cloud infra",
                isActive: true,
            },
        ];

        await db.insert(partnerService).values(services);
        console.log(`   ✅ Created ${services.length} services\n`);

        // 2. Create Test Affiliate Application
        console.log("2️⃣  Creating test affiliate application...");
        const affiliateId = uuidv7();
        await db.insert(affiliateApplication).values({
            id: affiliateId,
            fullName: "Test Partner",
            email: "testpartner@example.com",
            country: "Indonesia",
            strategy: "Digital marketing and referrals",
            status: "approved",
        });
        console.log(`   ✅ Created affiliate: ${affiliateId}\n`);

        // 3. Create Test Affiliate User
        console.log("3️⃣  Creating test affiliate user...");
        const password = "password123";
        const passwordHash = await bcrypt.hash(password, 10);

        await db.insert(affiliateUser).values({
            id: uuidv7(),
            affiliateId: affiliateId,
            email: "testpartner@example.com",
            passwordHash: passwordHash,
            isActive: true,
            forcePasswordChange: false,
        });
        console.log(`   ✅ Created user with email: testpartner@example.com`);
        console.log(`   🔑 Password: ${password}\n`);

        // 4. Create Test Leads
        console.log("4️⃣  Creating test leads...");
        const leads = [
            {
                id: uuidv7(),
                affiliateId: affiliateId,
                name: "John Doe",
                email: "john@example.com",
                phone: "+62812345678",
                serviceId: services[0].id,
                projectValue: 50000000,
                status: "Lead Created",
                remark: "Initial contact made",
            },
            {
                id: uuidv7(),
                affiliateId: affiliateId,
                name: "Jane Smith",
                email: "jane@example.com",
                phone: "+62812345679",
                serviceId: services[1].id,
                projectValue: 30000000,
                status: "Follow-up",
                remark: "Waiting for proposal review",
            },
        ];

        await db.insert(partnerLead).values(leads);
        console.log(`   ✅ Created ${leads.length} test leads\n`);

        // 5. Create Test Commission
        console.log("5️⃣  Creating test commission...");
        await db.insert(partnerCommission).values({
            id: uuidv7(),
            affiliateId: affiliateId,
            leadId: leads[0].id,
            serviceId: services[0].id,
            amount: 7500000,
            status: "Pending Transfer",
        });
        console.log(`   ✅ Created 1 test commission\n`);

        console.log("✅ Test data created successfully!\n");
        console.log("📝 Login credentials:");
        console.log("   Email: testpartner@example.com");
        console.log("   Password: password123\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating test data:", error);
        process.exit(1);
    }
};

createTestData();
