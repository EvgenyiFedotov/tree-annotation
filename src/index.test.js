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

  describe("interface", () => {
    test.each([
      [
        `
        interface testName {
          a: string;
          b: number;
          c: Array<string>;
          d: Date | Array<string | Date>;
        }
      `,
        {
          parameters: undefined,
          body: [
            {
              key: "a",
              type: "property",
              annotation: {
                type: "string",
                value: undefined
              },
              computed: false,
              optional: false
            },
            {
              key: "b",
              type: "property",
              annotation: {
                type: "number",
                value: undefined
              },
              computed: false,
              optional: false
            },
            {
              key: "c",
              type: "property",
              annotation: {
                type: "ref",
                name: "Array",
                parameters: [{ type: "string", value: undefined }]
              },
              computed: false,
              optional: false
            },
            {
              key: "d",
              type: "property",
              annotation: {
                type: "union",
                types: [
                  { type: "ref", name: "Date", parameters: undefined },
                  {
                    type: "ref",
                    name: "Array",
                    parameters: [
                      {
                        type: "union",
                        types: [
                          { type: "string", value: undefined },
                          { type: "ref", name: "Date", parameters: undefined }
                        ]
                      }
                    ]
                  }
                ]
              },
              computed: false,
              optional: false
            }
          ]
        }
      ],
      [
        `
        interface testName<T, K = string, S extends String> {
          [propName: string]: T;
          b: Array<K> | S;
        }
      `,
        {
          parameters: [
            {
              type: "parameter",
              name: "T",
              default: undefined,
              constraint: undefined
            },
            {
              type: "parameter",
              name: "K",
              default: {
                type: "string",
                value: undefined
              },
              constraint: undefined
            },
            {
              type: "parameter",
              name: "S",
              default: undefined,
              constraint: {
                type: "ref",
                name: "String",
                parameters: undefined
              }
            }
          ],
          body: [
            {
              type: "index-signature",
              annotations: {
                parameters: [
                  {
                    type: "id",
                    name: "propName",
                    annotation: {
                      type: "string",
                      value: undefined
                    }
                  }
                ],
                annotation: {
                  type: "ref",
                  name: "T",
                  parameters: undefined
                }
              }
            },
            {
              type: "property",
              key: "b",
              computed: false,
              optional: false,
              annotation: {
                type: "union",
                types: [
                  {
                    type: "ref",
                    name: "Array",
                    parameters: [
                      { type: "ref", name: "K", parameters: undefined }
                    ]
                  },
                  {
                    type: "ref",
                    name: "S",
                    parameters: undefined
                  }
                ]
              }
            }
          ]
        }
      ],
      [
        `
        interface testName {
          a?: number;
        }
      `,
        {
          parameters: undefined,
          body: [
            {
              type: "property",
              key: "a",
              computed: false,
              optional: true,
              annotation: {
                type: "number",
                value: undefined
              }
            }
          ]
        }
      ]
    ])("%s", (value, result) => {
      const resultParse = treeAnnotation.parse(value);
      expect(resultParse.testName.type).toBe("interface");
      expect(resultParse.testName.id).toBe("testName");
      expect(resultParse.testName.annotations).toEqual(result);
    });
  });

  describe("enum", () => {
    test.each([
      [
        `
        enum testName {
        }
      `,
        []
      ],
      [
        `
        enum testName {
          prop_1,
          prop_2
        }
      `,
        [
          { type: "enum-member", id: "prop_1", init: undefined },
          {
            type: "enum-member",
            id: "prop_2",
            init: undefined
          }
        ]
      ],
      [
        `
        enum testName {
          prop_1 = 'string_prop_1'
        }
        `,
        [
          {
            type: "enum-member",
            id: "prop_1",
            init: {
              type: "string",
              value: "string_prop_1"
            }
          }
        ]
      ]
    ])("%s", (value, result) => {
      const resultParse = treeAnnotation.parse(value).testName;
      expect(resultParse.type).toBe("enum");
      expect(resultParse.id).toBe("testName");
      expect(resultParse.members).toEqual(result);
    });
  });

  describe("variable", () => {
    test.each([
      [
        "const testName = 1",
        "const",
        {
          id: undefined,
          init: { type: "number", value: 1 }
        }
      ],
      [
        "const testName = '2'",
        "const",
        {
          id: undefined,
          init: { type: "string", value: "2" }
        }
      ],
      [
        "let testName = new Date('2019')",
        "let",
        {
          id: undefined,
          init: {
            type: "new",
            name: "Date",
            arguments: [{ type: "string", value: "2019" }]
          }
        }
      ],
      [
        "let testName: string = 'test'",
        "let",
        {
          id: {
            type: "string",
            value: undefined
          },
          init: {
            type: "string",
            value: "test"
          }
        }
      ],
      [
        "let testName: string | number = 1",
        "let",
        {
          id: {
            type: "union",
            types: [
              { type: "string", value: undefined },
              { type: "number", value: undefined }
            ]
          },
          init: {
            type: "number",
            value: 1
          }
        }
      ],
      [
        "let testName: number = 1 as number",
        "let",
        {
          id: { type: "number", value: undefined },
          init: {
            type: "as",
            expression: { type: "number", value: 1 },
            annotation: { type: "number", value: undefined }
          }
        }
      ],
      [
        "let testName: number = 1 as (number | string)",
        "let",
        {
          id: { type: "number", value: undefined },
          init: {
            type: "as",
            expression: { type: "number", value: 1 },
            annotation: {
              type: "union",
              types: [
                { type: "number", value: undefined },
                { type: "string", value: undefined }
              ]
            }
          }
        }
      ],
      [
        "let testName: <T>(a: string) => void = <T>(): string => {}",
        "let",
        {
          id: {
            type: "function-type",
            typeParameters: [
              {
                type: "parameter",
                name: "T",
                default: undefined,
                constraint: undefined
              }
            ],
            parameters: [
              {
                type: "id",
                name: "a",
                annotation: {
                  type: "string",
                  value: undefined
                }
              }
            ],
            typeAnnotation: {
              type: "void"
            }
          },
          init: undefined
        }
      ]
    ])("%s", (value, kind, result) => {
      const resultParse = treeAnnotation.parse(value).testName;

      expect(resultParse.type).toBe("variable");
      expect(resultParse.id).toBe("testName");
      expect(resultParse.kind).toBe(kind);
      expect(resultParse.annotations).toEqual(result);
    });
  });
});
