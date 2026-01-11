const TableRegistry = new Map<Function, string>();

function Table(name: string) {
  return function (constructor: Function) {
    TableRegistry.set(constructor, name);
  };
}

export { TableRegistry, Table };
