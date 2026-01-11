export type GenerateSchema<T extends (new () => any)[]> = {
  [K in T[number] as Lowercase<
    K extends { name: infer N extends string } ? N : never
  >]: {
    find: () => Promise<InstanceType<K>[]>;
  };
};
