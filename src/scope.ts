import * as recast from "recast";

import * as common from "./common";
import { createStack, Stack } from "./stack";
import { createMemo, Memo } from "./memo";
import { createConifg } from "./config";
import { configs } from "./configs";

export type AnnotationMode = "type" | undefined;

export interface Scope {
  [propName: string]: any;
  originalType: string;
  annotation: (options?: { mode: AnnotationMode }) => string;
}

export interface State {
  scope: Scope;
  identifiers: Memo;
  node: common.Node;
}

export interface BuildScopeOptions {
  stack: Stack<State>;
}

export const createScope = (nodeRoot: common.Node): Scope => {
  const stack = createStack<State>();

  return buildScope({ stack })(nodeRoot);
};

export const buildScope = ({ stack }: BuildScopeOptions) => {
  return (node: common.Node): Scope => {
    const originalType = node.type;
    let scope: Scope = { originalType, annotation: () => "" };
    const stackLastEl = stack.last();
    const identifiers = createMemo(stackLastEl && stackLastEl.identifiers);
    const state: State = { scope, identifiers, node };

    Object.freeze(state);
    stack.add(state);

    // Build
    Object.keys(node).forEach((propName) => {
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

          if (common.getIsNode(prop)) {
            scope[propName] = buildScope({ stack })(prop as common.Node);
          } else if (common.getIsNodeArray(prop)) {
            scope[propName] = buildScopes({ stack })(prop as Array<
              common.Node
            >);
          } else {
            scope[propName] = prop;
          }
          break;
      }
    });

    // Get config
    const config = configs[originalType] || createConifg();

    scope = { ...scope, ...config.build({ state, stack }) };

    scope.annotation = (options) => {
      const { mode } = options || {};
      return config.annotation({ scope, mode });
    };

    return Object.freeze(scope);
  };
};

export const buildScopes = ({ stack }: BuildScopeOptions) => (
  nodes: Array<common.Node>,
): Array<Scope> => {
  return nodes.map((node) => buildScope({ stack })(node));
};
