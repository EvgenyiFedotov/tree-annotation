const recast = require("recast");

const {
  getNodeTokens,
  getTokensByTypeLabel,
  getValuesTokens
} = require("../file-tree");

const render = str => str.replace(/(^\n|\n$)/g, "");

const header = (value, level = 1) => `${"".padStart(level, "#")} ${value}`;

/**
 *
 * @param {Array<string>} header
 * @param {Array<string>} aling
 */
const table = (...header) => (...align) => (...rows) =>
  render(`
${header.join(" | ")}
${align.join(" | ")}
${rows.map(row => row.join(" | ")).join("\n")}
`);

const combine = (...blocks) => `${blocks.join("\n\n")}\n`;

// ---

const types = nodesById => nodesTypes => {
  const rows = Object.keys(nodesTypes).map(id => {
    const node = nodesTypes[id];
    return [id, nodeCodeMd(nodesById)(node.typeAnnotation)];
  });

  return [header("Types", 2), table("Id", "Annotation")(":-", ":-")(...rows)];
};

const interfaces = nodesById => nodes => {
  const rows = Object.keys(nodes).map(id => {
    const node = nodes[id];
    return [id, nodeCodeMd(nodesById)(node.body)];
  });

  return [
    header("Interfaces", 2),
    table("Id", "Annotation")(":-", ":-")(...rows)
  ];
};

const variables = nodesById => nodesVariables => {
  const rows = Object.keys(nodesVariables).map(id => {
    const node = nodesVariables[id];
    const annotation = node.id.typeAnnotation
      ? nodeCodeMd(nodesById)(node.id.typeAnnotation).replace(/^: /, "")
      : "unknow";

    return [node.parent.kind, id, annotation];
  });

  return [
    header("Variables", 2),
    table("Kind", "Id", "Annotation")(":-", ":-", ":-")(...rows)
  ];
};

const nodeCode = node => recast.print(node).code;

const nodeCodeMd = (nodesById = {}) => node => {
  const code = nodeCode(node)
    .replace(/\n/gm, "<br/>")
    .replace(/\|/gm, "&#124;")
    .replace(/\"/gm, "&#34;")
    .replace(/^: /, "")
    .replace(/ /gm, "&nbsp;");

  const tokens = getNodeTokens(node);
  const tokensByTypeLabel = getTokensByTypeLabel(tokens);
  const tokensValues = getValuesTokens(tokensByTypeLabel.name);
  const tokensValuesF = tokensValues.filter(label => !!nodesById[label]);

  return tokensValuesF.reduce((memo, value) => {
    const reg = new RegExp(`(${value})`, "g");
    return memo.replace(reg, "`$1`");
  }, code);
};

module.exports.header = header;
module.exports.table = table;
module.exports.combine = combine;

module.exports.types = types;
module.exports.interfaces = interfaces;
module.exports.variables = variables;
