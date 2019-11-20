import * as recast from "recast";
import * as fs from "fs";

import { createScope, Scope } from "./scope";
import * as common from "./common";

export const parse = (): Scope => {
  const nodeRoot = recast.parse("var r = 1;", {
    parser: require("recast/parsers/typescript"),
  }) as common.Node;
  const scope = createScope(nodeRoot);

  return scope;
};

export const parseFile = (url: string): Scope => {
  return parse();
};
