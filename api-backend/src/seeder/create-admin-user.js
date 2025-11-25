import bcrypt from "bcryptjs";
import { db } from "../../drizzle/db.js";
import { user } from "../../drizzle/schema.js";
import { v4 as uuidv7 } from "uuid";

const createAdminUser = async () => {
    try {
        console.log("🌱 Creating admin user...");

        const password = "password123";
        const passwordHash = await bcrypt.hash(password, 10);
        const email = "admin@octobees.com";

        await db.insert(user).values({
            id: uuidv7(),
            name: "Backoffice Admin",
            email: email,
            password: passwordHash,
            status: "Active",
            role: "admin",
            features: ["dashboard", "user", "blog", "services", "career", "meta", "subscription", "order", "affiliate"],
        });

        console.log(`   ✅ Created admin user: ${email}`);
        console.log(`   🔑 Password: ${password}\n`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        process.exit(1);
    }
};

createAdminUser();
