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

export const createStack = () => {
  const stack = [];
  const add = value => {
    stack.push(value);
  };
  const remove = value => {
    const index = stack.indexOf(value);
    if (index !== -1) stack.splice(index);
  };
  const reset = () => {
    stack.splice(0);
  };
  const to = type => {
    for (let index = stack.length - 1; index >= 0; index -= 1) {
      const value = stack[index];
      if (value.originalType === type) return value;
    }
  };
  const prev = value => {
    const index = stack.indexOf(value);
    return stack[index - 1] || null;
  };
  const next = value => {
    const index = stack.indexOf(value);
    return stack[index + 1] || null;
  };
  return { stack, add, remove, reset, to, prev, next };
};

export const filterUniq = (values = []) => {
  return [...new Set(values)];
};

export const createMemoIds = (memoParent = null) => {
  const ids = {};
  const add = scope => {
    if (scope.originalType === "Identifier") {
      if (!ids[scope.name]) ids[scope.name] = [];
      ids[scope.name].push(scope);
      if (memoParent) memoParent.add(scope);
    }
  };
  return { ids, add };
};

export const scopeAnnotation = scope => {
  return scope ? scope.annotation() : "";
};

export const createConifg = (config = {}) => {
  const { builder = () => {}, annotation = () => "" } = config;
  return { builder, annotation };
};
