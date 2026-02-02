import type { Config } from "./index.js";
import loaderConfig from "./loader.js";
import { migrateMysql } from "./migrateMysql.js";
import { validateConfig } from "./validateConfig.js";

export default async function runMigrate() {
  const config = (await loaderConfig("kira.config.ts")) as Config;
  if (validateConfig(config)) {
    switch (config.DatabaseDailect) {
      case "mysql":
        migrateMysql(config);
        break;
      case "postgres":
        break;
      default:
        break;
    }
  }
}
