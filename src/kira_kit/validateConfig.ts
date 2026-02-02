import type { Config } from "./index.js";

export function validateConfig(obj: Config) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  if (!obj.DatabaseDailect) {
    throw new Error("DatabaseDailect is required");
  }

  if (!obj.schema) {
    throw new Error("schema path is required");
  }

  if (
    typeof obj.DatabaseDailect !== "string" ||
    typeof obj.dbCredentials.url !== "string" ||
    typeof obj.schema !== "string"
  ) {
    throw new Error("the config should be as string ");
  }
  return true;
}
