import * as recast from "recast";

import * as scope from "./scope";

export interface Node extends recast.types.namedTypes.Node {
  [propName: string]: PropNode;
}

export type PropNode =
  | recast.types.namedTypes.SourceLocation
  | recast.types.namedTypes.Comment
  | Array<recast.types.namedTypes.Comment>
  | string
  | Node
  | Array<Node>
  | null
  | undefined;

export const getIsNode = (value: PropNode): boolean => {
  return !!(value && value.constructor && value.constructor.name === "Node");
};

export const getIsNodeArray = (value: PropNode): boolean => {
  return !!(value instanceof Array && value.length && getIsNode(value[0]));
};

export const getScopeAnnotation = (
  scope?: scope.Scope,
  options?: { mode: scope.AnnotationMode },
) => {
  return scope ? scope.annotation(options) : "";
};

export const getScopesAnnotation = (
  scopes: Array<scope.Scope>,
  options?: { mode: scope.AnnotationMode },
) => {
  return scopes
    .map((scope) => getScopeAnnotation(scope, options))
    .filter(Boolean);
};
