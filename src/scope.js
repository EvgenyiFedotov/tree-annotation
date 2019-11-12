import { createStack } from "./stack";
import { createConifg } from "./config";
import { createMemo } from "./object-memo";
import * as common from "./common";
import * as configs from "./configs";

export const createScope = nodeRoot => {
  const stack = createStack();

  const buildScope = node => {
    if (node instanceof Array) {
      return node.map(buildScope);
    } else if (node) {
      const propNames = Object.keys(node);
      const originalType = node.type;
      const scope = { originalType };
      const identifiers = createMemo(stack.last() && stack.last().identifiers);
      const state = { scope, identifiers };

      Object.freeze(state);
      stack.add(state);

      // build
      propNames.forEach(propName => {
        switch (propName) {
          case "loc":
          case "tokens":
          case "type":
          case "start":
          case "end":
          case "trailingComments":
          case "comments":
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

      // get config
      const config = configs[originalType] || createConifg();

      config.builder({ scope, node, stack }, { buildScope });

      // added methods
      scope.annotation = (params = {}) => {
        const { mode } = params;
        return config.annotation({ scope, node, mode });
      };

      stack.remove(state);

      return Object.freeze(scope);
    }
  };

  return buildScope(nodeRoot);
};
