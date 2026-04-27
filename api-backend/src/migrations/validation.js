import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const defaultMigrationsFolder = path.resolve(
  __dirname,
  "../../drizzle/migrations",
);

const reservedAddTargets = new Set([
  "constraint",
  "index",
  "key",
  "primary",
  "foreign",
  "unique",
]);

function parseJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function splitStatements(sqlText) {
  return sqlText
    .replaceAll("--> statement-breakpoint", ";")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

function parseCreateTable(stmt) {
  const match = stmt.match(
    /create\s+table\s+(if\s+not\s+exists\s+)?`?([a-zA-Z0-9_]+)`?/i,
  );
  if (!match) return null;
  return {
    table: match[2],
    isGuarded: Boolean(match[1]),
  };
}

function parseAlterTable(stmt) {
  const match = stmt.match(/alter\s+table\s+`?([a-zA-Z0-9_]+)`?/i);
  if (!match) return null;
  return match[1];
}

function parseAddedColumns(stmt) {
  const found = [];
  const regex =
    /add\s+(?:column\s+)?(?:(if\s+not\s+exists)\s+)?`?([a-zA-Z0-9_]+)`?/gi;

  let match;
  while ((match = regex.exec(stmt)) !== null) {
    const candidate = (match[2] || "").toLowerCase();
    if (!candidate || reservedAddTargets.has(candidate)) {
      continue;
    }
    found.push({
      column: candidate,
      isGuarded: Boolean(match[1]),
    });
  }

  return found;
}

export function loadMigrationEntries(
  migrationsFolder = defaultMigrationsFolder,
) {
  const journalPath = path.join(migrationsFolder, "meta", "_journal.json");
  if (!fs.existsSync(journalPath)) {
    throw new Error(`Missing migration journal at ${journalPath}`);
  }

  const journal = parseJson(journalPath);
  if (!Array.isArray(journal.entries)) {
    throw new Error(`Invalid migration journal format at ${journalPath}`);
  }

  const entries = journal.entries.map((entry) => {
    const sqlPath = path.join(migrationsFolder, `${entry.tag}.sql`);
    if (!fs.existsSync(sqlPath)) {
      throw new Error(
        `Migration file not found for tag "${entry.tag}" at ${sqlPath}`,
      );
    }
    const sql = fs.readFileSync(sqlPath, "utf8");
    const hash = crypto.createHash("sha256").update(sql).digest("hex");

    return {
      ...entry,
      sqlPath,
      sql,
      hash,
    };
  });

  return {
    journalPath,
    journal,
    entries,
  };
}

export function validateMigrationSet(
  migrationsFolder = defaultMigrationsFolder,
) {
  const { journalPath, journal, entries } =
    loadMigrationEntries(migrationsFolder);
  const errors = [];

  const sqlFiles = fs
    .readdirSync(migrationsFolder)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const tags = entries.map((entry) => entry.tag);
  const tagSet = new Set(tags);

  if (tagSet.size !== tags.length) {
    errors.push("Journal contains duplicate migration tags.");
  }

  const missingSqlFiles = tags
    .filter((tag) => !sqlFiles.includes(`${tag}.sql`))
    .map((tag) => `${tag}.sql`);

  if (missingSqlFiles.length > 0) {
    errors.push(
      `Journal references missing SQL files: ${missingSqlFiles.join(", ")}`,
    );
  }

  const untrackedSqlFiles = sqlFiles.filter(
    (file) => !tagSet.has(file.replace(/\.sql$/, "")),
  );
  if (untrackedSqlFiles.length > 0) {
    errors.push(
      `SQL files not tracked in journal: ${untrackedSqlFiles.join(", ")}`,
    );
  }

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    if (entry.idx !== i) {
      errors.push(
        `Journal idx mismatch for "${entry.tag}": expected ${i}, found ${entry.idx}`,
      );
    }
    if (i > 0 && entry.when <= entries[i - 1].when) {
      errors.push(
        `Journal "when" is not strictly increasing at "${entry.tag}"`,
      );
    }
  }

  const createdTables = new Map();
  const addedColumns = new Map();

  for (const entry of entries) {
    if (entry.sql.trimEnd().endsWith("--> statement-breakpoint")) {
      errors.push(
        `Migration "${entry.tag}" ends with a trailing statement breakpoint, which creates an empty query during drizzle migrate`,
      );
    }

    const statements = splitStatements(entry.sql);
    const migrationAddedColumns = new Set();

    for (const stmt of statements) {
      const createTable = parseCreateTable(stmt);
      if (createTable && !createTable.isGuarded) {
        const tableKey = createTable.table.toLowerCase();
        const seenAt = createdTables.get(tableKey);
        if (seenAt) {
          errors.push(
            `Table "${createTable.table}" created again in "${entry.tag}" (already created in "${seenAt}")`,
          );
        } else {
          createdTables.set(tableKey, entry.tag);
        }
      }

      const alterTable = parseAlterTable(stmt);
      if (!alterTable) continue;
      const tableKey = alterTable.toLowerCase();

      for (const add of parseAddedColumns(stmt)) {
        if (add.isGuarded) continue;
        const columnKey = `${tableKey}.${add.column}`;
        const seenAt = addedColumns.get(columnKey);
        if (seenAt && seenAt !== entry.tag) {
          errors.push(
            `Column "${alterTable}.${add.column}" added again in "${entry.tag}" (already added in "${seenAt}")`,
          );
        }
        migrationAddedColumns.add(columnKey);
      }
    }

    for (const col of migrationAddedColumns) {
      addedColumns.set(col, entry.tag);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      [
        `Migration set validation failed (${errors.length} issue${errors.length > 1 ? "s" : ""}):`,
        ...errors.map((item) => `- ${item}`),
        `Journal: ${journalPath}`,
      ].join("\n"),
    );
  }

  return {
    journalPath,
    journal,
    entries,
  };
}
