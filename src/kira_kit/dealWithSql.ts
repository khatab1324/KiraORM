import path from "node:path";
import { findSnapShot } from "./snapShot.js";
import type { Snapshot } from "./typs.js";
import fs from "node:fs";
import type { ColumnMeta } from "../decorators/Column.js";
export async function generateMysqlSql(snapshot: Snapshot) {
  const statements: string[] = [];
  if (snapshot.prevId) {
    //TODO add the comapre logic
    const prevSnapShot = await findSnapShot(snapshot.prevId);
    if (prevSnapShot) {
      const diffs = compareTableNames(prevSnapShot.tables, snapshot.tables);
      if (diffs.length !== 0) {
        statements.push(...diffs);
      } else {
        const columnDiffs = compareColumns(
          prevSnapShot.tables,
          snapshot.tables
        );
        if (columnDiffs.length !== 0) {
          statements.push(...columnDiffs);
        }
      }

      if (statements.length === 0) {
        console.log("No changes detected between snapshots.");
        return null;
      }
    }
  } else {
    for (const table of snapshot.tables) {
      statements.push(createTabeleStatement(table));
    }
  }
  return statements.join("");
}

export async function writeSqlFile(statements: string) {
  const dbDir = path.resolve(process.cwd(), "src/db");
  const sqlFiles = fs
    .readdirSync(dbDir)
    .filter((file) => file.endsWith(".sql"));
  const counter = sqlFiles.length + 1 || 1;
  const filePath = path.join(dbDir, `${counter}_migration.sql`);
  fs.writeFileSync(filePath, statements, "utf-8");
}

export function compareTableNames(
  oldTables: Snapshot["tables"],
  newTables: Snapshot["tables"]
): string[] {
  const statements: string[] = [];
  const oldTableNames = oldTables.map((table) => table.tableName);
  const newTableNames = newTables.map((table) => table.tableName);
  const addedTables = newTableNames.filter(
    (name) => !oldTableNames.includes(name)
  );
  const removedTables = oldTableNames.filter(
    (name) => !newTableNames.includes(name)
  );
  for (const tableName of addedTables) {
    const table = newTables.find((t) => t.tableName === tableName);
    if (table) {
      statements.push(createTabeleStatement(table));
    }
  }
  for (const tableName of removedTables) {
    statements.push(`DROP TABLE \`${tableName}\`;`);
  }
  return statements;
}

export function createTabeleStatement(table: {
  tableName: string;
  columns: ColumnMeta[];
  primaryKey: string;
}): string {
  const columnDefinitions = table.columns.map((col) => {
    const sqlType = col.type;
    const nullable = col.nullable ? "NULL" : "NOT NULL";
    return `  \`${col.columnName}\` ${sqlType} ${nullable}`;
  });
  const primaryKeys = table.columns
    .filter((col) => col.columnName === table.primaryKey)
    .map((col) => `  PRIMARY KEY (\`${col.columnName}\`)`);
  const body = [...columnDefinitions, ...primaryKeys].join(",");
  return `CREATE TABLE \`${table.tableName}\` (${body});`;
}

export function compareColumns(
  oldTables: Snapshot["tables"],
  newTables: Snapshot["tables"]
): string[] {
  const statements: string[] = [];
  for (const newTable of newTables) {
    const oldTable = oldTables.find((t) => t.tableName === newTable.tableName);
    if (!oldTable) continue;
    const oldCols = oldTable.columns;
    const newCols = newTable.columns;
    const addedColumns = newCols.filter(
      (nc) => !oldCols.some((oc) => oc.columnName === nc.columnName)
    );
    for (const col of addedColumns) {
      const nullable = col.nullable ? "NULL" : "NOT NULL";
      statements.push(
        `ALTER TABLE \`${newTable.tableName}\` ADD COLUMN \`${col.columnName}\` ${col.type} ${nullable};`
      );
    }
    const removedColumns = oldCols.filter(
      (oc) => !newCols.some((nc) => nc.columnName === oc.columnName)
    );
    for (const col of removedColumns) {
      statements.push(
        `ALTER TABLE \`${newTable.tableName}\` DROP COLUMN \`${col.columnName}\`;`
      );
    }
    const commonColumns = newCols.filter((nc) =>
      oldCols.some((oc) => oc.columnName === nc.columnName)
    );
    for (const newCol of commonColumns) {
      const oldCol = oldCols.find((oc) => oc.columnName === newCol.columnName);
      if (!oldCol) continue;

      if (oldCol.type !== newCol.type || oldCol.nullable !== newCol.nullable) {
        const nullable = newCol.nullable ? "NULL" : "NOT NULL";
        statements.push(
          `ALTER TABLE \`${newTable.tableName}\` MODIFY COLUMN \`${newCol.columnName}\` ${newCol.type} ${nullable};`
        );
      }
    }
  }

  return statements;
}
