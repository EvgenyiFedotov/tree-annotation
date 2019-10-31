const fs = require("fs");
const path = require("path");

// const buildReadme = src => {
//   console.log(`🛠  Build: ${src}`);

//   const srcParsed = path.parse(src);
//   const scope = treeAnnotation.fileParse({
//     src
//   });

//   fs.writeFileSync(
//     `${srcParsed.dir}/${srcParsed.name}.json`,
//     JSON.stringify(scope, null, 2)
//   );

//   console.log(`🎉  Builded: ${src}`);
//   console.log();
// };

// buildReadme("./test/__mocks-ts__/variables.ts");
// buildReadme("./test/types.ts");
// buildReadme("./test/interfaces.ts");
// buildReadme("./test/functions.ts");
// buildReadme("./test/class.ts");
// buildReadme("./test/export.ts");
// buildReadme("./test/import.ts");
// buildReadme("./test/namespaces.ts");
