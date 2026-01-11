import mysql2 from "mysql2";
import type { Pool as PromisePool } from "mysql2/promise";
import CreateSessionMysql from "./createSessionMysql.js";
import { TableRegistry } from "./decorators/Table.js";
import type { GenerateSchema } from "./type.js";
function Kira<T extends (new () => any)[]>(params: string, models: T) {
  if (typeof params[0] === "string") {
    if (params.startsWith("mysql://")) {
      const connectionString = params;
      const instance = mysql2.createPool({
        uri: connectionString,
      });
      const container = new DatabaseContainerMysql(
        new CreateSessionMysql(instance).getConnection()
      );
      // return new Proxy(container, {
      //   get(target, prop: string) {
      //     console.log(prop);
      //     if (prop in target) return target[prop];
      //     const entityClass = models.find(
      //       (m) => m.name.toLowerCase() === prop.toLowerCase()
      //     );
      //     if (entityClass) {
      //       return {
      //         find: () => target.find(entityClass),
      //       };
      //     }
      //   },
      // }) as DatabaseContainerMysql & GenerateSchema<T>;
      models.forEach((entityClass) => {
        const prop = entityClass.name.toLowerCase();
        Object.defineProperty(container, prop, {
          get() {
            return {
              find: () => container.find(entityClass),
            };
          },
          configurable: true,
          enumerable: true,
        });
      });
      return container as DatabaseContainerMysql & GenerateSchema<T>;
    }
    if (params.startsWith("postgresql://")) {
    }
  }
}
class DatabaseContainerMysql {
  private _dbInstance: PromisePool;
  public constructor(dbInstance: mysql2.Pool) {
    this._dbInstance = dbInstance.promise();
  }
  public async find<T>(entityClass: new () => T): Promise<T[]> {
    const tableName = TableRegistry.get(entityClass);
    if (!tableName) throw new Error("Entity not registered");
    const [rows] = await this.executeQuery(`SELECT * FROM ${tableName}`);
    return (rows as any[]).map((row) => {
      const instance = new entityClass();
      Object.assign(instance, row);
      return instance;
    });
  }
  public async executeQuery(query: string, values?: any[]) {
    try {
      const [rows, fields] = await this._dbInstance.execute(query, values);
      await this._dbInstance.end();
      return [rows, fields];
    } catch (err) {
      console.error("Error executing query:", err);
      throw err;
    }
  }
  public async transactions(queries: { query: string; values?: any[] }[]) {
    const connection = await this._dbInstance.getConnection();
    try {
      await connection.beginTransaction();
      for (const q of queries) {
        await connection.execute(q.query, q.values);
      }
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      console.error("Error executing transaction:", err);
      throw err;
    } finally {
      connection.release();
    }
  }
  public close() {
    this._dbInstance.end();
  }
}
export default Kira;
