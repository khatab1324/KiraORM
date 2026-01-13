import { Table } from "./Table.js";
export const PrimaryKeyRegistry = new Map<new () => any, PropertyKey>();

export function PrimaryColumn() {
  return function (target: Object, context: string) {
    const className = target.constructor as new () => any;
    // console.log("className:", className.name);

    if (PrimaryKeyRegistry.has(className)) {
      throw new Error(
        `Primary key already used for ${className.name}: ${String(
          PrimaryKeyRegistry.get(className)
        )}`
      );
    }
    PrimaryKeyRegistry.set(className, context);
    // console.log("value:", target.toString());
    // console.log("Decorator applied to:", context);
  };
}
