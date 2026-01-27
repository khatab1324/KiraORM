import type { ColumnMeta } from "../decorators/Column.js";
export const AbstractObject: {
  tables: {
    tableName: string;
    columns: ColumnMeta[];
    primaryKey: string;
  }[];
} = {
  tables: [],
};
