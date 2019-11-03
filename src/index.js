import * as recast from "recast";
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
