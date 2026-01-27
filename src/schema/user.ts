import { Column } from "../decorators/Column.js";
import { PrimaryColumn } from "../decorators/PrimaryColumn.js";
import { Table } from "../decorators/Table.js";
import "reflect-metadata";
@Table("User")
export class User {
  static readonly name = "User";
  @PrimaryColumn()
  @Column()
  Id: string;
  @Column()
  Username!: string;
  @Column()
  Age!: number;
  @Column()
  IsAdmin:boolean
}
