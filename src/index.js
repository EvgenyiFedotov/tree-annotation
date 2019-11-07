import * as recast from "recast";
import * as fs from "fs";
import { buildScope } from "./build-scope";

/**
 * @param {string} value
 * @param {{ toAreaType?: boolean }} options
 */
export const parse = (value, options = {}) => {
  const { parser = require("recast/parsers/typescript") } = options;
  const nodeFile = recast.parse(value, { parser });
  const scope = buildScope(nodeFile);

  return scope;
};

export const parseFile = src => {
  const file = fs.readFileSync(src, "utf8");

  return parse(file);
};
