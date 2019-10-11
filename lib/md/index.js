const prettier = require("prettier");

const { getNodeTokens } = require("../file-tree");

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
    const nodeTokens = getNodeTokens(node);
    const tokensString = tokens(nodesById)(nodeTokens);
    return [id, tokensString];
  });

  return [header("Types", 2), table("Id", "Annotation")(":-", ":-")(...rows)];
};

const interfaces = nodesById => nodes => {
  const rows = Object.keys(nodes).map(id => {
    const node = nodes[id];
    const nodeTokens = getNodeTokens(node);
    const tokensString = tokens(nodesById)(nodeTokens);
    return [id, tokensString];
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
      ? tokens(nodesById)(getNodeTokens(node.parent))
      : "unknow";
    return [node.parent.kind, id, annotation.replace(/^: /, "")];
  });

  return [
    header("Variables", 2),
    table("Kind", "Id", "Annotation")(":-", ":-", ":-")(...rows)
  ];
};

const tokens = nodesById => nodes => {
  let str = prettier.format(nodes.map(token(nodesById)).join(" "), {
    parser: "typescript"
  });

  switch (nodes[0].value) {
    case "const":
    case "let":
    case "var":
      str = str.split("=")[0];
      break;
  }

  console.log(str);

  return str
    .replace(/(^type .* = |;$|^interface .* )/gm, "")
    .replace(/^(const|let|var) .*: (.*).*$/gm, "$2")
    .replace(/\n/gm, "<br/>")
    .replace(/\|/gm, "&#124;")
    .replace(/\"/gm, "&#34;")
    .replace(/ /gm, "&nbsp;");
};

const token = (nodesById = {}) => node => {
  const { value, type } = node;
  if (type.label === "string") return `"${value}"`;
  // if (nodesById[value]) return `\`${value}\``;
  // if (value === "|") return "&#124;";
  return value;
};

module.exports.header = header;
module.exports.table = table;
module.exports.combine = combine;

module.exports.types = types;
module.exports.interfaces = interfaces;
module.exports.variables = variables;
