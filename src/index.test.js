import { strParse } from "./index";

describe("fileParse", () => {
  describe("variables", () => {
    test("const", () => {
      const res = strParse("const name1 = 1");
      console.log(res);
    });
    test("let", () => {});
    test("var", () => {});
  });
});
