import path from "node:path";
import { pathToFileURL } from "node:url";

export default async function loaderConfig(configPath: string) {
  const absolutePath = path.resolve(process.cwd(), configPath);
  const url = pathToFileURL(absolutePath).href;
  try {
    const mod = await import(url);
    return mod.default;
  } catch (err) {
    console.error("\n error loading configuration file:");
    console.error(`File: ${absolutePath}`);
    console.error(err);
    process.exit(1);
  }
}
