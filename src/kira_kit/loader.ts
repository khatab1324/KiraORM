import { pathToFileURL } from "node:url";

export default async function loaderConfig(configPath: string) {
  const url = pathToFileURL(configPath).href;

  const mod = await import(url);
  return mod.default;
}
