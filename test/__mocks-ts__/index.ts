import testimport from "./export";

import {
  ExpClass1,
  ExpConst1,
  ExpFunc1 as MainFunc,
  TestType1,
  TestInterface1,
  TestEnum
} from "./export";

// tName is good type
type tName<T, K extends String, D = string> = "2";

const cName: Array<number | string> = [1, 2, 3] as Array<number | string>;

const cArFunc: <T, K extends String, D = string>(
  a,
  b: number,
  c?: string
) => number = <D, U>(a, b: number, c?: string, d = 1): number => 1;

const cArFunc1 = (a, b: number, c?: string, d = 1) => "2";

const cArFunc2 = async <D, U>(a, b: number, c?: string, d = 1) => {};

const cArFunc3 = async <D, U>(a, b: string, c?: string, d: number = 1) => {
  if (d === 100) return 1;
  else if (d > 200) return b;
  else if (d > 400) return b;
  else if (d > 600) return [1, 2, "3"];
  else if (d > 800) return Promise.resolve(new Date());
  else if (d > 808) return Object.keys({ a: 1, b: 2 });
  return "2";
};

/**
 * @paramtype T it is type generation
 * @paramtype K it is type generation
 *
 * @param a
 * @param b
 * @param c
 * @param d
 */
function fName<T, K>(a, b: number, c?: string, d = 1) {
  return Promise.resolve(1);
}

enum testEnum {
  SHOW,
  HIDE,
  ADD,
  REMOVE,
  CONVERT = -100,
  CLEAR = "clear"
}

/**
 * @paramtype a it is type parameter interface
 * @paramtype b it is type parameter interface
 * @paramtype c it is type parameter interface
 * @paramtype d it is type parameter interface
 * @paramtype g it is type parameter interface
 */
interface testInterface<T, K = Array<string>> {
  a: T;
  b: string;
  c?: number;
  d?: K;
  g;
}

export const expConst: number = 1 as any;

export { testEnum as TEST_ENUM, testInterface };

export default () => {
  return "1";
};

export { ExpClass1 } from "./export";

export const CTest1: TestType1 = ["1"];

export const CTest2: TestInterface1 = {
  a: "1",
  b: 2,
  action: TestEnum.START
};
