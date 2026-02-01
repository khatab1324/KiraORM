import type { AbstractObject } from "./AbstractObject.js";

export type Snapshot = {
  dialect: "mysql" | "postgres";
  id: string;
  prevId: string | null;
  tables: typeof AbstractObject.tables;
};
