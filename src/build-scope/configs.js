import * as common from "../common";
import { buildScope } from ".";

export const TSTypeAliasDeclaration = common.createConifg({
  builder: ({ scope }) => {
    scope.type = "type";
  },
  annotation: ({ scope }) => {
    const type = scope.type;
    const id = scope.id.annotation();
    const typeParameters = scope.typeParameters.annotation();
    const typeAnnotation = scope.typeAnnotation.annotation();
    return `${type} ${id}: ${typeParameters} = ${typeAnnotation}`;
  }
});

export const VariableDeclaration = common.createConifg({
  builder: ({ scope }) => {
    scope.type = "variable-declaration";
  },
  annotation: ({ scope }) => {
    const kind = scope.kind;
    const declarations = scope.declarations
      .map(declaration => declaration.annotation())
      .join(", ");
    return `${kind} ${declarations}`;
  }
});

export const VariableDeclarator = common.createConifg({
  builder: ({ scope }) => {
    scope.type = "variable";
  },
  annotation: ({ scope }) => {
    const id = scope.id.name;
    const typeAnnotationStr = common.scopeAnnotation(scope.id.typeAnnotation);
    const typeAnnotation = typeAnnotationStr && `: ${typeAnnotationStr}`;
    const init = scope.init.annotation();
    return `${id}${typeAnnotation} = ${init}`;
  }
});

export const TSStringKeyword = common.createConifg({
  builder: ({ scope }) => {
    scope.type = "string";
  },
  annotation: () => "string"
});

export const StringLiteral = common.createConifg({
  builder: ({ scope }) => {
    scope.type = "string";
  },
  annotation: ({ scope, mode }) => {
    switch (mode) {
      case "type":
        return scope.type;
      default:
        return scope.value;
    }
  }
});

export const TSNumberKeyword = common.createConifg({
  builder: ({ scope }) => {
    scope.type = "number";
  },
  annotation: () => "number"
});

export const NumericLiteral = common.createConifg({
  builder: ({ scope }) => {
    scope.type = "number";
  },
  annotation: ({ scope, mode }) => {
    switch (mode) {
      case "type":
        return scope.type;
      default:
        return scope.value;
    }
  }
});

export const Identifier = common.createConifg({
  builder: ({ scope }) => {
    scope.ids.add(scope);
  },
  annotation: ({ scope, mode }) => {
    const typeAnnotationStr = common.scopeAnnotation(scope.typeAnnotation);

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
});

export const BlockStatement = common.createConifg({
  builder: ({ scope, node, currentScopeStack }) => {
    scope.body = buildScope(common.getNodesReturn(node.body));
    scope.calcAsync = currentScopeStack.prev(scope).async;
  },
  annotation: ({ scope }) => {
    let body = common.filterUniq(
      scope.body.map(el => el.annotation()).filter(Boolean)
    );
    body = body.join(" | ") || "void";
    return scope.calcAsync ? `Promise<${body}>` : body;
  }
});

export const ReturnStatement = common.createConifg({
  builder: ({ scope, currentScopeStack }) => {
    scope.calcType = "";

    if (scope.argument.originalType === "Identifier") {
      const scopeBlock = currentScopeStack.to("BlockStatement");
      const scopeFunc = currentScopeStack.prev(scopeBlock);
      const scopeIds = scopeFunc.ids.ids[scope.argument.name];

      if (scopeIds) {
        let scopeIdTypes = scopeIds
          .map(id => id.annotation("type"))
          .filter(Boolean);

        scope.calcType = common.filterUniq(scopeIdTypes).join(" | ");
      }
    }
  },
  annotation: ({ scope }) => {
    return scope.argument.annotation("type") || scope.calcType;
  }
});

export const TSTypeReference = common.createConifg({
  annotation: ({ scope }) => {
    const name = scope.typeName.name;
    const typeParameters = common.scopeAnnotation(scope.typeParameters);
    return `${name}${typeParameters}`;
  }
});

export const TSTypeParameterDeclaration = common.createConifg({
  annotation: ({ scope }) => {
    const params = scope.params.map(param => param.annotation());
    return params.length ? `<${params.join(", ")}>` : "";
  }
});

export const TSTypeParameter = common.createConifg({
  annotation: ({ scope }) => {
    const name = scope.name;
    const constraintStr = common.scopeAnnotation(scope.constraint);
    const constraint = constraintStr && ` extends ${constraintStr}`;
    const defStr = common.scopeAnnotation(scope.default);
    const def = defStr && ` = ${defStr}`;
    return `${name}${constraint}${def}`;
  }
});

export const TSLiteralType = common.createConifg({
  annotation: ({ scope }) => {
    return scope.literal.annotation();
  }
});

export const TSAsExpression = common.createConifg({
  annotation: ({ scope }) => {
    const expression = scope.expression.annotation();
    const typeAnnotation = scope.typeAnnotation.annotation();
    return `${expression} as ${typeAnnotation}`;
  }
});

export const TSTypeAnnotation = common.createConifg({
  annotation: ({ scope }) => {
    return scope.typeAnnotation.annotation();
  }
});

export const TSTypeParameterInstantiation = common.createConifg({
  annotation: ({ scope }) => {
    const params = scope.params.map(param => param.annotation());
    return params.length ? `<${params.join(", ")}>` : "";
  }
});

export const TSUnionType = common.createConifg({
  annotation: ({ scope }) => {
    return scope.types.map(type => type.annotation()).join(" | ");
  }
});

export const ArrayExpression = common.createConifg({
  annotation: ({ scope, mode }) => {
    const elements = scope.elements.map(element => element.annotation(mode));
    switch (mode) {
      case "type":
        return `Array<${common.filterUniq(elements).join(" | ")}>`;
      default:
        return `[${elements.join(", ")}]`;
    }
  }
});

export const TSFunctionType = common.createConifg({
  annotation: ({ scope }) => {
    const typeParameters = common.scopeAnnotation(scope.typeParameters);
    const parameters = scope.parameters
      .map(param => param.annotation())
      .join(", ");
    const typeAnnotation = scope.typeAnnotation.annotation() || "void";
    return `${typeParameters}(${parameters}) => ${typeAnnotation}`;
  }
});

export const ArrowFunctionExpression = common.createConifg({
  annotation: ({ scope }) => {
    const typeParameters = common.scopeAnnotation(scope.typeParameters);
    const params = scope.params.map(param => param.annotation()).join(", ");
    const returnType = common.scopeAnnotation(scope.returnType);
    const body = scope.body.annotation();
    return `${typeParameters}(${params}) => ${returnType || body}`;
  }
});

export const AssignmentPattern = common.createConifg({
  annotation: ({ scope }) => {
    const left = scope.left.annotation();
    const right = scope.right.annotation();
    return `${left} = ${right}`;
  }
});

export const NewExpression = common.createConifg({
  annotation: ({ scope }) => scope.callee.annotation()
});

export const FunctionDeclaration = common.createConifg({
  annotation: ({ scope }) => {
    const type = "function";
    const id = scope.id.annotation();
    const init = ArrowFunctionExpression.annotation({ scope });
    console.log(scope.leadingComments);
    return `${type} ${id} ${init}`;
  }
});
