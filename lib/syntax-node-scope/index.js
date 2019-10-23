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
      return nodeVariable(node);
    case "TSTypeAliasDeclaration":
      return nodeType(node);
    case "TSInterfaceDeclaration":
      return nodeInterface(node);
    case "ExpressionStatement":
      return;
    default:
      return nodeParseDefault(node);
  }
};

const nodeParseDefault = node => {
  const type = chalkPipe("green")(node.type);
  console.log(`   Node with type [${type}] didn't parse`);
};

const nodeVariable = node => {
  const declarations = node.declarations.map(nodeDeclaration => {
    const id = nodeDeclaration.id.name;
    const annotation = nodeAnnotation(nodeDeclaration);

    return { id, annotation };
  });

  return { type: "variable", kind: node.kind, declarations };
};

const nodeType = node => {
  // console.log("node.typeParameters", [node.typeParameters]);

  const id = node.id.name;
  const parameters = nodeAnnotation(node.typeParameters);
  const annotation = nodeAnnotation(node.typeAnnotation);

  return { type: "type", id, parameters, annotation };
};

const nodeInterface = node => {
  const id = node.id.name;
  const annotation = nodeAnnotation(node.body);

  return { type: "interface", id, annotation };
};

module.exports.fileParse = fileParse;
module.exports.nodesParse = nodesParse;
module.exports.nodeParse = nodeParse;
