import * as recast from "recast";
import * as fs from "fs";
import { createScope } from "./scope";

/**
 * @param {string} value
 * @param {{ }} options
 */
export const parse = (value, options = {}) => {
  const { parser = require("recast/parsers/typescript") } = options;
  const nodeFile = recast.parse(value, { parser });
  const scope = createScope(nodeFile);

  return scope;
};

export const parseFile = src => {
  const file = fs.readFileSync(src, "utf8");

  return parse(file);
};
