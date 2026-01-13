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

// async function test() {
//   if (!db) return;
//   const [rows, fields] = await db.executeQuery("SELECT * FROM User");
//   console.log("Rows:", rows);
//   console.log("Fields:", fields);[number]
//   db.close();
// }
// test();

// await db.find<User>(() => new User());
// const user = await db.user.find();
// console.log(user.map((u) => u.Username));
// const books = await db.book.find();
// console.log(books.map((b) => b.book_id));
// const book = await db.book.findById(3);
// console.log(book);

// // const book = await db.book.findById({book_id: 1});
// console.log(books);
// PrimaryKeyRegistry.forEach((value, key) => {
//   console.log(`Class: ${key}, Primary Key: ${String(value)}`);
// });

// const users = await db.user.find();
// console.log(users);

const user = await db.user.findById(5);
console.log(user);
const cat = await db.cat.findById(2);
console.log(cat);
