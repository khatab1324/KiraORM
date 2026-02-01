import { Column } from "../decorators/Column.js";
import { PrimaryColumn } from "../decorators/PrimaryColumn.js";
import { Table } from "../decorators/Table.js";

@Table("book")
export class Books {
  static readonly name = "Books";
  @PrimaryColumn()
  @Column()
  book_id!: string;
  @Column()
  title!: string;
  @Column()
  author_fname!: string;
  @Column()
  author_lname!: string;
  @Column()
  released_year!: number;
  @Column()
  stock_quantity!: number;
  @Column()
  pages: number;
}
