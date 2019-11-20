import * as scope from "./scope";
import * as common from "./common";
import { Stack } from "./stack";

type ConfigOptionsBuild = (
  ...args: [
    {
      scope: scope.Scope;
      node: common.Node;
      state: scope.State;
      stack: Stack<scope.State>;
    },
  ]
) => void;

type ConfigOptionsAnnotation = (arg0: {
  scope: scope.Scope;
  mode: scope.AnnotationMode;
}) => string;

interface ConfigOptions {
  build?: ConfigOptionsBuild;
  annotation?: ConfigOptionsAnnotation;
}

export interface Config {
  build: ConfigOptionsBuild;
  annotation: ConfigOptionsAnnotation;
}

export const createConifg = (options: ConfigOptions = {}): Config => {
  const { build = () => {}, annotation = () => "" } = options;

  return { build, annotation };
};
