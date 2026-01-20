import { defineKiraConfig } from "./src/kira_kit";
export default defineKiraConfig({
  DatabaseDailect: "mysql",
  dbCredentials: { url: "mysql://root:112233@localhost/databaseOne" },
  schema: "./src/schema",
});
