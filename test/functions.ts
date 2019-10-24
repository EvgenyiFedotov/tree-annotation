function name1() {}
function name2(a) {}
function name3(a, b, c) {}
function name4(a: string, b: number, c?: any, d?: string | number) {}
function name5({ a: string, b: number }) {}
function name6(
  { a, b }: { a: string; b: number },
  { c, d: { d1, d2 } }: { c: Date; d: { d1: number; d2: Date } }
) {}
function name7(a: number = 1) {}
function name8(b = "2") {}
function name9(): Date {
  return new Date();
}
function name10(): string | number {
  return 1;
}
function name11(): Date {
  return new Date();
}
function* name12() {
  yield "2222";
  return true;
}
function* name13(): Iterator<boolean> {
  yield true;
}
async function name14(): Promise<string | number> {
  return "ASD";
}
async function name15(b: string, x: number) {
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
    if (x > 200) {
      return 1;
    }

    return "string";
  }

  return true;
}
function name16() {}
function name17() {
  const a = 1;
  const b = 2;
  const c = a + b;
  console.log(c);
}
