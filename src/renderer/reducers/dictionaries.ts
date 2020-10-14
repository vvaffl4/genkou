
export type NumberDict<T> = { 
  [id: number] : T 
};

export type StringDict<T> = { 
  [id: number] : T 
};

export type Dict<T extends string | number, U> = {
  [id in T]: U
}