const { getNodeTokens } = require("../file-tree");

const render = str => str.replace(/(^\n|\n$)/g, "");

const header = (value, level = 1) => `${"".padStart(level, "#")} ${value}`;

/**
 *
 * @param {Array<string>} header
 * @param {Array<string>} aling
 */
const table = (header = [], aling = [], rows = []) =>
  render(`
${header.join(" | ")}
${aling.join(" | ")}
${rows.map(row => row.join(" | ")).join("\n")}
`);

const combine = (...blocks) => `${blocks.join("\n\n")}\n`;

// ---

const types = nodesById => nodesTypes => {
  const rows = Object.keys(nodesTypes).map(key => {
    const node = nodesTypes[key];
    const nodeTokens = getNodeTokens(node.typeAnnotation);
    return [key, tokens(nodesById)(nodeTokens)];
  });

  return [header("Types", 2), table(["Id", "Annotation"], [":-", ":-"], rows)];
};

const variables = nodesById => nodesVariables => {
  const rows = Object.keys(nodesVariables).map(key => {
    const node = nodesVariables[key];
    const annotation = node.id.typeAnnotation
      ? tokens(nodesById)(getNodeTokens(node.id.typeAnnotation))
      : "any";
    return [node.parent.kind, key, annotation.replace(/^: /, "")];
  });

  return [
    header("Variables", 2),
    table(["Kind", "Id", "Annotation"], [":-", ":-", ":-"], rows)
  ];
};

const tokens = nodesById => nodes => {
  return nodes
    .map(token(nodesById))
    .join(" ")
    .replace(/  /g, " ");
};

const token = (nodesById = {}) => node => {
  const { value } = node;
  if (nodesById[value]) return `\`${value}\``;
  if (value === "|") return "&#124;";
  return value;
};

module.exports.header = header;
module.exports.table = table;
module.exports.combine = combine;

module.exports.types = types;
module.exports.variables = variables;
