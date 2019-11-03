import * as types from "./types";

export const buildScope = value => {
  if (value instanceof Array) {
    return value.map(buildScope);
  } else if (value) {
    const parseType = types[value.type];
    if (parseType) return parseType(value);
  }
  if (value) console.log(value.type);
  return types.createScope()(value);
};
