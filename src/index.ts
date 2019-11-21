import * as recast from "recast";
import * as fs from "fs";

import { createScope, Scope } from "./scope";
import * as common from "./common";

export const parse = (value: string): Scope => {
  const nodeRoot = recast.parse(value, {
    parser: require("recast/parsers/typescript"),
  }) as common.Node;
  const scope = createScope(nodeRoot);

  return scope;
};

export const parseFile = (url: string): Scope => {
  const file = fs.readFileSync(url, "utf8");

  return parse(file);
};
