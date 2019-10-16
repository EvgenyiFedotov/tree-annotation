const recast = require("recast");
const { readFileSync, writeFileSync } = require("fs");
const chalkpipe = require("chalk-pipe");
const path = require("path");

const { getNodesByTypes, getNodesByIds } = require("./lib/file-tree");
const md = require("./lib/md");

const buildReadme = src => {
  console.log(`🛠  Build: ${src}`);

  const file = readFileSync(src, "utf8");

  const parseResult = recast.parse(file, {
    parser: require("recast/parsers/typescript")
  });

  treeFormatting(parseResult).then(res => {
    const srcParsed = path.parse(src);
    writeFileSync(`${srcParsed.dir}/${srcParsed.name}.md`, res);
  });

  console.log(`🎉  Builded: ${src}`);
  console.log();
};

const treeFormatting = async fileTree => {
  const bodyByTypes = getNodesByTypes(fileTree.program.body);

  const bodyTypesByIds = Object.keys(bodyByTypes).reduce((memo, type) => {
    const nodesByIds = getNodesByIds(type, bodyByTypes[type]);
    if (Object.keys(nodesByIds).length) {
      memo[type] = nodesByIds;
      // console.log(`   ${chalkpipe("cyan")(type)} builded by ids`);
    } else {
      // console.log(`   ${chalkpipe("yellow")(type)} skiped`);
    }
    return memo;
  }, {});

  console.log();

  const allNodesbyId = {
    ...bodyTypesByIds.TSTypeAliasDeclaration,
    ...bodyTypesByIds.TSInterfaceDeclaration
  };

  const getBlockNodes = getBlock(allNodesbyId);

  return md.combine(
    md.header("File name"),
    ...getBlockNodes(md.classes, bodyTypesByIds.ClassDeclaration),
    ...getBlockNodes(md.functions, bodyTypesByIds.FunctionDeclaration),
    ...getBlockNodes(md.types, bodyTypesByIds.TSTypeAliasDeclaration),
    ...getBlockNodes(md.interfaces, bodyTypesByIds.TSInterfaceDeclaration),
    ...getBlockNodes(md.variables, bodyTypesByIds.VariableDeclaration)
  );
};

const getBlock = allNodesbyId => (func, nodes) =>
  nodes ? func(allNodesbyId)(nodes) : [];

buildReadme("./test/index.ts");
buildReadme("./test/class.ts");
