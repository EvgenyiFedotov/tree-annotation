import * as tree from "./index";
import * as common from "./common";

test("main", () => {
  const value = `
    type tName<T, K extends String, D = string> = '2';
    const cName: Array<number> = [1, 2, 3] as Array<number | string>;
    const cArFunc: <T, K extends String, D = string>(a, b: number, c?: string) => number = async <D, U>(a, b: number, c?: string, d = 1): number | string => 1;
    const cArFunc1 = (a, b: number, c?: string, d = 1) => 1;
    const cArFunc2 = async <D, U>(a, b: number, c?: string, d = 1) => {};
    const cArFunc3 = async <D, U>(a, b: number, c?: string, d: number = 1) => {
      if (d === 100) return 1;
      else if (d > 200) return b;
      else if (d > 400) return b;
      else if (d > 600) return [1, 2, '3'];
      return '2';
    };
    function fName<T, K>(a, b: number, c?: string, d = 1) {
      return Promise.resolve(1);
    }
  `;
  const result = tree.parse(value);
  const body = common.getFileProgBody(result);
  console.log(body[0].toString());
  console.log(body[1].toString());
  console.log(body[2].toString());
  console.log(body[3].toString());
  console.log(body[4].toString());
  console.log(body[5].toString());
});
