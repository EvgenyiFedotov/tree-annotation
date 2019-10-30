const chalkPipe = require("chalk-pipe");

const combine = (...transforms) => (nodeParams, type, node) =>
  transforms.reduce(
    (memo, transform) => transform(memo, type, node),
    nodeParams
  );

const typeRemove = nodeParams => {
  delete nodeParams.type;
  return nodeParams;
};

const nodesFile = (nodeParams, type) => {
  switch (type) {
    case "File":
      return nodeParams.program;
    case "Program":
      return nodeParams.body;
    default:
      return nodeParams;
  }
};

const varibaleAddKind = (nodeParams, type, { nodeParent }) => {
  switch (type) {
    case "VariableDeclarator":
      nodeParams.kind = nodeParent.kind;
      break;
  }
  return nodeParams;
};

const createReduceTreeById = () => {
  const treeById = {};

  const nodeParamsAdd = nodeParams => {
    if (nodeParams && nodeParams.id) {
      treeById[nodeParams.id.name] = nodeParams;
    }
  };

  return [
    treeById,
    (nodeParams, type) => {
      if (type === "Program") {
        nodeParams.body.forEach(bodyElNodeParse => {
          switch (bodyElNodeParse.type) {
            case "VariableDeclaration":
              bodyElNodeParse.declarations.forEach(nodeParamsAdd);
              break;
            case "TSTypeAliasDeclaration":
            case "TSInterfaceDeclaration":
            case "FunctionDeclaration":
            case "ClassDeclaration":
            case "ImportDeclaration":
            case "TSModuleDeclaration":
              nodeParamsAdd(bodyElNodeParse);
              break;
            case "ExportNamedDeclaration":
              nodeParamsAdd(bodyElNodeParse.declaration);
              break;
            case "ExportDefaultDeclaration":
              break;
            default:
              const type = chalkPipe("orange")(bodyElNodeParse.type);
              console.log(
                `   NodeParams with type [${type}] does't set in tree by ids`
              );
              break;
          }
        });
      }
      return nodeParams;
    }
  ];
};

module.exports.combine = combine;
module.exports.typeRemove = typeRemove;
module.exports.nodesFile = nodesFile;
module.exports.varibaleAddKind = varibaleAddKind;
module.exports.createReduceTreeById = createReduceTreeById;
