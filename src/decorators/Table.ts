const TableRegistry = new Map<new ()=>any, string>();

function Table(name: string) {
  return function (constructor: new ()=>any) {
    TableRegistry.set(constructor, name);
  };
}

export { TableRegistry, Table };
