import { Column } from "../decorators/Column.js";
import { PrimaryColumn } from "../decorators/PrimaryColumn.js";
import { Table } from "../decorators/Table.js";
@Table("User")
export class User {
  static readonly name = "Users";
  @PrimaryColumn()
  @Column()
  User_Id: number;
  @Column()
  Id: number;
  @Column()
  Username!: string;
  @Column()
  Age!: string;
  @Column()
  IsAdmin: boolean;
}
