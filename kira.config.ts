import { defineKiraConfig } from "./src/kira_kit/index.js";
export default defineKiraConfig({
  DatabaseDailect: "mysql",
  dbCredentials: { url: "mysql://root:112233@localhost/firstDatabase" },
  schema: "./src/schema",
});
