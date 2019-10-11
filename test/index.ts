// Types
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

/** Interfaces */
interface TestInterface1 {
  a: 1;
  b: "1";
  c: string;
  d: number;
  g: TypeTest5;
  i: {
    i1: TypeTest0;
    i2: TypeTest3;
  };
}

/**
 * Variables const
 */
const ConstTest1 = null;
const ConstTest2 = undefined;
const ConstTest3 = 1;
const ConstTest4: number = 1;
const ConstTest5 = 1,
  ConstTest6 = "test";
const ConstTest7: string | number = 1;
const ConstTest8 = (): number => 1;
const ConstTest9 = function(): void {};
const ConstTest10: TypeTest7 = [];
const ConstTest11: TestInterface1 = {
  a: 1,
  b: "1",
  c: "asd",
  d: 222,
  g: [
    {
      a: new Date(),
      b: { c: 1, d: null },
      g: ["qwe"]
    }
  ],
  i: {
    i1: 1,
    i2: "asd"
  }
};

/**
 * Variables let
 */
let LetTest1 = null;
LetTest1 = 1;
let LetTest2 = 2;
let LetTest3: number = 3;
let LetTest4: string | number = "asd";
LetTest4 = 1;
