export type dbDailects = "mysql" | "postgres";
export type Config = {
  DatabaseDailect: dbDailects;
  schema: string;
  dbCredentials: {
    url: string;
  };
};

export function defineKiraConfig(config: Config) {
  return config;
}
