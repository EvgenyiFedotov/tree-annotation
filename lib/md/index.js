const recast = require("recast");
const chalkPipe = require("chalk-pipe");

const {
  getNodeTokens,
  getTokensByTypeLabel,
  getValuesTokens,
  getReturnNodes
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
| ${header.join(" | ")} |
| ${(align.length ? align : header.map(() => ":-")).join(" | ")} |
${rows.map(row => `| ${row.join(" | ")} |`).join("\n")}
`);

const combine = (...blocks) => `${blocks.join("\n\n")}\n`;

// ---

const types = nodesById => nodesTypes => {
  const rows = Object.keys(nodesTypes).map(id => {
    const node = nodesTypes[id];
    return [id, nodeCodeMd(nodesById)(node.typeAnnotation)];
  });

  return [header("Types", 2), table("Id", "Annotation")()(...rows)];
};

const interfaces = nodesById => nodes => {
  const rows = Object.keys(nodes).map(id => {
    const node = nodes[id];
    return [id, nodeCodeMd(nodesById)(node.body)];
  });

  return [header("Interfaces", 2), table("Id", "Annotation")()(...rows)];
};

const variables = nodesById => nodesVariables => {
  const rows = Object.keys(nodesVariables).map(id => {
    const node = nodesVariables[id];
    const annotation = node.id.typeAnnotation
      ? nodeCodeMd(nodesById)(node.id.typeAnnotation)
      : "unknow";

    return [node.parent.kind, id, annotation];
  });

  return [header("Variables", 2), table("Kind", "Id", "Annotation")()(...rows)];
};

const functions = nodesById => nodes => {
  const funcs = Object.keys(nodes).reduce((memo, id) => {
    const node = nodes[id];

    // console.log(node.body.body.length);

    memo.push(header(id, 3));

    if (node.params && node.params.length) {
      memo.push(functionArgs(nodesById)(node.params));
    }

    if (node.returnType) {
      memo.push(
        `__Return__ _${nodeCodeMd(nodesById)(node.returnType.typeAnnotation)}_`
      );
    } else if (node.body.body.length) {
      memo.push(`__Return__ _${annotationNodeFunc(node)}_`);
    } else {
      memo.push(`__Return__ _void_`);
    }

    return memo;
  }, []);

  return [header("Functions", 2), ...funcs];
};

const functionArgs = nodesById => nodes => {
  const rows = nodes.map((param, index) => {
    switch (param.type) {
      case "Identifier":
        return [
          param.name,
          nodeCodeMd(nodesById)(param.typeAnnotation),
          !param.optional,
          "-"
        ];
      case "AssignmentPattern":
        return [
          param.left.name,
          nodeCodeMd(nodesById)(param.left.typeAnnotation),
          false,
          "-"
        ];
      case "ObjectPattern":
        return [
          `arg${index}`,
          nodeCodeMd(nodesById)(param.typeAnnotation),
          true,
          "-"
        ];
      default:
        return ["UNKNOW", "UNKNOW", "UNKNOW", "UNKNOW"];
    }
  });

  return table("Argument", "Annotation", "Required", "Description")()(...rows);
};

const nodeCode = node => recast.print(node).code;

const nodeCodeMd = (nodesById = {}) => node => {
  if (!node) return "unknow";

  const code = escapeMd(nodeCode(node).replace(/^: /, "")).replace(
    /\n/gm,
    "<br/>"
  );
  const tokens = getNodeTokens(node);
  const tokensByTypeLabel = getTokensByTypeLabel(tokens);
  const tokensValues = getValuesTokens(tokensByTypeLabel.name || []);
  const tokensValuesF = tokensValues.filter(label => !!nodesById[label]);

  return tokensValuesF.reduce((memo, value) => {
    const reg = new RegExp(`(${value})`, "g");
    return memo.replace(reg, "`$1`");
  }, code);
};

const annotationNodeFunc = nodeFunc => {
  const nodesReturn = getReturnNodes(nodeFunc.body.body);
  const annotationNodes = annotationReturnNodes(nodesReturn);
  const annotaion = annotationNodes.join(" | ");

  annotationNodes.forEach((val, index) => {
    if (val === "unknow") {
      console.log(
        "😯 ",
        "For",
        chalkPipe("green")(nodeFunc.id.name),
        "type",
        chalkPipe("cyan")(nodesReturn[index].argument.type),
        "is unknow"
      );
    }
  });

  if (nodeFunc.generator) {
    // TODO add yield type
    return `Iterator<${annotaion}>`;
  } else if (nodeFunc.async) {
    return `Promise<${annotaion}>`;
  }

  return escapeMd(annotaion) || "void";
};

const annotationReturnNodes = nodes =>
  nodes.map(node => {
    switch (node.argument.type) {
      case "ObjectExpression":
        return `{ ${node.argument.properties.map(annotationNode).join(" ")} }`;
      default:
        return annotationNode(node.argument);
    }
  });

const annotationNode = node => {
  switch (node.type) {
    case "BooleanLiteral":
      return "boolean";
    case "NumericLiteral":
      return "number";
    case "StringLiteral":
      return "string";
    case "ObjectProperty":
      return `${node.key.name}: ${annotationNode(node.value)};`;
    default:
      return "unknow";
  }
};

const escapeMd = value =>
  value
    .replace(/</gm, "&#60;")
    .replace(/>/gm, "&#62;")
    .replace(/\|/gm, "&#124;")
    .replace(/\"/gm, "&#34;")
    .replace(/ /gm, "&nbsp;");

module.exports.header = header;
module.exports.table = table;
module.exports.combine = combine;

module.exports.types = types;
module.exports.interfaces = interfaces;
module.exports.variables = variables;
module.exports.functions = functions;
