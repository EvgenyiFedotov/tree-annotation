import * as annotations from "./annotations";

export const build = (node, options = {}, nodeParent = null) => {
  if (!node) return;

  const builder = annotations[node.type];
  const result = builder && builder(node, options, nodeParent);

  if (result) {
    return result;
  }

  console.log("build annotation", node.type);
  return undefined;
};
