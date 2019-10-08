const recast = require("recast");
const { readFileSync, writeFileSync, unlinkSync } = require("fs");

const { parseNode } = require("./parse");

const src = "./src/index.ts";
const program = readFileSync(src, "utf8");

const tsAst = recast.parse(program, {
  parser: require("recast/parsers/typescript")
});

const res = parseNode(tsAst);
writeFileSync("tree.json", JSON.stringify(res, null, 2));
