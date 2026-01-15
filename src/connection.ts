import mysql2 from "mysql2";
import type { Pool as PromisePool } from "mysql2/promise";
import CreateSessionMysql from "./createSessionMysql.js";
import { TableRegistry } from "./decorators/Table.js";
import type { GenerateSchema } from "./type.js";
import { PrimaryKeyRegistry } from "./decorators/PrimaryColumn.js";
// function Kira<T extends any[]>(params: string, models: T) {
function Kira<T extends (new () => any)[]>(params: string, models: T) {
  if (typeof params === "string") {
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
              //TODO: this need to refact to not access to find from container
              find: () => container.find(entityClass),
              findById: (id: string | number) =>
                container.findById(id, entityClass) as InstanceType<
                  typeof entityClass
                >,
              findWhere: (params: Partial<InstanceType<typeof entityClass>>) =>
                (container.findWhere(entityClass, params) as InstanceType<
                  typeof entityClass
                >) || null,
              insert: (params: Partial<InstanceType<typeof entityClass>>) =>
                container.insert(entityClass, params) as Promise<
                  InstanceType<typeof entityClass>
                >,
              delete: (id: string | number) =>
                container.delete(id, entityClass) as Promise<void>,
              deleteWhere: (
                params: Partial<InstanceType<typeof entityClass>>
              ) => container.deleteWhere(entityClass, params) as Promise<void>,
              update: (
                id: string | number,
                params: Partial<InstanceType<typeof entityClass>>
              ) =>
                container.update(id, params, entityClass) as Promise<
                  InstanceType<typeof entityClass>
                >,
            };
          },
        });
      });
      return container as DatabaseContainerMysql & GenerateSchema<T>;
    }
    if (params.startsWith("postgresql://")) {
    }
  }
}
class DatabaseContainerMysql {
  //TODO : refact this to be in another class that just container will access to it , that have the find findById ....
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
  public async findById<T>(id: string | number, ctor: new () => T): Promise<T> {
    if (!PrimaryKeyRegistry.has(ctor)) {
      throw new Error(`Primary key not defined for ${ctor.name}`);
    }
    const primaryKey = PrimaryKeyRegistry.get(ctor) as string;
    console.log("primaryKey:", primaryKey);
    const classnameInTable = TableRegistry.get(ctor);
    const [rows] = await this.executeQuery(
      `SELECT * FROM ${classnameInTable} WHERE ${primaryKey} = ? LIMIT 1`,
      [id]
    );
    if ((rows as any[]).length > 0) {
      const instance = new ctor();
      Object.assign(instance, (rows as any[])[0]);
      return instance;
    }
  }
  public async findWhere<T>(ctor: new () => T, params: Partial<T>) {
    const classnameInTable = TableRegistry.get(ctor);
    const [key, value] = Object.entries(params)[0];
    // TODO : make it take more then value making and with it
    // for(const key in params)
    const [rows] = await this.executeQuery(
      `SELECT * FROM ${classnameInTable} WHERE ${key} = ? LIMIT 1`,
      [value]
    );
    if ((rows as any[]).length > 0) {
      const instance = new ctor();
      Object.assign(instance, (rows as any[])[0]);
      return instance;
    }
  }
  public async insert<T>(ctor: new () => T, params: Partial<T>) {
    const classnameInTable = TableRegistry.get(ctor);
    const keys = Object.keys(params);
    const values = Object.values(params);
    const placeholders = keys.map(() => "?").join(", ");
    console.log(placeholders);

    const query = `INSERT INTO ${classnameInTable} (${keys.join(
      ", "
    )}) VALUES (${placeholders})`;
    const [result]: any = await this.executeQuery(query, values);
    if (result.affectedRows === 0) {
      throw new Error(
        "Insert failed maybe due to invalid data or duplicate key"
      );
    }
    return Object.assign(params);
  }
  public async delete<T>(id: string | number, ctor: new () => T): Promise<T> {
    if (!PrimaryKeyRegistry.has(ctor)) {
      throw new Error(`Primary key not defined for ${ctor.name}`);
    }
    const primaryKey = PrimaryKeyRegistry.get(ctor) as string;
    const classnameInTable = TableRegistry.get(ctor);
    const [result]: any = await this.executeQuery(
      `DELETE FROM ${classnameInTable} WHERE ${primaryKey} = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error(
        "primary key not found in the table for delete operation"
      );
    }
    return;
  }
  public async deleteWhere<T>(
    ctor: new () => T,
    params: Partial<T>
  ): Promise<T> {
    const classnameInTable = TableRegistry.get(ctor);
    const [key, value] = Object.entries(params)[0];
    // TODO : make it take more then value making and with it
    // for(const key in params)
    const [result]: any = await this.executeQuery(
      `DELETE FROM ${classnameInTable} WHERE ${key} = ?`,
      [value]
    );
    if (result.affectedRows === 0) {
      console.warn("no rows matched the condition for delete operation");
    }
    return;
  }
  public async update<T>(
    id: string | number,
    params: Partial<T>,
    ctor: new () => T
  ) {
    const classnameInTable = TableRegistry.get(ctor);
    if (!PrimaryKeyRegistry.has(ctor)) {
      throw new Error(`Primary key not defined for ${ctor.name}`);
    }
    const primaryKey = PrimaryKeyRegistry.get(ctor) as string;
    const keys = Object.keys(params);
    const values = Object.values(params);
    values.push(id);
    const setClause = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE ${classnameInTable} SET ${setClause} WHERE ${primaryKey} = ?`;
    const [result]: any = await this.executeQuery(query, values);
    if (result.affectedRows === 0) {
      throw new Error(
        "Update failed maybe due to invalid data or primary key not found"
      );
    }
    const updatedRecord = await this.findById(id, ctor);
    return updatedRecord;
  }

  public async executeQuery(query: string, values?: any[]) {
    try {
      console.log(values);

      const [rows, fields] = await this._dbInstance.execute(query, values);
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
