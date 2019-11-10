import * as tree from "../src/index";
import * as common from "../src/common";

test("main", () => {
  const result = tree.parseFile("./test/__mocks-ts__/index.ts");
  const body = common.getFileProgBody(result);

  console.log(result.annotation());

  // body.forEach(el => console.log(el.annotation() || "unknow"));
  // console.log(body[body.length - 1]);
});
