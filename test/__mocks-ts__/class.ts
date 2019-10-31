class ClassTest1 {}
class ClassTest2 {
  static prop1 = 1;
  protected prop2 = 2;
  private prop3 = 3;
  prop4 = "123";
  prop5 = { a: 123, b: "123" };
  private prop6: Map<string, string>;
  private prop7: Map<string, ClassTest1>;
  prop8: ClassTest1;
  static prop9: ClassTest1 = new ClassTest1();
  prop10 = new ClassTest1();
}
class ClassTest21 {
  arrowHandler1 = (): string => {
    return "arr";
  };
  arrowHandler2 = (): { a: string; b: number } => {
    return { a: "1", b: 2 };
  };
  arrowHandler3 = () => {
    return { c: "1", d: 2 };
  };
  arrowHandler4 = () => {
    return new Promise(() => {});
  };
  arrowHandler5 = async () => {
    return "res";
  };
  arrowHandler6 = async (): Promise<number> => {
    return 1;
  };
  arrowHandler7 = (a, b) => {
    return "123";
  };
  arrowHandler8 = (a: string, b?: number) => {
    return 123;
  };
  arrowHandler9 = (a: string, b: number = 100) => {
    return null;
  };
  arrowHandler10 = (a: string): undefined => {
    return undefined;
  };
  arrowHandler11 = (a: string) => {
    return undefined;
  };
  arrowHandler12 = () => {
    console.log("12");
  };
  arrowHandler13 = ({ b: string, c: number }) => {};
  arrowHandler14 = ({ b: string, c: number }, t = () => {}) => {};
}
class ClassTest3 {
  constructor() {}
}
class ClassTest4 {
  load() {}
  static send() {}
  protected sendProtected() {}
  private sendPrivate() {}
}
class ClassTest5 {
  method0() {}
  method1(a, b) {}
  method2(a: string, b: number): { a: string; b: number } {}
  method3({ a: number }) {
    return {
      a: "123",
      b: 123
    };
  }
  async method4({ a: number }, { c: string }) {
    return "123";
  }
  *method5(...args: Array<string>) {
    return 123;
  }
  method6() {
    const obj1 = { c: 3, d: 4 };
    return { ...{ a: 1, b: 2 }, ...obj1 };
  }
}
class ClassTest6 {
  constructor(a: string, b: number, c?: { d: string; g?: number }) {}
}
class ClassTest7 extends ClassTest6 {}
