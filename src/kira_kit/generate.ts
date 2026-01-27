import generateMysql from "./generateMysql.js";
import type { Config } from "./index.js";
import loaderConfig from "./loader.js";

export default async function runGenerate(argv) {
  
  const config = (await loaderConfig("kira.config.ts")) as Config;
  console.log(config);
  if (validateConfig(config)) {
    switch (config.DatabaseDailect) {
      case "mysql":
        generateMysql(config);
        break;
      case "postgres":
        break;
      default:
        break;
    }
  }
}
function validateConfig(obj: Config) {
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
