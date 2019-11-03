import * as recast from "recast";
import fs from "fs";
import * as nodeAnnotation from "./node-annotation";

/**
 * @param {{ src: string, nodeParse: {}} options
 * @return {{}}
 */
export const parseFile = options => {
  const { src } = options;
  const file = fs.readFileSync(src, "utf8");

  return parse(file);
};

/**
 * @param {string} value
 * @param {{ toAreaType?: boolean }} options
 */
export const parse = (value, options = {}) => {
  const { parser = require("recast/parsers/typescript") } = options;
  const nodeFile = recast.parse(value, { parser });

  const nodesBody = nodeFile.program.body;
  const nodesBodyByIds = nodesBody.reduce(reduceNodeById(options), {});

  return nodesBodyByIds;
};

const reduceNodeById = (options = {}) => (memo, node) => {
  let result = nodeAnnotation.build(node, options);

  if (result) {
    result = result instanceof Array ? result : [result];
    result.forEach(nodeAnnotation => {
      if (nodeAnnotation && nodeAnnotation.id) {
        memo[nodeAnnotation.id] = nodeAnnotation;
      }
    });
  }

  return memo;
};
