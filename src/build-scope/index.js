import * as common from "../common";
import * as configs from "./configs";

const currentScopeStack = common.createStack();

export const buildScope = value => {
  if (value instanceof Array) {
    return value.map(buildScope);
  } else if (value) {
    return createScope(value);
  }

  if (value) console.log(value.type);
  return createScope();
};

export const createScope = node => {
  const originalType = node.type;
  const scope = node ? { originalType } : {};

  // use context
  const stack = currentScopeStack.stack;
  const parent = stack[stack.length - 1];

  // add scope to context and create memo ids
  scope.ids = common.createMemoIds(parent && parent.ids);
  currentScopeStack.add(scope);

  // build
  const propNames = Object.keys(node);

  propNames.forEach(propName => {
    switch (propName) {
      case "loc":
      case "tokens":
      case "type":
      case "start":
      case "end":
        break;
      default:
        const prop = node[propName];

        if (common.getIsNode(prop) || common.getIsNodeArrayEl(prop)) {
          scope[propName] = buildScope(prop);
        } else {
          scope[propName] = prop;
        }
        break;
    }
  });

  const scopeConfig = configs[originalType] || common.createConifg();

  // use builder
  scopeConfig.builder({ scope, node, currentScopeStack });

  // added methods
  scope.annotation = mode => {
    return scopeConfig.annotation({ scope, node, mode });
  };

  currentScopeStack.remove(scope);
  delete scope.ids;

  return Object.freeze(scope);
};
