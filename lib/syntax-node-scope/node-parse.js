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

module.exports.combine = combine;
module.exports.typeRemove = typeRemove;
module.exports.nodesFile = nodesFile;
