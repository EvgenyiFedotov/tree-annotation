const recast = require("recast");
const chalkPipe = require("chalk-pipe");

/**
 * @returns {string}
 */
const nodeAnnotation = node => {
  if (!node) return;

  switch (node.type) {
    case "TSTypeAnnotation":
      return nodeCode(node);
    case "TSTypeReference":
      return nodeCode(node);
    case "TSNumberKeyword":
      return nodeCode(node);
    case "TSStringKeyword":
      return nodeCode(node);
    case "TSUnionType":
      return nodeCode(node);
    case "TSArrayType":
      return nodeTSArrayType(node);
    case "TSTypeLiteral":
      return nodeCode(node);
    case "TSInterfaceBody":
      return nodeCode(node);
    case "TSTypeParameterDeclaration":
      return nodeCode(node);
    case "VariableDeclarator":
      return nodeVariableDeclarator(node);
    case "ArrayExpression":
      return nodeArrayExpression(node);
    case "Identifier":
      return nodeIdentifier(node);
    case "ObjectPattern":
      return nodeCode(node);
    case "AssignmentPattern":
      return nodeAssignmentPattern(node);
    case "ReturnStatement":
      return nodeAnnotation(node.argument);
    case "NewExpression":
      return nodeAnnotation(node.callee);
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

const nodeTSArrayType = node => {
  return `Array<${nodeAnnotation(node.elementType)}>`;
};

const nodeIdentifier = node => {
  const typeAnnotation = nodeAnnotation(node.typeAnnotation) || ": any";
  const optional = node.optional ? "?" : "";
  return `${node.name}${optional}${typeAnnotation}`;
};

const nodeAssignmentPattern = node => {
  const id = node.left.name;
  const annotation =
    (nodeAnnotation(node.left.typeAnnotation) || "").replace(/^: /gm, "") ||
    nodeAnnotation(node.right) ||
    "any";

  return `${id}?: ${annotation}`;
};

const nodeDefault = node => {
  const type = chalkPipe("green")(node.type);
  console.log(`   Node [${type}] doesn't have annotation`);
  return "unknow";
};

const nodeCode = node => recast.print(node).code;

module.exports.nodeAnnotation = nodeAnnotation;
