import * as annotations from "./annotations";

/**
 * @param {Object | Array<Object>} value
 * @param {{ toAreaType?: boolean }} options
 * @param {Object | null} [nodeParent]
 */
export const build = (value, options = {}, nodeParent = null) => {
  if (!value) return;

  if (value instanceof Array) {
    return value.map(node => build(node, options, nodeParent));
  } else {
    const type = value.type;
    const builder = annotations[type];

    if (builder) {
      return builder(value, options, nodeParent);
    } else {
      console.log("build annotation", type);
    }
  }
};
