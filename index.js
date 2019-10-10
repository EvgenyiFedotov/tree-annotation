const recast = require("recast");
const { readFileSync, writeFileSync } = require("fs");
const chalkpipe = require("chalk-pipe");

const { getNodesbyTypes, getNodesByIds } = require("./lib/file-tree");
const { header, types, combine, variables } = require("./lib/md");

const buildReadme = cb => {
  const src = "./test/index.ts";
  const file = readFileSync(src, "utf8");

  const parseResult = recast.parse(file, {
    parser: require("recast/parsers/typescript")
  });

  treeFormatting(parseResult).then(res => {
    // console.log(chalkpipe("yellow")(res));
    writeFileSync("readme.md", res);
  });

  if (cb) cb();
};

const treeFormatting = async fileTree => {
  const bodyByTypes = getNodesbyTypes(fileTree.program.body);

  const bodyTypesByIds = Object.keys(bodyByTypes).reduce((memo, type) => {
    const nodesByIds = getNodesByIds(type, bodyByTypes[type]);
    if (Object.keys(nodesByIds).length) {
      memo[type] = nodesByIds;
      console.log(`🎉  ${chalkpipe("cyan")(type)} builded by ids`);
    } else {
      console.log(`👻  ${chalkpipe("yellow")(type)} skiped`);
    }
    return memo;
  }, {});

  console.log();

  return combine(
    header("File name"),
    ...types(bodyTypesByIds.TSTypeAliasDeclaration)(
      bodyTypesByIds.TSTypeAliasDeclaration
    ),

    ...variables(bodyTypesByIds.TSTypeAliasDeclaration)(
      bodyTypesByIds.VariableDeclaration
    )
  );
};

buildReadme();
