import * as treeAnnotation from "./index";

describe("parse", () => {
  test("empty", () => {
    expect(treeAnnotation.parse("")).toEqual({});
  });

  describe("type", () => {
    describe("annotation", () => {
      test.each([
        [
          "type testName = undefined;",
          {
            parameters: undefined,
            annotation: {
              type: "undefined",
              value: undefined
            }
          }
        ],
        [
          "type testName = null;",
          {
            parameters: undefined,
            annotation: {
              type: "null",
              value: null
            }
          }
        ],
        [
          "type testName = 1;",
          {
            parameters: undefined,
            annotation: {
              type: "number",
              value: 1
            }
          }
        ],
        [
          "type testName = '2';",
          {
            parameters: undefined,
            annotation: {
              type: "string",
              value: "2"
            }
          }
        ],
        [
          "type testName = 1 | '2';",
          {
            parameters: undefined,
            annotation: {
              type: "union",
              types: [
                { type: "number", value: 1 },
                { type: "string", value: "2" }
              ]
            }
          }
        ],
        [
          "type testName = any;",
          {
            parameters: undefined,
            annotation: {
              type: "any",
              value: undefined
            }
          }
        ],
        [
          "type testName = string;",
          {
            parameters: undefined,
            annotation: {
              type: "string",
              value: undefined
            }
          }
        ],
        [
          "type testName = Date;",
          {
            parameters: undefined,
            annotation: {
              type: "ref",
              name: "Date",
              parameters: undefined
            }
          }
        ],
        [
          "type testName = Array<string>;",
          {
            parameters: undefined,
            annotation: {
              type: "ref",
              name: "Array",
              parameters: [{ type: "string", value: undefined }]
            }
          }
        ],
        [
          "type testName = Array<number | Date>;",
          {
            parameters: undefined,
            annotation: {
              type: "ref",
              name: "Array",
              parameters: [
                {
                  type: "union",
                  types: [
                    { type: "number", value: undefined },
                    { type: "ref", name: "Date", parameters: undefined }
                  ]
                }
              ]
            }
          }
        ]
      ])("%s", (value, result) => {
        const parseResult = treeAnnotation.parse(value).testName;
        expect(parseResult.type).toBe("type");
        expect(parseResult.id).toBe("testName");
        expect(parseResult.annotations).toEqual(result);
      });
    });

    describe("parameters", () => {
      test.each([
        [
          "type testName<T> = Array<T>;",
          {
            parameters: [
              {
                type: "parameter",
                name: "T",
                constraint: undefined,
                default: undefined
              }
            ],
            annotation: {
              type: "ref",
              name: "Array",
              parameters: [{ type: "ref", name: "T", parameters: undefined }]
            }
          }
        ],
        [
          "type testName<T = any, S extends String = string> = Array<T | S>;",
          {
            parameters: [
              {
                type: "parameter",
                name: "T",
                constraint: undefined,
                default: { type: "any", value: undefined }
              },
              {
                type: "parameter",
                name: "S",
                constraint: {
                  type: "ref",
                  name: "String",
                  parameters: undefined
                },
                default: { type: "string", value: undefined }
              }
            ],
            annotation: {
              type: "ref",
              name: "Array",
              parameters: [
                {
                  type: "union",
                  types: [
                    { type: "ref", name: "T", parameters: undefined },
                    { type: "ref", name: "S", parameters: undefined }
                  ]
                }
              ]
            }
          }
        ]
      ])("%s", (value, result) => {
        const parseResult = treeAnnotation.parse(value).testName;
        expect(parseResult.type).toBe("type");
        expect(parseResult.id).toBe("testName");
        expect(parseResult.annotations).toEqual(result);
      });
    });
  });
});
