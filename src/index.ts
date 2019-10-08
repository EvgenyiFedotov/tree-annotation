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

// const ConstTest0 = null;
// const ConstTest1 = 1;
// const ConstTest2 = "2";

// let LetTest0 = null;
// let LetTest1 = 1;
// let LetTest2 = "2";
