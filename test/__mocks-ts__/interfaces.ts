interface nametest1 {}

interface nametest2 {
  [propName: string]: string;
}
interface nametest3 {
  [propName: string]: {
    prop1: nametest1;
    prop2: nametest2;
  };
}
interface nametest4 {
  prop1: 1;
  prop2: "1";
  prop3: string;
  prop4: number;
  prop5: string | number;
  prop6: {
    prop61: nametest1;
    prop62: nametest1 | nametest4;
  };
}
interface nametest5<T> {
  [propName: string]: T;
}
interface nametest6<T = nametest1> {
  prop1: T;
  prop2: nametest2;
}
interface nametest7<T, K = nametest2> {
  prop1: T;
  prop2: K;
}
