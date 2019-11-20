import * as tree from "../src/index";

test("main", () => {
  const result = tree.parseFile("./test/__mocks-ts__/index.ts");
  console.log(result, result.program.annotation());
});
