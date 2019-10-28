const fs = require("fs");
const path = require("path");

const syntaxNodeScope = require("./lib/syntax-node-scope");

const buildReadme = src => {
  console.log(`🛠  Build: ${src}`);

  const srcParsed = path.parse(src);
  const scope = syntaxNodeScope.fileParse({ src });

  fs.writeFileSync(
    `${srcParsed.dir}/${srcParsed.name}.json`,
    JSON.stringify(scope, null, 2)
  );

  console.log(`🎉  Builded: ${src}`);
  console.log();
};

const getBlock = allNodesbyId => (func, nodes) =>
  nodes ? func(allNodesbyId)(nodes) : [];

buildReadme("./test/variables.ts");
buildReadme("./test/types.ts");
buildReadme("./test/interfaces.ts");

// buildReadme("./test/class.ts");
// buildReadme("./test/export.ts");
// buildReadme("./test/functions.ts");
