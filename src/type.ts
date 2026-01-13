// export type GenerateSchema<T extends (new () => any)[]> = {
//   [K in T[number] as string]: {
//     find: () => Promise<InstanceType<K>[]>;
//     findById: (id: string|number) => Promise<InstanceType<K> | null>;
//   };
// };
export type GenerateSchema<T extends (new () => any)[]> = {
  [K in T[number] as Lowercase<
    K extends { name: infer N extends string } ? N : never
  >]: {
    find: () => Promise<InstanceType<K>[]>;
    findById: (id: string | number) => Promise<InstanceType<K> | null>;
  };
};
