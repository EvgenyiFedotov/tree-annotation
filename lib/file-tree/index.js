/**
 * @param {Array<any>} nodes
 *
 * @returns {{ [propName: string]: Array<any> }}
 */
const getNodesbyTypes = nodes =>
  nodes.reduce((memo, node) => {
    const { type } = node;
    if (!memo[type]) memo[type] = [];
    memo[type].push(node);
    return memo;
  }, {});

const getNodesByIds = (type, nodes) =>
  nodes.reduce((memo, node) => {
    let identity;

    switch (type) {
      case "TSTypeAliasDeclaration":
        identity = node.id.name;
        break;
      case "VariableDeclaration":
        if (node.declarations) {
          memo = { ...memo, ...getNodesByIds(type, node.declarations) };
        } else {
          identity = node.id.name;
        }
        break;
    }

    if (identity) {
      if (!memo[identity]) memo[identity] = [];
      memo[identity].push(node);
    }

    return memo;
  }, {});

module.exports.getNodesbyTypes = getNodesbyTypes;
module.exports.getNodesByIds = getNodesByIds;
