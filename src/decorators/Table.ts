
const TableRegistry = new Map<new () => any, string>();

function Table(name: string) {
  return function (constructor: new () => any) {
    console.log(new constructor);

    TableRegistry.set(constructor, name);
  };
}
export { TableRegistry, Table };
