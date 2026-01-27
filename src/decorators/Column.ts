import "reflect-metadata";

export type ColumnMeta = {
  columnName: string;
  nullable: boolean;
  type: string;
};
export const ColumnRegister = new Map<new () => any, ColumnMeta[]>();

export function Column() {
  return function (target: Object, context: string) {
    const className = target.constructor as new () => any;
    const existingColumns = ColumnRegister.get(className) || [];
    const meteType = Reflect.getMetadata("design:type", target, context);
    // TODO : move this from Column becuase this just for mysql
    console.log("====================================");
    console.log(meteType.name);
    let type;
    switch (meteType.name) {
      case "String":
        type = "varchar(255)";
        break;
      case "Number":
        type = "int";
        break;
      case "Boolean":
        type = "boolean";
        break;
      default:
        break;
    }

    console.log("====================================");
    ColumnRegister.set(className, [
      ...existingColumns,
      {
        columnName: context,
        type,
        nullable: false,
      },
    ]);
  };
}
