import * as react from "recast";
import { createConifg, Config } from "./config";
import * as common from "./common";

type TTT = Pick<react.types.namedTypes.Identifier, "name">;

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

  TSTypeAliasDeclaration: createConifg({
    annotation: ({ scope }) => {
      const id = scope.id.annotation();
      const typeParameters = scope.typeParameters.annotation();
      const typeAnnotation = scope.typeAnnotation.annotation();

      return `type ${id}: ${typeParameters} = ${typeAnnotation}`;
    },
  }),

  Identifier: createConifg({
    build: ({ state, stack }) => {
      state.identifiers.add(state.scope.name as string, state.scope);
      return {};
    },
  }),
};
