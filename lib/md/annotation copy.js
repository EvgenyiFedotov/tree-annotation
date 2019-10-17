const recast = require("recast");
const chalkPipe = require("chalk-pipe");

const {
  getNodeTokens,
  getTokensByTypeLabel,
  getValuesTokens,
  getReturnNodes
} = require("../file-tree");

const annotationNode = nodesById => node => {
  if (!node) return;

  switch (node.type) {
    case "BooleanLiteral":
      return "boolean";
    case "NumericLiteral":
      return "number";
    case "StringLiteral":
      return "string";
    case "ObjectProperty":
      return `${node.key.name}: ${annotationNode(nodesById)(node.value)}`;
    case "ArrowFunctionExpression":
      const funcReturn = annotaionFuncReturn(nodesById)(node);
      const funcParams = annotaionFuncParams(nodesById)(node);
      return `(${funcParams}) => ${funcReturn}`;
    case "ClassProperty":
      return (
        annotationNode(nodesById)(node.typeAnnotation) ||
        annotationNode(nodesById)(node.value)
      );
    case "TSTypeAnnotation":
      return annotationByCode(nodesById)(node.typeAnnotation);
    case "ReturnStatement":
      return annotationNode(nodesById)(node.argument);
    case "ObjectExpression":
      return `{ ${node.properties.map(annotationNode(nodesById)).join("; ")} }`;
    case "NullLiteral":
      return "null";
    case "Identifier":
      if (node.typeAnnotation) {
        const typeAnnotation =
          annotationNode(nodesById)(node.typeAnnotation) || "any";
        return `${node.name}: ${typeAnnotation}`;
      }

      return node.name;
    case "TSTypeAliasDeclaration":
      return annotationNode(nodesById)(node.typeAnnotation);
    case "TSNumberKeyword":
    case "TSStringKeyword":
    case "TSTypeReference":
    case "TSArrayType":
    case "TSUnionType":
    case "TSInterfaceBody":
      return annotationByCode(nodesById)(node);
    case "NewExpression":
      return annotationByCode(nodesById)(node.callee);
    default:
      console.log(
        `   Node [${chalkPipe("green")(node.type)}] doesn't have annotation`
      );
      return "unknow";
  }
};

const annotaionFuncParams = nodesById => node =>
  node.params
    .map(annotationByCode(nodesById))
    .join(", ")
    .replace(/\n/gm, " ");

const annotaionFuncReturn = nodesById => node =>
  annotationNode(nodesById)(node.returnType) ||
  annotationNodeReturnByBodyBody(node) ||
  "void";

const annotationNodeEscape = nodesById => node =>
  escape(annotationNode(nodesById)(node) || "unknow");

const annotationNodeReturnByBodyBody = node => {
  const nodesReturn = getReturnNodes(node.body.body);
  const annotationNodes = nodesReturn.map(annotationNode());
  const annotaion = annotationNodes.join(" | ");

  if (node.generator) {
    // TODO add yield type
    return `Iterator<${annotaion}>`;
  } else if (node.async) {
    return `Promise<${annotaion}>`;
  }

  return annotaion;
};

const nodeCode = node => recast.print(node).code;

const annotationByCode = (nodesById = {}) => node => {
  const code = recast.print(node).code;
  const tokens = getNodeTokens(node);
  const tokensByTypeLabel = getTokensByTypeLabel(tokens);
  const tokensValues = getValuesTokens(tokensByTypeLabel.name || []);
  const tokensValuesF = tokensValues.filter(label => !!nodesById[label]);

  return tokensValuesF.reduce((memo, value) => {
    const reg = new RegExp(`(${value})`, "g");
    return memo.replace(reg, "`$1`");
  }, code);
};

/**
 * @param {string} value
 */
const escape = value =>
  value
    .replace(/</gm, "&#60;")
    .replace(/>/gm, "&#62;")
    .replace(/\|/gm, "&#124;")
    .replace(/\"/gm, "&#34;")
    .replace(/ /gm, "&nbsp;")
    .replace(/^: /, "")
    .replace(/\n/gm, "<br/>");

module.exports.annotationNode = annotationNode;
module.exports.annotationNodeEscape = annotationNodeEscape;
module.exports.annotaionFuncParams = annotaionFuncParams;
module.exports.annotaionFuncReturn = annotaionFuncReturn;
module.exports.escape = escape;
