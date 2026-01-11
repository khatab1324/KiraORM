import { log } from "node:console";
import Kira from "./connection.js";
import { Table } from "./decorators/Table.js";
@Table("User")
class User {
  Id!: string;
  Username!: string;
  Age!: number;
}
@Table("cat")
class Cat {
  cat_id!: number;
  name!: string;
  age!: number;
}

const db = Kira("mysql://root:112233@localhost/databaseOne", [User, Cat]);

// async function test() {
//   if (!db) return;
//   const [rows, fields] = await db.executeQuery("SELECT * FROM User");
//   console.log("Rows:", rows);
//   console.log("Fields:", fields);
//   db.close();
// }
// test();

// await db.find<User>(() => new User());
const user = await db.user.find();

console.log(user);
