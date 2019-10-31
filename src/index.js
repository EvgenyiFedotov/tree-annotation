import * as recast from "recast";
import fs from "fs";
import chalkPipe from "chalk-pipe";

import * as nodeTransform from "./node-transform";

/**
 * @param {{ src: string, nodeParse: {}} options
 * @return {{}}
 */
export const fileParse = options => {
  const { src } = options;
  const file = fs.readFileSync(src, "utf8");

  return strParse(file);
};

export const strParse = value => {
  const nodeFile = recast.parse(value, {
    parser: require("recast/parsers/typescript")
  });

  const [treeById, reduceTreeById] = nodeTransform.createReduceTreeById();

  const tree = nodeParse({
    transform: nodeTransform.combine(
      nodeTransform.varibaleAddKind,
      reduceTreeById
    )
  })(nodeFile);

  return { tree, treeById };
};

export const nodesParse = (options = {}, nodeParent = null) => (nodes = []) =>
  nodes.map(nodeParse(options, nodeParent)).filter(Boolean);

export const nodeParse = (options = {}, nodeParent = null) => node => {
  if (!node) return;

  const { transform = nodeParams => nodeParams } = options;
  const getNodeParams = buildNodeParams(options, node, node);
  let nodeParams;

  switch (node.type) {
    case "TSTypeAnnotation":
      nodeParams = getNodeParams(["typeAnnotation", "nodeParse"]);
      break;
    case "TSTypeReference":
      nodeParams = getNodeParams(
        ["typeName", "nodeParse"],
        ["typeParameters", "nodeParse"]
      );
      break;
    case "TSTypeParameterInstantiation":
      nodeParams = getNodeParams(["params", "nodesParse"]);
      break;
    case "TSNumberKeyword":
      nodeParams = { annotation: "number" };
      break;
    case "TSStringKeyword":
      nodeParams = { annotation: "string" };
      break;
    case "TSUnionType":
      nodeParams = getNodeParams(["types", "nodesParse"]);
      break;
    case "TSTypeAliasDeclaration":
      nodeParams = getNodeParams(
        ["id", "nodeParse"],
        ["typeParameters", "nodeParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "TSTypeLiteral":
      nodeParams = getNodeParams(["members", "nodesParse"]);
      break;
    case "TSPropertySignature":
      nodeParams = getNodeParams(
        ["computed"],
        ["key", "nodeParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "TSNullKeyword":
      nodeParams = { annotation: "null" };
      break;
    case "TSArrayType":
      nodeParams = getNodeParams(["members", "nodesParse"]);
      break;
    case "TSTypeParameterDeclaration":
      nodeParams = getNodeParams(["params", "nodesParse"]);
      break;
    case "TSTypeParameter":
      nodeParams = getNodeParams(["name"], ["default", "nodeParse"]);
      break;
    case "TSAnyKeyword":
      nodeParams = { annotation: "any" };
      break;
    case "TSTupleType":
      nodeParams = getNodeParams(["elementTypes", "nodesParse"]);
      break;
    case "TSInterfaceDeclaration":
      nodeParams = getNodeParams(
        ["id", "nodeParse"],
        ["typeParameters", "nodeParse"],
        ["body", "nodeParse"]
      );
      break;
    case "TSInterfaceBody":
      nodeParams = getNodeParams(["body", "nodesParse"]);
      break;
    case "TSIndexSignature":
      nodeParams = getNodeParams(
        ["parameters", "nodesParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "TSLiteralType":
      nodeParams = getNodeParams(["literal", "nodeParse"]);
      break;
    case "TSBooleanKeyword":
      nodeParams = { annotation: "boolean" };
      break;
    case "TSUndefinedKeyword":
      nodeParams = { annotation: "undefined" };
      break;
    case "TSModuleDeclaration":
      nodeParams = getNodeParams(["id", "nodeParse"], ["body", "nodeParse"]);
      break;
    case "TSModuleBlock":
      nodeParams = getNodeParams(["body", "nodesParse"]);
      break;
    case "File":
      nodeParams = getNodeParams(["program", "nodeParse"]);
      break;
    case "Program":
      nodeParams = getNodeParams(["body", "nodesParse"]);
      break;
    case "VariableDeclaration":
      nodeParams = getNodeParams(["kind"], ["declarations", "nodesParse"]);
      break;
    case "VariableDeclarator":
      nodeParams = getNodeParams(["id", "nodeParse"], ["init", "nodeParse"]);
      break;
    case "Identifier":
      nodeParams = getNodeParams(["name"], ["annotation", "nodeParse"]);
      break;
    case "NumericLiteral":
      nodeParams = { value: node.value, annotation: "number" };
      break;
    case "StringLiteral":
      nodeParams = { value: node.value, annotation: "string" };
      break;
    case "ArrayExpression":
      nodeParams = getNodeParams(["elements", "nodesParse"]);
      break;
    case "NewExpression":
      nodeParams = getNodeParams(
        ["callee", "nodeParse"],
        ["arguments", "nodesParse"]
      );
      break;
    case "LogicalExpression":
      nodeParams = getNodeParams(
        ["operator"],
        ["left", "nodeParse"],
        ["right", "nodeParse"]
      );
      break;
    case "FunctionDeclaration":
      nodeParams = getNodeParams(
        ["id", "nodeParse"],
        ["generator"],
        ["async"],
        ["params", "nodesParse"],
        ["returnType", "nodeParse"],
        ["body", "nodeParse"]
      );
      break;
    case "BlockStatement":
      nodeParams = getNodeParams(
        ["body", "nodesParse"],
        ["directives", ["nodesParse"]]
      );
      break;
    case "ObjectPattern":
      nodeParams = getNodeParams(
        ["properties", "nodesParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "ObjectProperty":
      nodeParams = getNodeParams(
        ["method"],
        ["key", "nodeParse"],
        ["computed"],
        ["shorthand"],
        ["value", "nodeParse"]
      );
      break;
    case "AssignmentPattern":
      nodeParams = getNodeParams(["left", "nodeParse"], ["rigth", "nodeParse"]);
      break;
    case "ReturnStatement":
      nodeParams = getNodeParams(["argument", "nodeParse"]);
      break;
    case "BooleanLiteral":
      nodeParams = { value: node.value, annotation: "boolean" };
      break;
    case "ObjectExpression":
      nodeParams = getNodeParams(["properties", "nodesParse"]);
      break;
    case "IfStatement":
      nodeParams = getNodeParams(
        ["test", "nodeParse"],
        ["consequent", "nodeParse"],
        ["alternate", "nodeParse"]
      );
      break;
    case "UnaryExpression":
      nodeParams = getNodeParams(
        ["operator"],
        ["prefix"],
        ["argument", "nodeParse"]
      );
      break;
    case "ClassDeclaration":
      nodeParams = getNodeParams(
        ["id", "nodeParse"],
        ["superClass", "nodeParse"],
        ["body", "nodeParse"]
      );
      break;
    case "ClassBody":
      nodeParams = getNodeParams(["body", "nodesParse"]);
      break;
    case "ClassProperty":
      nodeParams = getNodeParams(
        ["static"],
        ["key", "nodeParse"],
        ["computed"],
        ["typeAnnotation", "nodeParse"],
        ["value", "nodeParse"]
      );
      break;
    case "ArrowFunctionExpression":
      nodeParams = getNodeParams(
        ["returnType", "nodeParse"],
        ["id", "nodeParse"],
        ["generator"],
        ["async"],
        ["params", "nodesParse"],
        ["body", "nodeParse"]
      );
      break;
    case "NullLiteral":
      nodeParams = { value: null, annotation: "null" };
      break;
    case "ClassMethod":
      nodeParams = getNodeParams(
        ["static"],
        ["key", "nodeParse"],
        ["computed"],
        ["kind"],
        ["id", "nodeParse"],
        ["generator"],
        ["async"],
        ["params", "nodesParse"],
        ["body", "nodeParse"]
      );
      break;
    case "RestElement":
      nodeParams = getNodeParams(
        ["argument", "nodeParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "SpreadElement":
      nodeParams = getNodeParams(["argument", "nodeParse"]);
      break;
    case "ExportNamedDeclaration":
      nodeParams = getNodeParams(
        ["declaration", "nodeParse"],
        ["specifiers", "nodesParse"],
        ["source", "nodeParse"]
      );
      break;
    case "ExportSpecifier":
      nodeParams = getNodeParams(["exported", "nodeParse"]);
      break;
    case "ConditionalExpression":
      nodeParams = getNodeParams(
        ["test", "nodeParse"],
        ["consequent", "nodeParse"],
        ["alternate", "nodeParse"]
      );
      break;
    case "ExportDefaultDeclaration":
      nodeParams = getNodeParams(["declaration", "nodeParse"]);
      break;
    case "ImportDeclaration":
      nodeParams = getNodeParams(
        ["specifiers", "nodesParse"],
        ["source", "nodeParse"]
      );
      break;
    case "ImportDefaultSpecifier":
      nodeParams = getNodeParams(["local", "nodeParse"]);
      break;
    case "ImportSpecifier":
      nodeParams = getNodeParams(
        ["imported", "nodeParse"],
        ["local", "nodeParse"]
      );
      break;
    case "ImportNamespaceSpecifier":
      nodeParams = getNodeParams(["local", "nodeParse"]);
      break;
    case "BinaryExpression":
      logNode(node, "yellow", "ignore");
      return;
    case "ExpressionStatement":
      logNode(node, "yellow", "ignore");
      return;
    default:
      logNode(node, "green", "didn't parse");
      break;
  }

  nodeParams = { type: node.type, ...nodeParams };
  nodeParams = transform(nodeParams, node.type, { node, nodeParent });

  return nodeParams;
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
const buildNodeParams = (options = {}, node, nodeParent = null) => (
  ...config
) => {
  const nodeParams = config.reduce((memo, elConfig) => {
    const [key, method] = elConfig;
    switch (method) {
      case "nodeParse":
        memo[key] = nodeParse(options, nodeParent)(node[key]);
        break;
      case "nodesParse":
        memo[key] = nodesParse(options, nodeParent)(node[key]);
        break;
      default:
        memo[key] = node[key];
        break;
    }
    return memo;
  }, {});
  return Object.keys(nodeParams).length ? nodeParams : undefined;
};
