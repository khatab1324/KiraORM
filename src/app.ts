import Kira from "./connection.js";
import { Books } from "./schema/book.js";
import { User } from "./schema/user.js";

const db = Kira("mysql://root:112233@localhost/firstDatabase", [User, Books]);

let user = await db.user.findWhere({ Username: "khattab" });
if (!user) {
  await db.user.insert({
    Id: 1,
    Username: "khattab",
    Age: "21",
    IsAdmin: true,
  });
}
user = await db.user.findWhere({ Username: "khattab" });
console.log(user);
db.close();
