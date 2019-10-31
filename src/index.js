import * as recast from "recast";
import fs from "fs";
import valueEqual from "value-equal";

/**
 * @param {{ src: string, nodeParse: {}} options
 * @return {{}}
 */
export const parseFile = options => {
  const { src } = options;
  const file = fs.readFileSync(src, "utf8");

  return parse(file);
};

export const parse = (value, options = {}) => {
  const { parser = require("recast/parsers/typescript") } = options;
  const nodeFile = recast.parse(value, { parser });

  const nodesBody = nodeFile.program.body;
  const nodesBodyByIds = nodesBody.reduce(reduceNodeById(options), {});

  return nodesBodyByIds;
};

const reduceNodeById = (options = {}, nodeParent = null) => (memo, node) => {
  const result = buildNode(options, nodeParent)(node);

  if (result) {
    result.forEach(nodeAnnotation => {
      memo[nodeAnnotation.id] = nodeAnnotation;
    });
  }

  return memo;
};

export const buildNode = (options = {}, nodeParent = null) => node => {
  const buildNodeNext = buildNode(options, node);

  switch (node.type) {
    default:
      console.log(node.type);
      break;
  }
};

export const getAnnotation = () => node => buildAnnotation(node);

export const buildAnnotation = node => {
  if (!node) return "unknow";

  switch (node.type) {
    default:
      console.log("buildAnnotation", node.type);
      return "unknow";
  }
};
