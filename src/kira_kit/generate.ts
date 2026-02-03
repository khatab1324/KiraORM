import generateMysql from "./generateMysql.js";
import type { Config } from "./index.js";
import loaderConfig from "./loader.js";
import { validateConfig } from "./validateConfig.js";

export default async function runGenerate() {
  
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

