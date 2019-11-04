import { build } from ".";
import * as common from "./common";

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
  let def = build(node.default, options, node) || (constraint ? "" : "any");
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
  body = body.length ? `${body.join("; ")}; ` : "";
  return `{ ${body}}`;
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
  const optional = !!node.optional;
  const typeAnnotation = build(node.typeAnnotation, options, node) || "any";
  const result = { type, name, optional, typeAnnotation };

  result.toString = () => {
    return `${name}${optional ? "?" : ""}${
      typeAnnotation ? `: ${typeAnnotation}` : ""
    }`;
  };

  return result;
};

export const TSEnumDeclaration = (node, options = {}) => {
  const type = "enum";
  const id = node.id.name;
  let members = node.members.map(nodeMember =>
    build(nodeMember, options, node)
  );
  members = `{ ${members.length ? `${members.join(", ")} ` : ""}}`;
  return { type, id, members };
};

export const TSEnumMember = (node, options = {}) => {
  const name = node.id.name;
  const initializer = build(node.initializer, options, node);
  return initializer ? `${name} = ${initializer}` : name;
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
  const typeAnnotation = build(node.id.typeAnnotation, options, node);
  const typeInit = node.init && node.init.type;
  const init =
    typeInit === "TSAsExpression"
      ? build(node.init.expression, options, node)
      : build(node.init, options, node);
  const as =
    typeInit === "TSAsExpression"
      ? build(node.init.typeAnnotation, options, node)
      : undefined;
  return { type, id, kind, typeAnnotation, init, as };
};

export const NewExpression = node => {
  const name = node.callee.name;
  const result = { name };

  result.toString = () => {
    return name;
  };

  result.toCode = () => {
    return `new ${name}()`;
  };

  return result;
};

export const TSParenthesizedType = (node, options = {}, nodeParent = null) => {
  return build(node.typeAnnotation, options, nodeParent);
};

export const TSFunctionType = (node, options = {}) => {
  let typeParameters = build(node.typeParameters, options, node);
  typeParameters = typeParameters ? typeParameters : "";
  let parameters = node.parameters.map(nodeParameter => {
    return `${nodeParameter.name}: ${build(
      nodeParameter.typeAnnotation,
      options,
      node
    ) || "any"}`;
  });
  parameters = parameters.length ? parameters.join(", ") : "";
  const typeAnnotation = build(node.typeAnnotation, options, node);
  return `${typeParameters}(${parameters}) => ${typeAnnotation}`;
};

export const TSVoidKeyword = () => {
  return "void";
};

export const TSTupleType = (node, options = {}) => {
  const { toAreaType = false } = options;

  let elementTypes = build(node.elementTypes, options, node);
  let result;

  if (toAreaType) {
    elementTypes = common.getUnicTypes(elementTypes);
    result = `Array<${elementTypes.join(" | ")}>`;
  } else {
    result = `[${elementTypes.join(", ")}]`;
  }

  return result;
};

export const ArrowFunctionExpression = (node, options = {}) => {
  const params = build(node.params, options, node);
  const body = ArrowFunctionExpressionReturn(node, options);

  return `(${params.join(", ")}) => ${body}`;
};

export const ArrowFunctionExpressionReturn = (node, options = {}) => {
  const asyncc = node.async;
  const returnType = build(node.returnType, options, node);

  if (returnType) {
    return asyncc ? `Promise<${returnType}>` : returnType;
  } else {
    let body = build(node.body, options);
    body = body instanceof Array ? body : [body];
    body = body.join(" | ") || "void";
    return asyncc ? `Promise<${body}>` : body;
  }
};

export const ArrayExpression = (node, options = {}, nodeParent) => {
  const { toAreaType = false } = options;

  let elements = build(node.elements, options, nodeParent);
  let result;

  if (toAreaType) {
    elements = common.getUnicTypes(elements);
    result = `Array<${elements.join(" | ")}>`;
  } else {
    result = `[${elements.join(", ")}]`;
  }

  return result;
};

export const BlockStatement = (node, options = {}, nodeParent = null) => {
  let nodesReturn = build(
    common.getNodesReturn(node.body),
    options,
    nodeParent
  );

  nodesReturn = common.getUnicTypes(nodesReturn);

  return nodesReturn.join(" | ");
};

export const ReturnStatement = (node, options = {}, nodeParent = null) => {
  return build(node.argument, options, nodeParent);
};

export const AssignmentPattern = (node, options = {}) => {
  const left = build(node.left, options, node);
  const right = build(node.right, options, node);
  const result = { right, left };

  result.toString = () => {
    const rightArea = build(node.right, { toAreaType: true }, node);
    const rightCode = right.toCode ? right.toCode() : right;
    return `${left.name}: ${rightArea} = ${rightCode}`;
  };

  return result;
};
