const recast = require("recast");
const fs = require("fs");
const chalkPipe = require("chalk-pipe");

/**
 * @param {{ src: string, nodeParse: {}} options
 * @return {{}}
 */
const fileParse = options => {
  const { src } = options;

  const file = fs.readFileSync(src, "utf8");
  const nodeFile = recast.parse(file, {
    parser: require("recast/parsers/typescript")
  });

  const treeById = {};
  const tree = nodeParse({
    transform: (nodeParams, type) => {
      if (nodeParams.id) {
        treeById[nodeParams.id.name] = nodeParams;
      }
      return nodeParams;
    }
  })(nodeFile);

  return { tree, treeById };
};

const nodesParse = (options = {}) => (nodes = []) =>
  nodes.map(nodeParse(options)).filter(Boolean);

const nodeParse = (options = {}) => node => {
  if (!node) return;

  const { transform = nodeParams => nodeParams } = options;
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
    case "TSBooleanKeyword":
      nodeParams = { annotation: "boolean" };
      break;
    case "TSUndefinedKeyword":
      nodeParams = { annotation: "undefined" };
      break;
    case "TSModuleDeclaration":
      nodeParams = buildNodeParams(options, node)(
        ["id", "nodeParse"],
        ["body", "nodeParse"]
      );
      break;
    case "TSModuleBlock":
      nodeParams = { body: nodesParse(options)(node.body) };
      break;
    case "File":
      nodeParams = buildNodeParams(options, node)(["program", "nodeParse"]);
      break;
    case "Program":
      nodeParams = buildNodeParams(options, node)(["body", "nodesParse"]);
      break;
    case "VariableDeclaration":
      nodeParams = parseVariableDeclaration(options, node);
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
    case "FunctionDeclaration":
      nodeParams = buildNodeParams(options, node)(
        ["id", "nodeParse"],
        ["generator"],
        ["async"],
        ["params", "nodesParse"],
        ["returnType", "nodeParse"],
        ["body", "nodeParse"]
      );
      break;
    case "BlockStatement":
      nodeParams = buildNodeParams(options, node)(
        ["body", "nodesParse"],
        ["directives", ["nodesParse"]]
      );
      break;
    case "ObjectPattern":
      nodeParams = buildNodeParams(options, node)(
        ["properties", "nodesParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "ObjectProperty":
      nodeParams = buildNodeParams(options, node)(
        ["method"],
        ["key", "nodeParse"],
        ["computed"],
        ["shorthand"],
        ["value", "nodeParse"]
      );
      break;
    case "AssignmentPattern":
      nodeParams = buildNodeParams(options, node)(
        ["left", "nodeParse"],
        ["rigth", "nodeParse"]
      );
      break;
    case "ReturnStatement":
      nodeParams = buildNodeParams(options, node)(["argument", "nodeParse"]);
      break;
    case "BooleanLiteral":
      nodeParams = { value: node.value, annotation: "boolean" };
      break;
    case "ObjectExpression":
      nodeParams = buildNodeParams(options, node)(["properties", "nodesParse"]);
      break;
    case "IfStatement":
      nodeParams = buildNodeParams(options, node)(
        ["test", "nodeParse"],
        ["consequent", "nodeParse"],
        ["alternate", "nodeParse"]
      );
      break;
    case "UnaryExpression":
      nodeParams = buildNodeParams(options, node)(
        ["operator"],
        ["prefix"],
        ["argument", "nodeParse"]
      );
      break;
    case "ClassDeclaration":
      nodeParams = buildNodeParams(options, node)(
        ["id", "nodeParse"],
        ["superClass", "nodeParse"],
        ["body", "nodeParse"]
      );
      break;
    case "ClassBody":
      nodeParams = buildNodeParams(options, node)(["body", "nodesParse"]);
      break;
    case "ClassProperty":
      nodeParams = buildNodeParams(options, node)(
        ["static"],
        ["key", "nodeParse"],
        ["computed"],
        ["typeAnnotation", "nodeParse"],
        ["value", "nodeParse"]
      );
      break;
    case "ArrowFunctionExpression":
      nodeParams = buildNodeParams(options, node)(
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
      nodeParams = buildNodeParams(options, node)(
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
      nodeParams = buildNodeParams(options, node)(
        ["argument", "nodeParse"],
        ["typeAnnotation", "nodeParse"]
      );
      break;
    case "SpreadElement":
      nodeParams = buildNodeParams(options, node)(["argument", "nodeParse"]);
      break;
    case "ExportNamedDeclaration":
      nodeParams = buildNodeParams(options, node)(["declaration", "nodeParse"]);
      logNode(node, "grey", `ignore props: [specifiers, source]`);
      break;
    case "ConditionalExpression":
      nodeParams = buildNodeParams(options, node)(
        ["test", "nodeParse"],
        ["consequent", "nodeParse"],
        ["alternate", "nodeParse"]
      );
      break;
    case "ExportDefaultDeclaration":
      nodeParams = { declaration: nodeParse(options, node)(node.declaration) };
      break;
    case "ImportDeclaration":
      nodeParams = buildNodeParams(options, node)(
        ["specifiers", "nodesParse"],
        ["source", "nodeParse"]
      );
      break;
    case "ImportDefaultSpecifier":
      nodeParams = { local: nodeParse(options)(node.local) };
      break;
    case "ImportSpecifier":
      nodeParams = buildNodeParams(options, node)(
        ["imported", "nodeParse"],
        ["local", "nodeParse"]
      );
      break;
    case "ImportNamespaceSpecifier":
      nodeParams = { local: nodeParse(options)(node.local) };
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
  nodeParams = transform(nodeParams, node.type, node);

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

const parseVariableDeclaration = (options, node) => {
  const nodeParams = buildNodeParams(options, node)(
    ["kind"],
    ["declarations", "nodesParse"]
  );
  nodeParams.declarations.forEach(
    declaration => (declaration.kind = node.kind)
  );
  return nodeParams;
};

module.exports.fileParse = fileParse;
module.exports.nodesParse = nodesParse;
module.exports.nodeParse = nodeParse;
