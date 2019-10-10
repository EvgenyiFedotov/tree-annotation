const recast = require("recast");
const { readFileSync, writeFileSync } = require("fs");
const chalkpipe = require("chalk-pipe");

const { getNodesbyTypes, getNodesByIds } = require("./lib/file-tree");

const buildReadme = cb => {
  const src = "./test/index.ts";
  const file = readFileSync(src, "utf8");

  const parseResult = recast.parse(file, {
    parser: require("recast/parsers/typescript")
  });

  treeFormatting(parseResult);

  // writeFileSync("readme.md", buildContent(fileTree));
  if (cb) cb();
};

const treeFormatting = fileTree => {
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

  console.log(Object.keys(bodyTypesByIds));
};

buildReadme();
