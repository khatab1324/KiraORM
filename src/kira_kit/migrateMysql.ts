import path from "node:path";
import CreateSessionMysql from "../createSessionMysql.js";
import type { Config } from "./index.js";
import mysql2 from "mysql2";
import fs from "node:fs";
import crypto from "node:crypto";
export async function migrateMysql(config: Config) {
  console.log("Migrating MySQL database with config:", config);
  const instance = mysql2.createPool({
    uri: config.dbCredentials.url,
    multipleStatements: true,
    waitForConnections: true,
  });
  const session = new CreateSessionMysql(instance).getConnection();
  const pool = session.promise();
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS _migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          hash VARCHAR(255) NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    const [rows] = await pool.query("SELECT filename, hash FROM _migrations");
    const appliedMigrations = rows as { filename: string; hash: string }[];
    const appliedMap = new Map(
      appliedMigrations.map((m) => [m.filename, m.hash])
    );
    const dbDir = path.resolve(process.cwd(), "src/db");
    if (!fs.existsSync(dbDir)) {
      console.log("No migration directory found at src/db");
      return;
    }
    const migrationFiles = fs
      .readdirSync(dbDir)
      .filter((file) => file.endsWith(".sql"))
      .sort((a, b) => {
        const numA = parseInt(a.split("_")[0]);
        const numB = parseInt(b.split("_")[0]);
        return numA - numB;
      });

    if (migrationFiles.length === 0) {
      console.log("No migration files found.");
      return;
    }
    for (const file of migrationFiles) {
      const filePath = path.join(dbDir, file);
      const sqlContent = fs.readFileSync(filePath, "utf-8");

      const currentHash = crypto
        .createHash("sha256")
        .update(sqlContent)
        .digest("hex");

      if (appliedMap.has(file)) {
        const storedHash = appliedMap.get(file);

        if (storedHash !== currentHash) {
          console.warn(
            `[WARNING] Migration file '${file}' has changed since it was applied! Do not edit existing migrations.`
          );
        }
        continue;
      }

      console.log(`Running migration: ${file}`);

      if (sqlContent.trim()) {
        await pool.query(sqlContent);
      }

      await pool.query(
        "INSERT INTO _migrations (filename, hash) VALUES (?, ?)",
        [file, currentHash]
      );
    }
    console.log("All migrations executed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
