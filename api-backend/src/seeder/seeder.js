import dotenv from "dotenv";
import { createUser } from "../user/user.service.js";
import { createPage } from "../page/page.service.js";
import logger from "../../utils/logger.js";

dotenv.config();

async function seed() {
  const pages = process.env.DEFAULT_PAGE_TITLE.split(",");

  try {
    // await createUser({
    //   name: process.env.SUPER_ADMIN_NAME,
    //   email: process.env.SUPER_ADMIN_EMAIL,
    //   password: process.env.SUPER_ADMIN_PASSWORD,
    //   status: process.env.SUPER_ADMIN_STATUS,
    //   role: process.env.SUPER_ADMIN_ROLE,
    //   features: process.env.SUPER_ADMIN_FEATURES,
    // });

    await Promise.all(pages.map((page) => createPage({ page: page.trim() })));

  } catch (error) {
    logger.error(`SEEDER error: ${error.message}`);
  } finally {
    process.exit(0);
  }
}

seed();
