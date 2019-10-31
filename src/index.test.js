import treeAnnotation from "./index";

describe("fileParse", () => {
  describe("variables", () => {
    test.each([
      [
        "const name1 = 1;",
        {
          type: "VariableDeclaration",
          kind: "const",
          declarations: [
            {
              type: "VariableDeclarator",
              id: { type: "Identifier", name: "name1" },
              init: { type: "NumericLiteral", value: 1, annotation: "number" }
            }
          ]
        }
      ]
    ])("const", (str, expected) => {});
    test("let", () => {});
    test("var", () => {});
  });
});
