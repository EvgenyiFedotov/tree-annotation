const recast = require("recast");
const chalkPipe = require("chalk-pipe");

const { getReturnNodes } = require("./nodes");

const annotationNode = node => {
  if (!node) return;

  switch (node.type) {
    case "BooleanLiteral":
      return "boolean";
    case "NumericLiteral":
      return "number";
    case "StringLiteral":
      return "string";
    case "ObjectProperty":
      return `${node.key.name}: ${annotationNode(node.value)}`;
    case "ArrowFunctionExpression":
      const funcReturn = annotaionFuncReturn(node);
      const funcParams = annotaionFuncParams(node);
      return `(${funcParams}) => ${funcReturn}`;
    case "ClassProperty":
      return annotationNode(node.typeAnnotation) || annotationNode(node.value);
    case "TSTypeAnnotation":
      return nodeCode(node.typeAnnotation);
    case "ReturnStatement":
      return annotationNode(node.argument);
    case "ObjectExpression":
    case "ObjectPattern":
      return `{ ${node.properties.map(annotationNode).join("; ")} }`;
    case "NullLiteral":
      return "null";
    case "Identifier":
      if (node.typeAnnotation) {
        const typeAnnotation = annotationNode(node.typeAnnotation) || "any";
        return `${node.name}: ${typeAnnotation}`;
      }

      return node.name;
    case "TSTypeAliasDeclaration":
      return annotationNode(node.typeAnnotation);
    case "TSNumberKeyword":
    case "TSStringKeyword":
    case "TSTypeReference":
    case "TSArrayType":
    case "TSUnionType":
    case "TSInterfaceBody":
      return nodeCode(node);
    case "NewExpression":
      return nodeCode(node.callee);
    default:
      console.log(
        `   Node [${chalkPipe("green")(node.type)}] doesn't have annotation`
      );
      return "unknow";
  }
};

const annotaionFuncParams = node =>
  node.params
    .map(nodeCode)
    .join(", ")
    .replace(/\n/gm, " ");

const annotaionFuncReturn = node =>
  annotationNode(node.returnType) ||
  annotationNodeReturnByBodyBody(node) ||
  "void";

const annotationNodeReturnByBodyBody = node => {
  const nodesReturn = getReturnNodes(node.body.body);
  const annotationNodes = nodesReturn.map(annotationNode);
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

module.exports.annotationNode = annotationNode;
module.exports.annotaionFuncParams = annotaionFuncParams;
module.exports.annotaionFuncReturn = annotaionFuncReturn;
