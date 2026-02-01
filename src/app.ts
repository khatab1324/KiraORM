import Kira from "./connection.js";
import {
  PrimaryColumn,
  PrimaryKeyRegistry,
} from "./decorators/PrimaryColumn.js";
import { Table } from "./decorators/Table.js";

@Table("User")
class User {
  static readonly name = "User";
  @PrimaryColumn()
  Id: string;
  Username!: string;
  Age!: number;
}
@Table("cat")
class Cat {
  static readonly name = "Cat";
  // @PrimaryColumn()
  cat_id!: number;
  name!: string;
  age!: number;
}
@Table("books")
class Book {
  static readonly name = "Book";
  @PrimaryColumn()
  book_id!: number;
  title!: string;
  author_fname!: string;
  author_lname!: string;
  released_year!: number;
  stock_quantity!: number;
  pages: number;
}
const db = Kira("mysql://root:112233@localhost/databaseOne", [User, Cat, Book]);
// const users = await db.user.find();
const user = await db.user.findWhere({ Username: "khattab" });
console.log(user);

db.close();
