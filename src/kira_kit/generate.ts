import type { Config } from "./index.js";
import loaderConfig from "./loader.js";

export default async function runGenerate(argv) {
  const config = (await loaderConfig("kira.config.ts")) as Config;
  console.log(config);
}
