const recast = require("recast");
const chalkPipe = require("chalk-pipe");

/**
 * @returns {string}
 */
const nodeAnnotation = node => {
  if (!node) return;

  switch (node.type) {
    case "VariableDeclarator":
      return nodeVariableDeclarator(node);
    case "TSTypeAnnotation":
      return nodeCode(node);
    case "ArrayExpression":
      return nodeArrayExpression(node);
    case "BooleanLiteral":
      return "boolean";
    case "NumericLiteral":
      return "number";
    case "StringLiteral":
      return "string";
    default:
      return nodeDefault(node);
  }
};

const nodeVariableDeclarator = node =>
  nodeAnnotation(node.id.typeAnnotation) ||
  nodeAnnotation(node.init) ||
  "unknow";

const nodeArrayExpression = node => {
  const typesAnnotation = node.elements.reduce((memo, nodeElement) => {
    memo.set(nodeAnnotation(nodeElement), true);
    return memo;
  }, new Map());
  return `Array<${Array.from(typesAnnotation.keys()).join(" | ")}>`;
};

const nodeDefault = node => {
  const type = chalkPipe("green")(node.type);
  console.log(`   Node [${type}] doesn't have annotation`);
  return "unknow";
};

const nodeCode = node => recast.print(node).code;

module.exports.nodeAnnotation = nodeAnnotation;
