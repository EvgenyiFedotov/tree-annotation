/**
 * @param {Array<any>} nodes
 *
 * @returns {{ [propName: string]: Array<any> }}
 */
const getNodesByTypes = nodes =>
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
      case "FunctionDeclaration":
      case "ClassDeclaration":
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

const getTokensByTypeLabel = tokens =>
  tokens.reduce((memo, token) => {
    const { type } = token;
    if (!memo[type.label]) memo[type.label] = [];
    memo[type.label].push(token);
    return memo;
  }, {});

/**
 * @returns {Array<string>}
 */
const getValuesTokens = tokens =>
  tokens.reduce((memo, token) => {
    memo.push(token.value);
    return memo;
  }, []);

const getReturnNodes = nodes =>
  (nodes || []).reduce((memo, node) => {
    if (node.type === "ReturnStatement") {
      memo.push(node);
    }
    if (node.consequent) {
      if (node.consequent.type === "ReturnStatement") {
        memo.push(node.consequent);
      } else {
        memo = [
          ...memo,
          ...(node.consequent && getReturnNodes(node.consequent.body))
        ];
      }
    }
    return memo;
  }, []);

// TODO
const getYieldNodes = nodes => {};

module.exports.getNodesByTypes = getNodesByTypes;
module.exports.getNodesByIds = getNodesByIds;
module.exports.getNodeTokens = getNodeTokens;
module.exports.getTokensByTypeLabel = getTokensByTypeLabel;
module.exports.getValuesTokens = getValuesTokens;
module.exports.getReturnNodes = getReturnNodes;
