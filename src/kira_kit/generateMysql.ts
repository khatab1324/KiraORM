import { pathToFileURL } from "node:url";
import type { Config } from "./index.js";
import { TableRegistry } from "../decorators/Table.js";
import { table } from "node:console";
import { PrimaryKeyRegistry } from "../decorators/PrimaryColumn.js";
import { ColumnRegister, type ColumnMeta } from "../decorators/Column.js";
import { AbstractObject } from "./AbstractObject.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs";

//Todo : move the type
type Snapshot = {
  dialect: "mysql" | "postgres";
  id: string;
  tables: typeof AbstractObject.tables;
};
export default async function generateMysql(config: Config) {
  const url = pathToFileURL("src/schema/user.ts").href;
  await import(url);
  //Todo : map on all the files that end with ts

  //Todo : move all this logic of AbstractObject to function
  const tabel = TableRegistry.entries();
  console.log(tabel);
  const columns = ColumnRegister.entries();
  for (const [key, value] of columns) {
    const primaryKey = PrimaryKeyRegistry.get(key) || "";
    AbstractObject.tables.push({
      tableName: key.name,
      columns: value,
      primaryKey: "",
    });
    AbstractObject.tables[AbstractObject.tables.length - 1].primaryKey =
      primaryKey as string;

    console.log("AbstractObject:", AbstractObject);
    const newSnapshot = buildSnapshot(AbstractObject, "mysql");
    console.log(newSnapshot);
    writeHeapSnapshot(newSnapshot);
  }
}

export function buildSnapshot(
  abstractObject: typeof AbstractObject,
  dialect: Snapshot["dialect"]
): Snapshot {
  return {
    id: randomUUID(),
    dialect,
    tables: abstractObject.tables,
  };
}
export async function writeHeapSnapshot(snapshot: Snapshot) {
  const dbDir = path.resolve(process.cwd(), "src/db");
  const filePath = path.join(dbDir, "snapShop_V1.json");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 1), "utf-8");
}
