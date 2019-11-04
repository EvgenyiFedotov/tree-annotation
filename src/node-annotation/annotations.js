import { build } from ".";

export const TSTypeAliasDeclaration = (node, options = {}) => {
  const type = "type";
  const id = node.id.name;
  const typeParameters = build(node.typeParameters, options, node);
  const typeAnnotation = build(node.typeAnnotation, options, node);
  return { type, id, typeParameters, typeAnnotation };
};

export const TSUndefinedKeyword = () => {
  return undefined;
};

export const TSNullKeyword = () => {
  return null;
};

export const TSLiteralType = (node, options = {}, nodeParent = null) => {
  return build(node.literal, options, nodeParent);
};

export const NumericLiteral = (node, options = {}) => {
  const { toAreaType = false } = options;
  return toAreaType ? "number" : node.value;
};

export const StringLiteral = (node, options = {}) => {
  const { toAreaType = false } = options;
  return toAreaType ? "string" : `'${node.value}'`;
};

export const TSUnionType = (node, options = {}, nodeParent = null) => {
  const types = node.types
    .map(nodeType => build(nodeType, options, nodeParent))
    .join(" | ");
  return `${types}`;
};

export const TSStringKeyword = () => {
  return "string";
};

export const TSNumberKeyword = () => {
  return "number";
};

export const TSTypeReference = (node, options = {}) => {
  const name = node.typeName.name;
  const params = build(node.typeParameters, options, node) || [];
  return params.length ? `${name}<${params.join(", ")}>` : name;
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
  const params = node.params
    .map(param => build(param, options, nodeParent))
    .join(", ");
  return params.length ? `<${params}>` : "";
};

export const TSTypeParameter = (node, options = {}) => {
  const name = node.name;
  let constraint = build(node.constraint, options, node);
  constraint = constraint ? ` extends ${constraint}` : "";
  let def = build(node.default, options, node);
  def = def ? ` = ${def}` : "";
  return `${name}${constraint}${def}`;
};

export const TSAnyKeyword = () => {
  return "any";
};

export const TSInterfaceDeclaration = (node, options = {}) => {
  const type = "interface";
  const id = node.id.name;
  const typeParameters = build(node.typeParameters, options, node);
  const body = build(node.body, options, node);
  return { type, id, typeParameters, body };
};

export const TSInterfaceBody = (node, options = {}, nodeParent = null) => {
  let body = node.body.map(nodeBody => build(nodeBody, options, nodeParent));
  body = body.length ? `${body.join("; ")};` : "";
  return `{ ${body} }`;
};

export const TSPropertySignature = (node, options = {}) => {
  const key = node.key.name;
  const optional = !!node.optional;
  const annotation = build(node.typeAnnotation, options, node);
  return `${key}${optional ? "?" : ""}: ${annotation}`;
};

export const TSTypeAnnotation = (node, options = {}, nodeParent = null) =>
  build(node.typeAnnotation, options, nodeParent);

export const TSIndexSignature = (node, options = {}) => {
  const params = node.parameters
    .map(nodeParam => `${nodeParam.name}: ${build(nodeParam.typeAnnotation)}`)
    .join(", ");
  const typeAnnotation = build(node.typeAnnotation, options, node);
  return `[${params}]: ${typeAnnotation}`;
};

export const Identifier = (node, options = {}) => {
  const type = "id";
  const name = node.name;
  const annotation = build(node.typeAnnotation, options, node);
  return { type, name, annotation };
};

export const TSEnumDeclaration = (node, options = {}) => {
  const type = "enum";
  const id = node.id.name;
  const members = node.members.map(nodeMember =>
    build(nodeMember, options, node)
  );
  return { type, id, members };
};

export const TSEnumMember = (node, options = {}) => {
  const type = "enum-member";
  const id = node.id.name;
  const init = build(node.initializer, options, node);
  return { type, id, init };
};

export const VariableDeclaration = (node, options = {}) => {
  return node.declarations.map(nodeDeclaration => {
    return build(nodeDeclaration, options, node);
  });
};

export const VariableDeclarator = (node, options = {}, nodeParent) => {
  const type = "variable";
  const id = node.id.name;
  const kind = nodeParent.kind;
  const annotations = {
    id: build(node.id.typeAnnotation, options, node),
    init: build(node.init, options, node)
  };
  return { type, id, kind, annotations };
};

export const NewExpression = (node, options = {}) => {
  const type = "new";
  const name = node.callee.name;
  const args = node.arguments.map(nodeArgument => {
    return build(nodeArgument, options, node);
  });
  return { type, name, arguments: args };
};

export const TSAsExpression = (node, options = {}) => {
  const type = "as";
  const expression = build(node.expression, options, node);
  const annotation = build(node.typeAnnotation, options, node);
  return { type, expression, annotation };
};

export const TSParenthesizedType = (node, options = {}, nodeParent) => {
  return build(node.typeAnnotation, options, nodeParent);
};

export const TSFunctionType = (node, options = {}) => {
  const type = "function-type";
  const typeParameters = build(node.typeParameters, options, node);
  const typeAnnotation = build(node.typeAnnotation, options, node);
  const parameters = node.parameters.map(nodeParameter =>
    build(nodeParameter, options, node)
  );
  return { type, typeParameters, typeAnnotation, parameters };
};

export const TSVoidKeyword = () => {
  const type = "void";
  return { type };
};

// TODO
export const ArrowFunctionExpression = node => {
  // console.log([node]);
};
