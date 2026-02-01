import { pathToFileURL, fileURLToPath } from "node:url";
import type { Config } from "./index.js";
import { TableRegistry } from "../decorators/Table.js";
import { PrimaryKeyRegistry } from "../decorators/PrimaryColumn.js";
import { ColumnRegister, type ColumnMeta } from "../decorators/Column.js";
import { AbstractObject } from "./AbstractObject.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import {
  buildSnapshot,
  findSnapShot,
  ReadSnapShotsAndBuild,
  writeSnapshot,
} from "./snapShot.js";
import type { Snapshot } from "./typs.js";
import { generateMysqlSql, writeSqlFile } from "./dealWithSql.js";

export default async function generateMysql(config: Config) {
  const url = pathToFileURL(config.schema);
  const schemaPath = fileURLToPath(url);
  const filesSchema = fs.readdirSync(schemaPath);
  for (const schema of filesSchema) {
    if (schema.endsWith(".ts")) {
      const filePath = path.join(schemaPath, schema);
      await import(pathToFileURL(filePath).href);
    }
  }
  //Todo : move all this logic of AbstractObject to function
  // const tabel = TableRegistry.entries();
  const columns = ColumnRegister.entries();
  console.log(columns);

  for (const [key, value] of columns) {
    const primaryKey = PrimaryKeyRegistry.get(key) || "";
    AbstractObject.tables.push({
      tableName: key.name,
      columns: value,
      primaryKey: "",
    });
    AbstractObject.tables[AbstractObject.tables.length - 1].primaryKey =
      primaryKey as string;
  }
  console.log("AbstractObject:", AbstractObject);
  const newSnapshotAndCounter = await ReadSnapShotsAndBuild(AbstractObject);
  const { newSnapshot, counter } = newSnapshotAndCounter;
  const statements = await generateMysqlSql(newSnapshot);
  if (statements) {
    writeSnapshot(newSnapshot, counter);
    await writeSqlFile(statements);
  }
}
