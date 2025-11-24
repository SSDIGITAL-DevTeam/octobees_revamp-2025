import { db } from "../../drizzle/db.js";
import { partnerService } from "../../drizzle/schema.js";
import { v4 as uuidv7 } from "uuid";

const partnerServices = [
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
    {
        id: uuidv7(),
        name: "Mobile App Development",
        commissionPercentage: 15,
        description: "Native and cross-platform mobile application development",
        isActive: true,
    },
    {
        id: uuidv7(),
        name: "Data Integration",
        commissionPercentage: 14,
        description: "Enterprise data integration and ETL solutions",
        isActive: true,
    },
    {
        id: uuidv7(),
        name: "UI/UX Design",
        commissionPercentage: 10,
        description: "User interface and user experience design services",
        isActive: true,
    },
];

export const seedPartnerServices = async () => {
    try {
        console.log("🌱 Seeding partner services...");

        // Check if services already exist
        const existing = await db.select().from(partnerService).limit(1);

        if (existing.length > 0) {
            console.log("⚠️  Partner services already exist. Skipping seed.");
            return;
        }

        // Insert services
        await db.insert(partnerService).values(partnerServices);

        console.log(`✅ Successfully seeded ${partnerServices.length} partner services`);
    } catch (error) {
        console.error("❌ Error seeding partner services:", error);
        throw error;
    }
};

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedPartnerServices()
        .then(() => {
            console.log("✅ Seeding completed");
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Seeding failed:", error);
            process.exit(1);
        });
}
