import { buildScope } from ".";
import * as common from "../common";

const currentScopeStack = common.createStack();

export function createScope(builder = () => {}, toString = () => "") {
  function Scope(node, options = {}) {
    const scope = node ? { originalType: node.type } : {};
    const stack = currentScopeStack.stack;
    const parent = stack[stack.length - 1];
    scope.ids = common.createMemoIds(parent && parent.ids);
    currentScopeStack.add(scope);
    builder({ scope, node, options });
    scope.toString = (mode = null) => toString({ scope, node, options, mode });
    currentScopeStack.remove(scope);
    delete scope.ids;
    return Object.freeze(scope);
  }
  return (node, options) => new Scope(node, options);
}

export const File = createScope(({ scope, node }) => {
  scope.type = "file";
  scope.program = buildScope(node.program);
});

export const Program = createScope(({ scope, node }) => {
  scope.type = "program";
  scope.body = buildScope(node.body);
});

export const TSTypeAliasDeclaration = createScope(
  ({ scope, node }) => {
    scope.type = "type";
    scope.id = buildScope(node.id);
    scope.typeParameters = buildScope(node.typeParameters);
    scope.typeAnnotation = buildScope(node.typeAnnotation);
  },
  ({ scope }) => {
    const type = scope.type;
    const id = scope.id.toString();
    const typeParameters = scope.typeParameters.toString();
    const typeAnnotation = scope.typeAnnotation.toString();
    return `${type} ${id}: ${typeParameters} = ${typeAnnotation}`;
  }
);

export const VariableDeclaration = createScope(
  ({ scope, node }) => {
    scope.type = "variable-declaration";
    scope.kind = node.kind;
    scope.declarations = buildScope(node.declarations);
  },
  ({ scope }) => {
    const kind = scope.kind;
    const declarations = scope.declarations
      .map(declaration => declaration.toString())
      .join(", ");
    return `${kind} ${declarations}`;
  }
);

export const VariableDeclarator = createScope(
  ({ scope, node }) => {
    scope.type = "variable";
    scope.id = buildScope(node.id);
    scope.init = buildScope(node.init);
  },
  ({ scope }) => {
    const id = scope.id.name;
    const typeAnnotationStr = scope.id.typeAnnotation.toString();
    const typeAnnotation = typeAnnotationStr && `: ${typeAnnotationStr}`;
    const init = scope.init.toString();
    return `${id}${typeAnnotation} = ${init}`;
  }
);

// ADDED

export const Identifier = createScope(
  ({ scope, node }) => {
    scope.name = node.name;
    scope.optional = !!node.optional;
    scope.typeAnnotation = buildScope(node.typeAnnotation);
    scope.ids.add(scope);
  },
  ({ scope, mode }) => {
    const typeAnnotationStr = scope.typeAnnotation.toString();

    switch (mode) {
      case "type":
        return typeAnnotationStr;
      default:
        const name = scope.name;
        const optional = scope.optional ? "?" : "";
        const typeAnnotation = typeAnnotationStr && `: ${typeAnnotationStr}`;
        return `${name}${optional}${typeAnnotation}`;
    }
  }
);

export const TSTypeReference = createScope(
  ({ scope, node }) => {
    scope.typeName = buildScope(node.typeName);
    scope.typeParameters = buildScope(node.typeParameters);
  },
  ({ scope }) => {
    const name = scope.typeName.name;
    const typeParameters = scope.typeParameters.toString();
    return `${name}${typeParameters}`;
  }
);

export const TSTypeParameterDeclaration = createScope(
  ({ scope, node }) => {
    scope.params = buildScope(node.params);
  },
  ({ scope }) => {
    const params = scope.params.map(param => param.toString());
    return params.length ? `<${params.join(", ")}>` : "";
  }
);

export const TSTypeParameter = createScope(
  ({ scope, node }) => {
    scope.name = node.name;
    scope.constraint = buildScope(node.constraint);
    scope.default = buildScope(node.default);
  },
  ({ scope }) => {
    const name = scope.name;
    const constraintStr = scope.constraint.toString();
    const constraint = constraintStr && ` extends ${constraintStr}`;
    const defStr = scope.default.toString();
    const def = defStr && ` = ${defStr}`;
    return `${name}${constraint}${def}`;
  }
);

export const TSStringKeyword = createScope(
  ({ scope }) => {
    scope.type = "string";
  },
  () => "string"
);

export const TSLiteralType = node => {
  return buildScope(node.literal);
};

export const StringLiteral = createScope(
  ({ scope, node }) => {
    scope.type = "string";
    scope.value = node.value;
  },
  ({ scope, mode }) => {
    switch (mode) {
      case "type":
        return scope.type;
      default:
        return scope.value;
    }
  }
);

export const TSAsExpression = createScope(
  ({ scope, node }) => {
    scope.expression = buildScope(node.expression);
    scope.typeAnnotation = buildScope(node.typeAnnotation);
  },
  ({ scope }) => {
    const expression = scope.expression.toString();
    const typeAnnotation = scope.typeAnnotation.toString();
    return `${expression} as ${typeAnnotation}`;
  }
);

export const TSTypeAnnotation = node => {
  return buildScope(node.typeAnnotation);
};

export const TSTypeParameterInstantiation = createScope(
  ({ scope, node }) => {
    scope.params = buildScope(node.params);
  },
  ({ scope }) => {
    const params = scope.params.map(param => param.toString());
    return params.length ? `<${params.join(", ")}>` : "";
  }
);

export const TSUnionType = createScope(
  ({ scope, node }) => {
    scope.types = buildScope(node.types);
  },
  ({ scope }) => {
    return scope.types.map(type => type.toString()).join(" | ");
  }
);

export const TSNumberKeyword = createScope(
  ({ scope }) => {
    scope.type = "number";
  },
  () => "number"
);

export const ArrayExpression = createScope(
  ({ scope, node }) => {
    scope.elements = buildScope(node.elements);
  },
  ({ scope, mode }) => {
    const elements = scope.elements.map(element => element.toString(mode));
    switch (mode) {
      case "type":
        return `Array<${common.filterUniq(elements).join(" | ")}>`;
      default:
        return `[${elements.join(", ")}]`;
    }
  }
);

export const NumericLiteral = createScope(
  ({ scope, node }) => {
    scope.type = "number";
    scope.value = node.value;
  },
  ({ scope, mode }) => {
    switch (mode) {
      case "type":
        return scope.type;
      default:
        return scope.value;
    }
  }
);

export const TSFunctionType = createScope(
  ({ scope, node }) => {
    scope.typeParameters = buildScope(node.typeParameters);
    scope.parameters = buildScope(node.parameters);
    scope.typeAnnotation = buildScope(node.typeAnnotation);
  },
  ({ scope }) => {
    const typeParameters = scope.typeParameters.toString();
    const parameters = scope.parameters
      .map(param => param.toString())
      .join(", ");
    const typeAnnotation = scope.typeAnnotation.toString() || "void";
    return `${typeParameters}(${parameters}) => ${typeAnnotation}`;
  }
);

export const ArrowFunctionExpression = createScope(
  ({ scope, node }) => {
    scope.id = node.id;
    scope.generator = node.generator;
    scope.async = node.async;
    scope.typeParameters = buildScope(node.typeParameters);
    scope.params = buildScope(node.params);
    scope.body = buildScope(node.body);
    scope.returnType = buildScope(node.returnType);
  },
  ({ scope }) => {
    const asnc = scope.async ? "async " : "";
    const typeParameters = scope.typeParameters.toString();
    const params = scope.params.map(param => param.toString()).join(", ");
    const returnType = scope.returnType.toString();
    const body = scope.body.toString();
    return `${asnc}${typeParameters}(${params}) => ${returnType || body}`;
  }
);

export const BlockStatement = createScope(
  ({ scope, node }) => {
    scope.body = buildScope(common.getNodesReturn(node.body));
    scope.calcAsync = currentScopeStack.prev(scope).async;
  },
  ({ scope }) => {
    let body = common.filterUniq(
      scope.body.map(el => el.toString()).filter(Boolean)
    );
    body = body.join(" | ") || "void";
    return scope.calcAsync ? `Promise<${body}>` : body;
  }
);

export const ReturnStatement = createScope(
  ({ scope, node }) => {
    scope.argument = buildScope(node.argument);
    scope.calcType = "";

    if (scope.argument.originalType === "Identifier") {
      const scopeBlock = currentScopeStack.to("BlockStatement");
      const scopeFunc = currentScopeStack.prev(scopeBlock);
      const scopeIds = scopeFunc.ids.ids[scope.argument.name];

      if (scopeIds) {
        let scopeIdTypes = scopeIds
          .map(id => id.toString("type"))
          .filter(Boolean);

        scope.calcType = common.filterUniq(scopeIdTypes).join(" | ");
      }
    }
  },
  ({ scope }) => {
    return scope.argument.toString("type") || scope.calcType;
  }
);

export const AssignmentPattern = createScope(
  ({ scope, node }) => {
    scope.left = buildScope(node.left);
    scope.right = buildScope(node.right);
  },
  ({ scope }) => {
    const left = scope.left.toString();
    const right = scope.right.toString();
    return `${left} = ${right}`;
  }
);
