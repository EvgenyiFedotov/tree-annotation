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
      case "TSInterfaceDeclaration":
      case "TSTypeAliasDeclaration":
        identity = node.id.name;
        break;
      case "VariableDeclaration":
        if (node.declarations) {
          const nodesByIds = getNodesByIds(type, node.declarations);
          Object.keys(nodesByIds).forEach(id => (nodesByIds[id].parent = node));
          memo = { ...memo, ...nodesByIds };
        } else {
          identity = node.id.name;
        }
        break;
    }

    if (identity && !memo[identity]) memo[identity] = node;

    return memo;
  }, {});

const getNodeTokens = node => {
  const { loc } = node;
  const annotationStart = loc.start;
  const annotationEnd = loc.end;
  return loc.tokens.slice(annotationStart.token, annotationEnd.token);
};

module.exports.getNodesbyTypes = getNodesbyTypes;
module.exports.getNodesByIds = getNodesByIds;
module.exports.getNodeTokens = getNodeTokens;
