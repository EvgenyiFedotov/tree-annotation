const recast = require("recast");
const { readFileSync, writeFileSync } = require("fs");
const chalkpipe = require("chalk-pipe");

const { getNodesbyTypes, getNodesByIds } = require("./lib/file-tree");
const md = require("./lib/md");

const buildReadme = cb => {
  const src = "./test/index.ts";
  const file = readFileSync(src, "utf8");

  const parseResult = recast.parse(file, {
    parser: require("recast/parsers/typescript")
  });

  treeFormatting(parseResult).then(res => {
    // console.log(chalkpipe("yellow")(res));
    writeFileSync("./test/index.md", res);
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

  const allNodesbyId = {
    ...bodyTypesByIds.TSTypeAliasDeclaration,
    ...bodyTypesByIds.TSInterfaceDeclaration
  };

  return md.combine(
    md.header("File name"),
    ...md.functions(allNodesbyId)(bodyTypesByIds.FunctionDeclaration),
    ...md.types(allNodesbyId)(bodyTypesByIds.TSTypeAliasDeclaration),
    ...md.interfaces(allNodesbyId)(bodyTypesByIds.TSInterfaceDeclaration),
    ...md.variables(allNodesbyId)(bodyTypesByIds.VariableDeclaration)
  );
};

buildReadme();
