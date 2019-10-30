type TypeTest0 = number;
type TypeTest3 = string;
type TypeTest4 = Date;
type TypeTest1 = Array<
  | {
      a: Date;
      b: { c: number; d: null | string };
      g: Array<string>;
    }
  | string
>;
type TypeTest2 = { a: number; b: Date; c: undefined }[];
type TypeTest5 = TypeTest0 | TypeTest1;
type TypeTest6 = Array<number>;
type TypeTest7 = Array<TypeTest5>;
type TypeTest8<T> = Array<T>;
type TypeTest9<T = TypeTest7> = Array<T>;
type TypeTest10<T = number, K = any> = Array<[T, K]>;
