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
