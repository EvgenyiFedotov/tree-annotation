import { build } from ".";

export const TSTypeAliasDeclaration = (node, options = {}) => {
  const type = "type";
  const id = node.id.name;
  const annotations = {
    parameters: build(node.typeParameters, options, node),
    annotation: build(node.typeAnnotation, options, node)
  };
  return { type, id, annotations };
};

export const TSUndefinedKeyword = () => {
  const type = "undefined";
  const value = undefined;
  return { type, value };
};

export const TSNullKeyword = () => {
  const type = "null";
  const value = null;
  return { type, value };
};

export const TSLiteralType = (node, options = {}, nodeParent = null) => {
  return build(node.literal, options, nodeParent);
};

export const NumericLiteral = node => {
  const type = "number";
  const value = node.value;
  return { type, value };
};

export const StringLiteral = node => {
  const type = "string";
  const value = node.value;
  return { type, value };
};

export const TSUnionType = (node, options = {}, nodeParent = null) => {
  const type = "union";
  const types = node.types.map(nodeType =>
    build(nodeType, options, nodeParent)
  );
  return { type, types };
};

export const TSStringKeyword = () => {
  const type = "string";
  const value = undefined;
  return { type, value };
};

export const TSNumberKeyword = () => {
  const type = "number";
  const value = undefined;
  return { type, value };
};

export const TSTypeReference = node => {
  const type = "ref";
  const name = node.typeName.name;
  const parameters = build(node.typeParameters);
  return { type, name, parameters };
};

export const TSTypeParameterInstantiation = (
  node,
  options = {},
  nodeParent = null
) => {
  return node.params.map(param => build(param, options, nodeParent));
};

export const TSTypeParameterDeclaration = (
  node,
  options = {},
  nodeParent = null
) => {
  return node.params.map(param => build(param, options, nodeParent));
};

export const TSTypeParameter = (node, options = {}) => {
  const type = "parameter";
  const name = node.name;
  const constraint = build(node.constraint, options, node);
  const def = build(node.default, options, node);
  return { type, name, constraint, default: def };
};

export const TSAnyKeyword = () => {
  const type = "any";
  const value = undefined;
  return { type, value };
};
