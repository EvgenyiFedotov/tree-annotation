const recast = require("recast");
const fs = require("fs");
const chalkPipe = require("chalk-pipe");

/**
 * @param {{ src: string, nodeParsePost(Object): Object | null }} options
 * @return {{}}
 */
const fileParse = options => {
  const { src, nodeParsePost } = options;

  const file = fs.readFileSync(src, "utf8");
  const nodeFile = recast.parse(file, {
    parser: require("recast/parsers/typescript")
  });

  return nodeParse()(nodeFile);
};

const nodesParse = (options = {}) => (nodes = []) =>
  nodes.map(nodeParse(options)).filter(Boolean);

const nodeParse = (options = {}) => node => {
  if (!node) return;

  let nodeParams;

  switch (node.type) {
    case "TSTypeAnnotation":
      nodeParams = buildNodeParams(options, node)([
        "typeAnnotation",
        "nodeParse"
      ]);
      break;
    case "TSTypeReference":
      nodeParams = buildNodeParams(options, node)(
        ["typeName", "nodeParse"],
        ["typeParameters", "nodeParse"]
      );
      break;
    case "TSTypeParameterInstantiation":
      nodeParams = buildNodeParams(options, node)(["params", "nodesParse"]);
      break;
    case "TSNumberKeyword":
      nodeParams = { annotation: "number" };
      break;
    case "TSStringKeyword":
      nodeParams = { annotation: "string" };
      break;
    case "TSUnionType":
      nodeParams = buildNodeParams(options, node)(["types", "nodesParse"]);
      break;
    case "TSTypeAliasDeclaration":
      nodeParams = buildNodeParams(options, node)(
        ["id", "nodeParse"],
        ["typeParameters", "nodeParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "TSTypeLiteral":
      nodeParams = buildNodeParams(options, node)(["members", "nodesParse"]);
      break;
    case "TSPropertySignature":
      nodeParams = buildNodeParams(options, node)(
        ["computed"],
        ["key", "nodeParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "TSNullKeyword":
      nodeParams = { annotation: "null" };
      break;
    case "TSArrayType":
      nodeParams = buildNodeParams(options, node)(["members", "nodesParse"]);
      break;
    case "TSTypeParameterDeclaration":
      nodeParams = buildNodeParams(options, node)(["params", "nodesParse"]);
      break;
    case "TSTypeParameter":
      nodeParams = buildNodeParams(options, node)(
        ["name"],
        ["default", "nodeParse"]
      );
      break;
    case "TSAnyKeyword":
      nodeParams = { annotation: "any" };
      break;
    case "TSTupleType":
      nodeParams = buildNodeParams(options, node)([
        "elementTypes",
        "nodesParse"
      ]);
      break;
    case "TSInterfaceDeclaration":
      nodeParams = buildNodeParams(options, node)(
        ["id", "nodeParse"],
        ["typeParameters", "nodeParse"],
        ["body", "nodeParse"]
      );
      break;
    case "TSInterfaceBody":
      nodeParams = buildNodeParams(options, node)(["body", "nodesParse"]);
      break;
    case "TSIndexSignature":
      nodeParams = buildNodeParams(options, node)(
        ["parameters", "nodesParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "TSLiteralType":
      nodeParams = buildNodeParams(options, node)(["literal", "nodeParse"]);
      break;
    case "File":
      nodeParams = buildNodeParams(options, node)(["program", "nodeParse"]);
      break;
    case "Program":
      nodeParams = buildNodeParams(options, node)(["body", "nodesParse"]);
      break;
    case "VariableDeclaration":
      nodeParams = buildNodeParams(options, node)(
        ["kind"],
        ["declarations", "nodesParse"]
      );
      break;
    case "VariableDeclarator":
      nodeParams = buildNodeParams(options, node)(
        ["id", "nodeParse"],
        ["init", "nodeParse"]
      );
      break;
    case "Identifier":
      nodeParams = buildNodeParams(options, node)(
        ["name"],
        ["annotation", "nodeParse"]
      );
      break;
    case "NumericLiteral":
      nodeParams = { value: node.value, annotation: "number" };
      break;
    case "StringLiteral":
      nodeParams = { value: node.value, annotation: "string" };
      break;
    case "ArrayExpression":
      nodeParams = buildNodeParams(options, node)(["elements", "nodesParse"]);
      break;
    case "NewExpression":
      nodeParams = buildNodeParams(options, node)(
        ["callee", "nodeParse"],
        ["arguments", "nodesParse"]
      );
      break;
    case "LogicalExpression":
      nodeParams = buildNodeParams(options, node)(
        ["operator"],
        ["left", "nodeParse"],
        ["right", "nodeParse"]
      );
      break;
    case "ExpressionStatement":
      logNode(node, "yellow", "ignore");
      return;
    default:
      logNode(node, "green", "didn't parse");
      break;
  }

  return { type: node.type, ...nodeParams };
};

const logNode = (node, color = "cyan", message = "") => {
  const typeYellow = chalkPipe(color)(node.type);
  console.log(`   Node with type [${typeYellow}] ${message}`);
};

/**
 * @param {Object} node
 * @param {Array<[string, string]>} config
 * @returns {Object | undefined}
 */
const buildNodeParams = (options = {}, node) => (...config) => {
  const nodeParams = config.reduce((memo, elConfig) => {
    const [key, method] = elConfig;
    switch (method) {
      case "nodeParse":
        memo[key] = nodeParse(options)(node[key]);
        break;
      case "nodesParse":
        memo[key] = nodesParse(options)(node[key]);
        break;
      default:
        memo[key] = node[key];
        break;
    }
    return memo;
  }, {});
  return Object.keys(nodeParams).length ? nodeParams : undefined;
};

module.exports.fileParse = fileParse;
module.exports.nodesParse = nodesParse;
module.exports.nodeParse = nodeParse;
