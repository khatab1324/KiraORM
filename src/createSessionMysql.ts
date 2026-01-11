import type mysql2 = require("mysql2");

class CreateSessionMysql {
  private _instance: mysql2.Pool;
  public constructor(instance: mysql2.Pool) {
    this._instance = instance;
  }
  public getConnection() {
    this._instance.getConnection((err, conn) => {
      if (err) {
        console.error("Error getting connection:", err);
        return;
      }
      console.log("Connection established:", conn.threadId);
    });
    return this._instance;
  }
}

export default CreateSessionMysql;
