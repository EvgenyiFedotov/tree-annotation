import * as annotations from "./annotations";

/**
 * @param {Object} node
 * @param {{ toAreaType?: boolean }} options
 * @param {Object | null} [nodeParent]
 */
export const build = (node, options = {}, nodeParent = null) => {
  if (!node) return;

  const builder = annotations[node.type];

  if (builder) {
    return builder(node, options, nodeParent);
  } else {
    console.log("build annotation", node.type);
  }
};
