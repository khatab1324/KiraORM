import fs from "node:fs";
import path from "node:path";
import type { Snapshot } from "./typs.js";
import type { AbstractObject } from "./AbstractObject.js";
import { randomUUID } from "node:crypto";

export async function ReadSnapShotsAndBuild(
  abstractObject: typeof AbstractObject
) {
  try {
    //TODO repeted code in wirteSqlFile
    const dbDir = path.resolve(process.cwd(), "src/db");

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const snapshotFiles = fs
      .readdirSync(dbDir)
      .filter((file) => file.endsWith(".json"));
    const counter = snapshotFiles.length + 1 || 1;
    const newSnapshot = buildSnapshot(abstractObject, "mysql", counter);
    return { newSnapshot, counter };
  } catch (e) {
    console.log(e.message);
  }
}
export async function findSnapShot(id: string) {
  const dbDir = path.resolve(process.cwd(), "src/db");
  const snapshotFiles = fs
    .readdirSync(dbDir)
    .filter((file) => file.endsWith(".json"));
  for (const file of snapshotFiles) {
    const filePath = path.join(dbDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const snapshot = JSON.parse(raw) as Snapshot;
    if (snapshot.id === id) {
      return snapshot;
    }
  }
  return null;
}

export function buildSnapshot(
  abstractObject: typeof AbstractObject,
  dialect: Snapshot["dialect"],
  counter
): Snapshot {
  const dbDir = path.resolve(process.cwd(), "src/db");
  const filePath = path.join(dbDir, `${counter - 1}_snapShop.json`);
  if (!fs.existsSync(filePath)) {
    return {
      id: randomUUID(),
      prevId: null,
      dialect,
      tables: abstractObject.tables,
    };
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const oldSnapshot = JSON.parse(raw) as Snapshot;

  return {
    id: randomUUID(),
    prevId: oldSnapshot.id,
    dialect,
    tables: abstractObject.tables,
  };
}

export function writeSnapshot(snapshot: Snapshot, counter: number) {
  const dbDir = path.resolve(process.cwd(), "src/db");
  const filePath = path.join(dbDir, `${counter}_snapShop.json`);
  fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2), "utf-8");
}
