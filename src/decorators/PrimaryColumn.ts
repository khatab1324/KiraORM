
export const PrimaryKeyRegistry = new Map<new () => any, PropertyKey>();

export function PrimaryColumn() {
  return function (target: Object, context: string) {
    const className = target.constructor as new () => any;
    if (PrimaryKeyRegistry.has(className)) {
      throw new Error(
        `Primary key already used for ${className.name}: ${String(
          PrimaryKeyRegistry.get(className)
        )}`
      );
    }
    PrimaryKeyRegistry.set(className, context);
  };
}
