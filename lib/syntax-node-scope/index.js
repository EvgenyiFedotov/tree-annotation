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

  return nodeParse(nodeFile);
};

const nodesParse = (nodes = []) => nodes.map(nodeParse).filter(Boolean);

const nodeParse = node => {
  if (!node) return;

  let nodeParams;

  switch (node.type) {
    case "TSTypeAnnotation":
      nodeParams = { typeAnnotation: nodeParse(node.typeAnnotation) };
      break;
    case "TSTypeReference":
      nodeParams = parseTSTypeReference(node);
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
    case "TSUnionType":
      nodeParams = { types: nodesParse(node.types) };
      break;
    case "TSTypeAliasDeclaration":
      nodeParams = parseTSTypeAliasDeclaration(node);
      break;
    case "TSTypeLiteral":
      nodeParams = { members: nodesParse(node.members) };
      break;
    case "TSPropertySignature":
      nodeParams = parseTSPropertySignature(node);
      break;
    case "TSNullKeyword":
      nodeParams = { annotation: "null" };
      break;
    case "TSArrayType":
      nodeParams = { members: nodesParse(node.members) };
      break;
    case "TSTypeParameterDeclaration":
      nodeParams = { params: nodesParse(node.params) };
      break;
    case "TSTypeParameter":
      return parseTSTypeParameter(node);
      break;
    case "TSAnyKeyword":
      nodeParams = { annotation: "any" };
      break;
    case "TSTupleType":
      nodeParams = { elementTypes: nodesParse(node.elementTypes) };
      break;
    case "TSInterfaceDeclaration":
      nodeParams = parseTSInterfaceDeclaration(node);
      break;
    case "TSInterfaceBody":
      nodeParams = { body: nodesParse(node.body) };
      break;
    case "TSIndexSignature":
      nodeParams = parseTSIndexSignature(node);
      break;
    case "TSLiteralType":
      nodeParams = { literal: nodeParse(node.literal) };
      break;
    case "File":
      nodeParams = { body: nodeParse(node.program) };
      break;
    case "Program":
      nodeParams = { body: nodesParse(node.body) };
      break;
    case "VariableDeclaration":
      nodeParams = parseVariableDeclaration(node);
      break;
    case "VariableDeclarator":
      nodeParams = parseVariableDeclarator(node);
      break;
    case "Identifier":
      nodeParams = parseIdentifier(node);
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
    case "NewExpression":
      nodeParams = parseNewExpression(node);
      break;
    case "LogicalExpression":
      nodeParams = parseLogicalExpression(node);
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

const parseTSTypeReference = node => {
  const typeName = nodeParse(node.typeName);
  const typeParameters = nodeParse(node.typeParameters);
  return { typeName, typeParameters };
};

const parseTSPropertySignature = node => {
  const key = nodeParse(node.key);
  const typeAnnotation = nodeParse(node.typeAnnotation);
  return { computed: node.computed, key, typeAnnotation };
};

const parseTSTypeAliasDeclaration = node => {
  const id = nodeParse(node.id);
  const typeParameters = nodeParse(node.typeParameters);
  const typeAnnotation = nodeParse(node.typeAnnotation);
  return { id, typeParameters, typeAnnotation };
};

const parseTSTypeParameter = node => {
  const def = nodeParse(node.default);
  return { name: node.name, default: def };
};

const parseVariableDeclaration = node => {
  const declarations = nodesParse(node.declarations);
  return { kind: node.kind, declarations };
};

const parseVariableDeclarator = node => {
  const id = nodeParse(node.id);
  const init = nodeParse(node.init);
  return { id, init };
};

const parseIdentifier = node => {
  const annotation = nodeParse(node.typeAnnotation);
  return { name: node.name, annotation };
};

const parseNewExpression = node => {
  const callee = nodeParse(node.callee);
  const arguments = nodesParse(node.arguments);
  return { callee, arguments };
};

const parseLogicalExpression = node => {
  const left = nodeParse(node.left);
  const right = nodeParse(node.right);
  return { operator: node.operator, left, right };
};

const parseTSInterfaceDeclaration = node => {
  const id = nodeParse(node.id);
  const typeParameters = nodeParse(node.typeParameters);
  const body = nodeParse(node.body);
  return { id, typeParameters, body };
};

const parseTSIndexSignature = node => {
  const parameters = nodesParse(node.parameters);
  const typeAnnotation = nodeParse(node.typeAnnotation);
  return { parameters, typeAnnotation };
};

module.exports.fileParse = fileParse;
module.exports.nodesParse = nodesParse;
module.exports.nodeParse = nodeParse;
