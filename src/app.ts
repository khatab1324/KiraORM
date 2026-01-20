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

// // const book = await db.book.findById({book_id: 1});
// console.log(books);
// PrimaryKeyRegistry.forEach((value, key) => {
//   console.log(`Class: ${key}, Primary Key: ${String(value)}`);
// });

// const users = await db.user.find();
// console.log(users);

// const user = await db.user.findById(5);
// console.log(user);
// const cat = await db.cat.findById(2);
// console.log(cat);

const users = await db.user.find();

const user = await db.user.findById(1);

const userByName = await db.user.findWhere({ Username: "sami" });

const newUser = await db.user.insert({
  Id: "8",
  Username: "khattab",
  Age: 34,
});

const updateUser = await db.user.update(8, {
  Id: "8",
  Username: "khattab",
  Age: 35,
});

await db.user.delete(8);
await db.user.deleteWhere({ Username: "khattab" });

console.log(userByName);
console.log(users);
console.log(user);
// const newUser = await db.user.insert({
//   Id: "13",
//   Username: "newuser",
//   Age: 30,
// });

// console.log(newUser);
// await db.user.deleteWhere({Username: "khattab"});

console.log(updateUser);

db.close();

const user2 = await db.user.findById(3);
