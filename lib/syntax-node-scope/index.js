const recast = require("recast");
const fs = require("fs");
const chalkPipe = require("chalk-pipe");

/**
 * @param {{ src: string }} params
 * @return {{}}
 */
const fileParse = params => {
  const { src } = params;

  const file = fs.readFileSync(src, "utf8");
  const nodeFile = recast.parse(file, {
    parser: require("recast/parsers/typescript")
  });

  return nodeParse(nodeFile.program);
};

const nodesParse = (nodes = []) => nodes.map(nodeParse).filter(Boolean);

const nodeParse = node => {
  if (!node) return;

  let nodeParams;

  switch (node.type) {
    case "Program":
      nodeParams = { body: nodesParse(node.body) };
      break;
    case "VariableDeclaration":
      const declarations = nodesParse(node.declarations);
      nodeParams = { kind: node.kind, declarations };
      break;
    case "VariableDeclarator":
      const id = nodeParse(node.id);
      const init = nodeParse(node.init);
      nodeParams = { id, init };
      break;
    case "Identifier":
      const annotation = nodeParse(node.typeAnnotation);
      nodeParams = { name: node.name, annotation };
      break;
    case "TSTypeAnnotation":
      nodeParams = { typeAnnotation: nodeParse(node.typeAnnotation) };
      break;
    case "TSTypeReference":
      const typeName = nodeParse(node.typeName);
      const typeParameters = nodeParse(node.typeParameters);
      nodeParams = { typeName, typeParameters };
      break;
    case "TSTypeParameterInstantiation":
      nodeParams = { params: nodesParse(node.params) };
      break;
    case "TSNumberKeyword":
      nodeParams = { annotation: "number" };
      break;
    case "TSStringKeyword":
      nodeParams = { annotation: "string" };
      break;
    case "NumericLiteral":
      nodeParams = { value: node.value, annotation: "number" };
      break;
    case "StringLiteral":
      nodeParams = { value: node.value, annotation: "string" };
      break;
    case "ArrayExpression":
      nodeParams = { elements: nodesParse(node.elements) };
      break;
    case "TSUnionType":
      nodeParams = { types: nodesParse(node.types) };
      break;
    case "NewExpression":
      const callee = nodeParse(node.callee);
      const arguments = nodesParse(node.arguments);
      nodeParams = { callee, arguments };
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

module.exports.fileParse = fileParse;
module.exports.nodesParse = nodesParse;
module.exports.nodeParse = nodeParse;
