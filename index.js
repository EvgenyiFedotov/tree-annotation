const recast = require("recast");
const { readFileSync, writeFileSync } = require("fs");

const buildReadme = cb => {
  const src = "./test/index.ts";
  const file = readFileSync(src, "utf8");

  const fileTree = recast.parse(file, {
    parser: require("recast/parsers/typescript")
  });

  buildContent(fileTree);

  // writeFileSync("readme.md", buildContent(fileTree));
  if (cb) cb();
};

const buildContent = fileTree => {
  const bodyByTypes = fileTree.program.body.reduce(...byType());
  const { TSTypeAliasDeclaration, VariableDeclaration } = bodyByTypes;

  if (TSTypeAliasDeclaration) {
    console.log("🎉  Types builded");
  }

  if (VariableDeclaration) {
    console.log("🎉  Variables builded");
  }
};

buildReadme();
