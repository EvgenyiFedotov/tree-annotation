const recast = require("recast");
const fs = require("fs");
const chalkPipe = require("chalk-pipe");

const { nodeAnnotation } = require("./annotation");

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

  return nodesParse(nodeFile.program.body);
};

const nodesParse = (nodes = []) => nodes.map(nodeParse).filter(Boolean);

const nodeParse = node => {
  switch (node.type) {
    case "VariableDeclaration":
      return variableParse(node);
    case "TSTypeAliasDeclaration":
      return typeParse(node);
    case "TSInterfaceDeclaration":
      return interfaceParse(node);
    case "FunctionDeclaration":
      return functionParse(node);
    case "ExpressionStatement":
      return;
    default:
      return defaultParse(node);
  }
};

const defaultParse = node => {
  const type = chalkPipe("green")(node.type);
  console.log(`   Node with type [${type}] didn't parse`);
};

const variableParse = node => {
  const declarations = node.declarations.map(nodeDeclaration => {
    const id = nodeDeclaration.id.name;
    const annotation = nodeAnnotation(nodeDeclaration);

    return { id, annotation };
  });

  return { type: "variable", kind: node.kind, declarations };
};

const typeParse = node => {
  const id = node.id.name;
  const parameters = nodeAnnotation(node.typeParameters);
  const annotation = nodeAnnotation(node.typeAnnotation);

  return { type: "type", id, parameters, annotation };
};

const interfaceParse = node => {
  const id = node.id.name;
  const parameters = nodeAnnotation(node.typeParameters);
  const annotation = nodeAnnotation(node.body);

  return { type: "interface", id, parameters, annotation };
};

const functionParse = node => {
  console.log([node.returnType]);

  const id = node.id.name;
  const generator = node.generator;
  const async = node.async;
  const paramsAnnotaion = (node.params || []).map(nodeAnnotation);
  const params = paramsAnnotaion ? paramsAnnotaion : undefined;
  const returns = nodeAnnotation(node.returnType);
  const returnsBody = functionReturnsBody(node.body);

  return {
    type: "function",
    id,
    generator,
    async,
    params,
    returns,
    returnsBody
  };
};

const functionReturnsBody = node => {
  const nodesReturns = getReturnsNodes(node.body);
  return nodesReturns.length ? nodesReturns.map(nodeAnnotation) : undefined;
};

const getReturnsNodes = (nodes = []) =>
  nodes.reduce((memo, node) => {
    if (node.type === "ReturnStatement") {
      memo.push(node);
    }
    if (node.consequent) {
      if (node.consequent.type === "ReturnStatement") {
        memo.push(node.consequent);
      } else {
        memo = [
          ...memo,
          ...(node.consequent && getReturnsNodes(node.consequent.body))
        ];
      }
    }
    return memo;
  }, []);

module.exports.fileParse = fileParse;
module.exports.nodesParse = nodesParse;
module.exports.nodeParse = nodeParse;
