const fs = require("fs");
const path = require("path");

const md = require("./lib/md");
const mdData = require("./lib/md/data");

const buildReadme = src => {
  console.log(`🛠  Build: ${src}`);

  const srcParsed = path.parse(src);
  const data = mdData.getData({ src });

  fs.writeFileSync(
    `${srcParsed.dir}/${srcParsed.name}.json`,
    JSON.stringify(data, null, 2)
  );

  fs.writeFileSync(`${srcParsed.dir}/${srcParsed.name}.md`, md.render(data));

  console.log(`🎉  Builded: ${src}`);
  console.log();
};

const getBlock = allNodesbyId => (func, nodes) =>
  nodes ? func(allNodesbyId)(nodes) : [];

// buildReadme("./test/index.ts");
// buildReadme("./test/class.ts");
buildReadme("./test/export.ts");
