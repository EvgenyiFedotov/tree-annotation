import * as scope from "./scope";
import * as common from "./common";
import { Stack } from "./stack";

type Build = (
  ...args: [
    {
      state: scope.State;
      stack: Stack<scope.State>;
    },
  ]
) => { [propName: string]: any };

type Annotation = (arg0: {
  scope: scope.Scope;
  mode: scope.AnnotationMode;
}) => string;

interface ConfigOptions {
  build?: Build;
  annotation?: Annotation;
}

export interface Config {
  build: Build;
  annotation: Annotation;
}

export const createConifg = (options: ConfigOptions = {}): Config => {
  const {
    build = () => ({}),
    annotation = ({ scope }: { scope: scope.Scope }) => {
      console.log(`Annotaion doesn't exist ${scope.originalType}`);

      return "";
    },
  } = options;

  return { build, annotation };
};
