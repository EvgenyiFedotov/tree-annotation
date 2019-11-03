export const getFileProgBody = file => {
  return file.program.body;
};

export const getIsNode = value => {
  return !!(value && value.constructor && value.constructor.name === "Node");
};

export const getIsNodeArrayEl = value => {
  return !!(value instanceof Array && value.length && getIsNode(value[0]));
};

export const getPropsNode = node => {
  const keys = Object.keys(node);
  const reduceIsNode = (memo, key) => {
    let prop = node[key];
    if (getIsNode(prop) || getIsNodeArrayEl(prop)) {
      memo[key] = prop;
    }
    return memo;
  };
  return keys.reduce(reduceIsNode, {});
};

export const getNodesReturn = (nodes = []) => {
  let result = [];
  nodes.forEach(function toResult(node) {
    if (node.type === "ReturnStatement") {
      result.push(node);
    } else {
      const propsNode = getPropsNode(node);
      const keys = Object.keys(propsNode);
      const eachKey = key => {
        let prop = propsNode[key];
        if (prop instanceof Array) {
          result = result.concat(getNodesReturn(prop));
        } else {
          result = result.concat(getNodesReturn([prop]));
        }
      };

      keys.forEach(eachKey);
    }
  });
  return result;
};
