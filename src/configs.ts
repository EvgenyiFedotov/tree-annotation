import { createConifg, Config } from "./config";
import * as common from "./common";

export const configs: { [propName: string]: Config } = {
  File: createConifg({
    annotation: ({ scope }) => {
      return scope.program.annotation();
    },
  }),

  Program: createConifg({
    annotation: ({ scope }) => {
      return common.getScopesAnnotation(scope.body).join("\n");
    },
  }),
};
