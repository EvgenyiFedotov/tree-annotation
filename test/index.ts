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

const ConstTest1 = null;
const ConstTest2 = undefined;
const ConstTest3 = 1;
const ConstTest4: number = 1;
const ConstTest5 = 1,
  ConstTest6 = "test";
const ConstTest7: string | number = 1;
const ConstTest8 = (): number => 1;
const ConstTest9 = function(): void {};

let LetTest1 = null;
LetTest1 = 1;
let LetTest2 = 2;
let LetTest3: number = 3;
let LetTest4: string | number = "asd";
LetTest4 = 1;
