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
const ConstTest12: number = 1,
  ConstTest13: string = "test";

/**
 * Variables let
 */
let LetTest1 = null;
LetTest1 = 1;
let LetTest2 = 2;
let LetTest3: number = 3;
let LetTest4: string | number = "asd";
LetTest4 = 1;
let LetTest5: { a: number; b: string } = { a: 1, b: "c" };

var VarTest1: { a: TypeTest0; c: TypeTest3 } = { a: 1, c: "2" };

function FuncTest1(a: string, b: number, c?: string | number): Promise<string> {
  return Promise.resolve("");
}
function FuncTest2(b): Date {
  return new Date();
}
function FuncTest21(b = ""): Date {
  return new Date();
}
function FuncTest3(): void {}
function FuncTest4(d: number = 2) {}
function FuncTest5(
  d: Date,
  t2: TypeTest7,
  t3?: TypeTest3,
  t4: TypeTest3 = "asd"
) {}
function FuncTest6({
  d,
  t2,
  t3,
  t4 = "asd"
}: {
  d: Date;
  t2: TypeTest7;
  t3?: TypeTest3;
  t4?: TypeTest3;
}) {}
function FuncTest7(
  {
    a,
    b
  }: {
    a: Date;
    b: TypeTest7;
  },
  t: string
) {}
function FuncTest8(): Date {
  return new Date();
}
function* FuncTest9() {
  yield "2222";
  return true;
}
function* FuncTest91(): Iterator<boolean> {
  yield true;
}
async function FuncTest101(): Promise<TypeTest3> {
  return "ASD";
}
async function FuncTest10(b: string, x: number) {
  console.log(false);

  if (!!b) {
    if (x) return 100;
    if (x === 100) {
      return { a: 100, b: 200 };
    }
    if (x > 100) {
      if (x < 80) {
        if (x > 70) {
          return new Promise(res => res(123));
        }
      }
    }

    return "string";
  }

  return true;
}
function FuncTest11() {}
function FuncTest12() {
  const a = 1;
  const b = 2;
  const c = a + b;
  console.log(c);
}
