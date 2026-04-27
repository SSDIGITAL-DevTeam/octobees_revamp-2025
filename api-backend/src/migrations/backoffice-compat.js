const tableExists = async (pool, tableName) => {
  const [rows] = await pool.query(
    `
      select 1
      from information_schema.tables
      where table_schema = database()
        and table_name = ?
      limit 1
    `,
    [tableName],
  );

  return rows.length > 0;
};

const columnExists = async (pool, tableName, columnName) => {
  const [rows] = await pool.query(
    `
      select 1
      from information_schema.columns
      where table_schema = database()
        and table_name = ?
        and column_name = ?
      limit 1
    `,
    [tableName, columnName],
  );

  return rows.length > 0;
};

const addColumnIfMissing = async (pool, tableName, columnName, definition) => {
  if (await columnExists(pool, tableName, columnName)) return false;
  await pool.query(`alter table \`${tableName}\` add column ${definition}`);
  return true;
};

const runIfTableExists = async (pool, tableName, callback) => {
  if (!(await tableExists(pool, tableName))) return false;
  return callback();
};

export const ensureBackofficeCompatSchema = async (pool, logger) => {
  let repaired = false;

  const createStatements = [
    `create table if not exists \`benefit\` (
      \`id\` varchar(36) not null,
      \`value\` varchar(191) not null,
      \`idPlan\` varchar(191) not null,
      constraint \`benefit_id\` primary key(\`id\`)
    )`,
    `create table if not exists \`categoryservice\` (
      \`id\` varchar(36) not null,
      \`name\` varchar(191) not null,
      \`heading\` varchar(191) not null,
      \`description\` varchar(191) not null,
      \`status\` enum('Draft','Active','NonActive') not null default 'Draft',
      \`slug\` varchar(191) not null,
      \`created_at\` timestamp not null default CURRENT_TIMESTAMP,
      \`updated_at\` timestamp not null default CURRENT_TIMESTAMP,
      constraint \`categoryservice_id\` primary key(\`id\`),
      constraint \`categoryservice_name_unique\` unique(\`name\`),
      constraint \`categoryservice_slug_unique\` unique(\`slug\`)
    )`,
    `create table if not exists \`position\` (
      \`id\` int auto_increment not null,
      \`name\` varchar(255) not null,
      \`status\` enum('Active','NonActive') not null default 'Active',
      \`createdAt\` timestamp not null default CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp not null default CURRENT_TIMESTAMP,
      constraint \`position_id\` primary key(\`id\`),
      constraint \`position_name_unique\` unique(\`name\`)
    )`,
    `create table if not exists \`career\` (
      \`id\` varchar(36) not null,
      \`name\` varchar(255) not null,
      \`email\` varchar(255) not null,
      \`phoneNumber\` varchar(255) not null,
      \`positionId\` int,
      \`resume\` text not null,
      \`portfolio\` varchar(255) not null,
      \`message\` text,
      \`status\` enum('Rejected','Review','Accepted') not null,
      \`createdAt\` timestamp not null default CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp not null default CURRENT_TIMESTAMP,
      constraint \`career_id\` primary key(\`id\`),
      constraint \`career_email_unique\` unique(\`email\`)
    )`,
    `create table if not exists \`planservice\` (
      \`id\` varchar(36) not null,
      \`name\` varchar(191) not null,
      \`type\` enum('Standard','Premium') not null,
      \`showPrice\` boolean not null default true,
      \`status\` enum('Draft','Active','NonActive') not null,
      \`options\` varchar(191) not null,
      \`descriptions\` varchar(191) not null,
      \`categoryId\` varchar(191) not null,
      \`created_at\` timestamp not null default CURRENT_TIMESTAMP,
      \`updated_at\` timestamp not null default CURRENT_TIMESTAMP,
      constraint \`planservice_id\` primary key(\`id\`)
    )`,
    `create table if not exists \`price\` (
      \`id\` varchar(36) not null,
      \`curr\` enum('IDR','SGR','MYR') not null,
      \`amount\` double not null,
      \`discount\` double not null,
      \`idPlan\` varchar(191) not null,
      constraint \`price_id\` primary key(\`id\`)
    )`,
  ];

  for (const statement of createStatements) {
    await pool.query(statement);
  }

  repaired =
    (await runIfTableExists(pool, "user", async () => {
      let changed = false;
      changed =
        (await addColumnIfMissing(
          pool,
          "user",
          "user_status",
          "`user_status` enum('Draft','Active','NonActive') not null default 'Active'",
        )) || changed;

      if (await columnExists(pool, "user", "status")) {
        await pool.query(
          "update `user` set `user_status` = case when `status` in ('Draft','Active','NonActive') then `status` else `user_status` end",
        );
        changed = true;
      }

      if (await columnExists(pool, "user", "plan_status")) {
        await pool.query(
          "update `user` set `user_status` = case when `plan_status` in ('Draft','Active','NonActive') then `plan_status` else `user_status` end",
        );
        changed = true;
      }

      return changed;
    })) || repaired;

  repaired =
    (await runIfTableExists(pool, "blog", async () => {
      let changed = false;
      changed =
        (await addColumnIfMissing(
          pool,
          "blog",
          "blog_status",
          "`blog_status` enum('Published','Archived','Draft') not null default 'Draft'",
        )) || changed;

      if (await columnExists(pool, "blog", "status")) {
        await pool.query(
          "update `blog` set `blog_status` = case when `status` = 'Published' then 'Published' when `status` = 'Draft' then 'Draft' else 'Archived' end",
        );
        changed = true;
      }

      changed =
        (await addColumnIfMissing(pool, "blog", "pdf", "`pdf` text")) ||
        changed;
      changed =
        (await addColumnIfMissing(
          pool,
          "blog",
          "publish_date",
          "`publish_date` timestamp null",
        )) || changed;

      return changed;
    })) || repaired;

  repaired =
    (await runIfTableExists(pool, "lead", async () => {
      let changed = false;
      changed =
        (await addColumnIfMissing(
          pool,
          "lead",
          "business",
          "`business` varchar(255) not null default ''",
        )) || changed;
      changed =
        (await addColumnIfMissing(
          pool,
          "lead",
          "company_name",
          "`company_name` varchar(255) not null default ''",
        )) || changed;
      changed =
        (await addColumnIfMissing(
          pool,
          "lead",
          "company_website",
          "`company_website` varchar(255)",
        )) || changed;
      changed =
        (await addColumnIfMissing(
          pool,
          "lead",
          "created_at",
          "`created_at` timestamp not null default CURRENT_TIMESTAMP",
        )) || changed;
      changed =
        (await addColumnIfMissing(
          pool,
          "lead",
          "updated_at",
          "`updated_at` timestamp not null default CURRENT_TIMESTAMP",
        )) || changed;
      changed =
        (await addColumnIfMissing(
          pool,
          "lead",
          "from",
          "`from` varchar(50) not null default ''",
        )) || changed;
      changed =
        (await addColumnIfMissing(
          pool,
          "lead",
          "is_agree",
          "`is_agree` boolean default true",
        )) || changed;

      if (await columnExists(pool, "lead", "bussiness")) {
        await pool.query(
          "update `lead` set `business` = `bussiness` where `business` = ''",
        );
        changed = true;
      }
      if (await columnExists(pool, "lead", "companyName")) {
        await pool.query(
          "update `lead` set `company_name` = `companyName` where `company_name` = ''",
        );
        changed = true;
      }
      if (await columnExists(pool, "lead", "companyWebsite")) {
        await pool.query(
          "update `lead` set `company_website` = `companyWebsite` where `company_website` is null",
        );
        changed = true;
      }
      if (await columnExists(pool, "lead", "createdAt")) {
        await pool.query(
          "update `lead` set `created_at` = `createdAt` where `createdAt` is not null",
        );
        changed = true;
      }
      if (await columnExists(pool, "lead", "updatedAt")) {
        await pool.query(
          "update `lead` set `updated_at` = `updatedAt` where `updatedAt` is not null",
        );
        changed = true;
      }

      return changed;
    })) || repaired;

  if (repaired) {
    logger.warn("Repaired legacy back-office schema compatibility at startup.");
  }
};
