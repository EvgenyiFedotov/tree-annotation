class ClassTest1 {}
class ClassTest2 {
  static a = 1;
  protected b = 2;
  private c = 3;
  // private d: Map<string, string>;
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
