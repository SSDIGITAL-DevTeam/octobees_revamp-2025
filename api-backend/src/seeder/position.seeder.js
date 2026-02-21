import { db } from "../../drizzle/db.js";
import { position } from "../../drizzle/schema.js";

const positions = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
    "UI/UX Designer",
    "Mobile Developer",
    "DevOps Engineer",
    "Project Manager",
    "Business Development",
    "Digital Marketing",
    "Content Writer",
    "Graphic Designer",
    "QA Engineer",
    "Data Analyst",
    "Sales",
    "Human Resources",
];

const seedPositions = async () => {
    try {
        console.log("🌱 Seeding positions...\n");

        for (const name of positions) {
            await db
                .insert(position)
                .values({ name, status: "Active" })
                .onDuplicateKeyUpdate({ set: { status: "Active" } });
            console.log(`   ✅ ${name}`);
        }

        console.log(`\n✅ ${positions.length} positions seeded successfully!`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding positions:", error);
        process.exit(1);
    }
};

seedPositions();
