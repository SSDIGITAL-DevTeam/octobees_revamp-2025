import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../drizzle/db.js';
import { user } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const ADMIN_NAME = process.env.ADMIN_NAME || 'Super Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@local.dev';
const ADMIN_PASS = process.env.ADMIN_PASS || 'Admin123!';
const ADMIN_ROLE = 'Admin';
const ADMIN_STATUS = 'Active';

const FULL_FEATURES = {
    backoffice: true,
    modules: {
        users: true,
        orders: true,
        articles: true,
        services: true,
        categories: true,
        subscription: true,
        meta: true,
        affiliate: true,
        careers: true,
        settings: true,
    }
};

async function main() {
    const hash = await bcrypt.hash(ADMIN_PASS, 10);
    const [exists] = await db.select().from(user).where(eq(user.email, ADMIN_EMAIL)).limit(1);

    if (exists) {
        await db.update(user)
            .set({ password: hash, role: ADMIN_ROLE, status: ADMIN_STATUS, features: FULL_FEATURES })
            .where(eq(user.email, ADMIN_EMAIL));
        console.log(`✅ Updated existing admin: ${ADMIN_EMAIL}`);
    } else {
        await db.insert(user).values({
            id: crypto.randomUUID(),
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hash,
            status: ADMIN_STATUS,
            refreshToken: null,
            role: ADMIN_ROLE,
            features: FULL_FEATURES,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        console.log(`✅ Created new admin: ${ADMIN_EMAIL}`);
    }
    process.exit(0);
}

main().catch((e) => { console.error('❌ Failed to create admin', e); process.exit(1); });
