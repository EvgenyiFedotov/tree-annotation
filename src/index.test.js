import * as treeAnnotation from "./index";

describe("parse", () => {
  test("empty", () => {
    expect(treeAnnotation.parse("")).toEqual({});
  });

  describe("type", () => {
    describe("annotation", () => {
      test.each([
        ["type testName = undefined;", undefined, undefined],
        ["type testName = null;", null, null],
        ["type testName = 1;", 1, "number"],
        ["type testName = '2';", "'2'", "string"],
        ["type testName = [1, 2, 3]", "[1, 2, 3]", "Array<number>"],
        [
          "type testName = [1, 2, '3']",
          "[1, 2, '3']",
          "Array<number | string>"
        ],
        ["type testName = 1 | '2';", "1 | '2'", "number | string"],
        ["type testName = any;", "any", "any"],
        ["type testName = string;", "string", "string"],
        ["type testName = Date;", "Date", "Date"],
        ["type testName = Array<string>;", "Array<string>", "Array<string>"],
        [
          "type testName = Map<string, Array<string | number>>;",
          "Map<string, Array<string | number>>",
          "Map<string, Array<string | number>>"
        ],
        [
          "type testName = Array<number | Date>;",
          "Array<number | Date>",
          "Array<number | Date>"
        ]
      ])("%s", (value, typeAnnotation, treeAnnotationArea) => {
        let parseResult = treeAnnotation.parse(value).testName;
        expect(parseResult.type).toBe("type");
        expect(parseResult.id).toBe("testName");
        expect(parseResult.typeAnnotation).toEqual(typeAnnotation);
        parseResult = treeAnnotation.parse(value, { toAreaType: true })
          .testName;
        expect(parseResult.typeAnnotation).toEqual(treeAnnotationArea);
      });
    });

    describe("parameters", () => {
      test.each([
        ["type testName<T> = Array<T>;", "<T = any>"],
        [
          "type testName<T = any, S extends String = string> = Array<T | S>;",
          "<T = any, S extends String = string>"
        ]
      ])("%s", (value, result) => {
        const parseResult = treeAnnotation.parse(value).testName;
        expect(parseResult.type).toBe("type");
        expect(parseResult.id).toBe("testName");
        expect(parseResult.typeParameters).toEqual(result);
      });
    });
  });

  describe("interface", () => {
    describe("body", () => {
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
          "{ a: string; b: number; c: Array<string>; d: Date | Array<string | Date>; }"
        ],
        [
          `
        interface testName {
          [propName: string]: T;
          b: Array<K> | S;
        }
      `,
          "{ [propName: string]: T; b: Array<K> | S; }"
        ],
        [
          `
        interface testName {
          a?: number;
        }
      `,
          "{ a?: number; }"
        ]
      ])("%s", (value, result) => {
        const resultParse = treeAnnotation.parse(value);
        expect(resultParse.testName.type).toBe("interface");
        expect(resultParse.testName.id).toBe("testName");
        expect(resultParse.testName.body).toEqual(result);
      });
    });

    describe("typeParameters", () => {
      test.each([
        [
          `
        interface testName<T, K = string, S extends String> {
          [propName: string]: T;
          b: Array<K> | S;
        }
      `,
          "<T = any, K = string, S extends String>"
        ]
      ])("%s", (value, result) => {
        const resultParse = treeAnnotation.parse(value);
        expect(resultParse.testName.type).toBe("interface");
        expect(resultParse.testName.id).toBe("testName");
        expect(resultParse.testName.typeParameters).toEqual(result);
      });
    });
  });

  describe("enum", () => {
    test.each([
      [
        `
        enum testName {
        }
      `,
        "{ }"
      ],
      [
        `
        enum testName {
          prop_1,
          prop_2
        }
      `,
        "{ prop_1, prop_2 }"
      ],
      [
        `
        enum testName {
          prop_1 = 'string_prop_1'
        }
        `,
        "{ prop_1 = 'string_prop_1' }"
      ]
    ])("%s", (value, result) => {
      const resultParse = treeAnnotation.parse(value).testName;
      expect(resultParse.type).toBe("enum");
      expect(resultParse.id).toBe("testName");
      expect(resultParse.members).toEqual(result);
    });
  });

  describe("variable", () => {
    describe.skip("kind", () => {});
    describe("init", () => {
      test.each([
        ["const testName = 1", "1", "number"],
        ["const testName = '2'", "'2'", "string"],
        ["let testName = new Date('2019')", "Date", "Date"]
      ])("%s", (value, result, resultArea) => {
        let resultParse = treeAnnotation.parse(value).testName;

        expect(resultParse.type).toBe("variable");
        expect(resultParse.id).toBe("testName");
        expect(resultParse.init.toString()).toEqual(result);
        expect(resultParse.as).toBe(undefined);

        resultParse = treeAnnotation.parse(value, { toAreaType: true })
          .testName;
        expect(resultParse.init.toString()).toBe(resultArea);
      });
    });
    describe("typeAnnotation", () => {
      test.each([
        ["let testName: string;", "string"],
        ["let testName: string | number", "string | number"],
        ["let testName: Array<string | number>", "Array<string | number>"],
        ["let testName: () => void", "() => void"],
        [
          "let testName: (a: number, b) => string",
          "(a: number, b: any) => string"
        ],
        [
          "var testName: <T, K = string>(a: T) => K",
          "<T = any, K = string>(a: T) => K"
        ]
      ])("%s", (value, result) => {
        const resultParse = treeAnnotation.parse(value).testName;

        expect(resultParse.type).toBe("variable");
        expect(resultParse.id).toBe("testName");
        expect(resultParse.typeAnnotation).toEqual(result);
      });
    });
    describe("init 'as'", () => {
      test.each([
        ["let testName = 1 as number", 1, "number", "number"],
        [
          "let testName = 1 as (number | string)",
          1,
          "number",
          "number | string"
        ]
      ])("%s", (value, result, resultArea, resultAs) => {
        let resultParse = treeAnnotation.parse(value).testName;

        expect(resultParse.type).toBe("variable");
        expect(resultParse.id).toBe("testName");
        expect(resultParse.init).toEqual(result);
        expect(resultParse.as).toEqual(resultAs);

        resultParse = treeAnnotation.parse(value, { toAreaType: true })
          .testName;

        expect(resultParse.init).toEqual(resultArea);
      });
    });
    describe("array function", () => {
      describe("return", () => {
        test.each([
          ["const testName = () => {}", "() => void", "() => void"],
          ["const testName = () => 1", "() => 1", "() => number"],
          ["const testName = () => '2'", "() => '2'", "() => string"],
          [
            "const testName = () => [1, 2, '3']",
            "() => [1, 2, '3']",
            "() => Array<number | string>"
          ],
          ["const testName = () => new Date()", "() => Date", "() => Date"],
          [
            `
            const testName = () => {
              return 1;
            };
            `,
            "() => 1",
            "() => number"
          ],
          [
            `
            const testName = () => {
              if (window) return '2';
              else return '2';
              return 1;
            }
            `,
            "() => '2' | 1",
            "() => string | number"
          ],
          [
            `
            const testName = () => {
              if (window) return '2';
              else return new Date();
              return 1;
            }
            `,
            "() => '2' | Date | 1",
            "() => string | Date | number"
          ],
          [
            `
            const testName = () => {
              switch (test) {
                case "1":
                  return '2';
                case "2":
                  return new Date();
                case "3":
                  if (window) return new Date();
                  else return [1, 2, 3];
              }
              return 1;
            }
            `,
            "() => '2' | Date | [1, 2, 3] | 1",
            "() => string | Date | Array<number> | number"
          ],
          [
            `
            const testName = (): Array<string> => {
              return 1;
            }`,
            "() => Array<string>",
            "() => Array<string>"
          ]
        ])("%s", (value, result, resultArea) => {
          let resultParse = treeAnnotation.parse(value).testName;
          expect(resultParse.init.toString()).toBe(result);

          resultParse = treeAnnotation.parse(value, { toAreaType: true })
            .testName;
          expect(resultParse.init.toString()).toBe(resultArea);
        });
      });
      describe("params", () => {
        test.each([
          ["const testName = (a) => {}", "(a: any) => void"],
          ["const testName = (a = 1) => {}", "(a: number = 1) => void"],
          ["const testName = (a: string) => {}", "(a: string) => void"],
          [
            "const testName = (a: number, b = new Date()) => {}",
            "(a: number, b: Date = new Date()) => void"
          ],
          [
            "const testName = (a: number, b?: string) => {}",
            "(a: number, b?: string) => void"
          ]
        ])("%s", (value, result) => {
          const resultParse = treeAnnotation.parse(value).testName;
          expect(resultParse.init).toBe(result);
        });
      });
      describe("added options", () => {
        test.each([["const testName = async () => {}", "() => Promise<void>"]])(
          "%s",
          (value, result) => {
            const resultParse = treeAnnotation.parse(value).testName;
            expect(resultParse.init).toBe(result);
          }
        );
      });
    });
  });
});
