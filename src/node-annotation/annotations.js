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

export const TSInterfaceDeclaration = (node, options = {}) => {
  const type = "interface";
  const id = node.id.name;
  const annotations = {
    parameters: build(node.typeParameters, options, node),
    body: build(node.body, options, node)
  };
  return { type, id, annotations };
};

export const TSInterfaceBody = (node, options = {}, nodeParent = null) => {
  return node.body.map(nodeBody => build(nodeBody, options, nodeParent));
};

export const TSPropertySignature = (node, options = {}) => {
  const type = "property";
  const key = node.key.name;
  const computed = node.computed;
  const optional = !!node.optional;
  const annotation = build(node.typeAnnotation, options, node);
  return { type, key, computed, optional, annotation };
};

export const TSTypeAnnotation = (node, options = {}, nodeParent = null) =>
  build(node.typeAnnotation, options, nodeParent);

export const TSIndexSignature = (node, options = {}) => {
  const type = "index-signature";
  const parameters = node.parameters.map(nodeParameter =>
    build(nodeParameter, options, node)
  );
  const annotations = {
    annotation: build(node.typeAnnotation, options, node),
    parameters
  };
  return { type, annotations };
};

export const Identifier = (node, options = {}) => {
  const type = "id";
  const name = node.name;
  const annotation = build(node.typeAnnotation, options, node);
  return { type, name, annotation };
};
