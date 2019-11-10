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
        return `'${scope.value}'`;
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
    return `${type} ${id} ${init}`;
  }
});

export const TSEnumDeclaration = common.createConifg({
  annotation: ({ scope }) => {
    const type = "enum";
    const id = scope.id.annotation();
    const members = scope.members.map(member => member.annotation()).join(", ");
    return `${type} ${id} { ${members} }`;
  }
});

export const TSEnumMember = common.createConifg({
  annotation: ({ scope }) => {
    const id = scope.id.annotation();
    const initializerAnn = common.scopeAnnotation(scope.initializer);
    const initializer = initializerAnn && ` = ${initializerAnn}`;
    return `${id}${initializer}`;
  }
});

export const UnaryExpression = common.createConifg({
  annotation: ({ scope }) => {
    const operator = scope.operator;
    const argument = scope.argument.annotation();
    return `${operator}${argument}`;
  }
});

export const TSInterfaceDeclaration = common.createConifg({
  annotation: ({ scope }) => {
    const id = scope.id.annotation();
    const typeParameters = scope.typeParameters.annotation();
    const bodyAnn = scope.body.annotation();
    const body = bodyAnn ? ` ${bodyAnn} ` : " ";
    return `interface ${id}${typeParameters} {${body}}`;
  }
});

export const TSInterfaceBody = common.createConifg({
  annotation: ({ scope }) => {
    const body = scope.body.map(el => el.annotation()).join(", ");
    return body;
  }
});

export const TSPropertySignature = common.createConifg({
  annotation: ({ scope }) => {
    const key = scope.key.annotation();
    const optional = scope.optional ? "?" : "";
    const typeAnnotation =
      common.scopeAnnotation(scope.typeAnnotation) || "any";
    return `${key}${optional}: ${typeAnnotation}`;
  }
});

export const ExportNamedDeclaration = common.createConifg({
  builder: ({ scope }) => {
    scope.annotationInit = () => {
      let result = "";

      if (scope.declaration) {
        result = common.scopeAnnotation(scope.declaration);
      } else if (scope.specifiers) {
        result = scope.specifiers
          .map(spec => common.scopeAnnotation(spec))
          .join(", ");
        result = result ? `{ ${result} }` : "{ }";
      }

      const sourceAnn = common.scopeAnnotation(scope.source);
      const source = sourceAnn ? ` from ${sourceAnn}` : "";

      return `${result}${source}`;
    };
  },
  annotation: ({ scope }) => {
    const type = "export";
    let annotationInit = scope.annotationInit();
    return `${type} ${annotationInit}`;
  }
});

export const TSAnyKeyword = common.createConifg({
  annotation: () => "any"
});

export const ExportSpecifier = common.createConifg({
  annotation: ({ scope }) => {
    const local = scope.local.annotation();
    const exported = scope.exported.annotation();
    return local === exported ? local : `${local} as ${exported}`;
  }
});

export const ExportDefaultDeclaration = common.createConifg({
  annotation: ({ scope }) => {
    const declaration = scope.declaration.annotation();
    return `export ${declaration}`;
  }
});

export const ImportDeclaration = common.createConifg({
  annotation: ({ scope }) => {
    const specifiersByOrType = common.groupByOriginalType(scope.specifiers);
    const def = specifiersByOrType.ImportDefaultSpecifier
      ? common.scopeAnnotation(specifiersByOrType.ImportDefaultSpecifier[0])
      : null;
    const impAnn = common
      .scopesAnnotation(specifiersByOrType.ImportSpecifier)
      .join(", ");
    const imp = impAnn.length ? `{ ${impAnn} }` : "";
    const specifiers = [def, imp].filter(Boolean).join(", ");

    const source = scope.source.annotation();
    return `import ${specifiers} from ${source}`;
  }
});

export const ImportDefaultSpecifier = common.createConifg({
  annotation: ({ scope }) => {
    return scope.local.annotation();
  }
});

export const ImportSpecifier = common.createConifg({
  annotation: ({ scope }) => {
    const imported = common.scopeAnnotation(scope.imported);
    const local = common.scopeAnnotation(scope.local);
    return imported === local ? imported : `${imported} as ${local}`;
  }
});

export const Program = common.createConifg({
  annotation: ({ scope }) => {
    return common.scopesAnnotation(scope.body).join("\n");
  }
});

export const File = common.createConifg({
  annotation: ({ scope }) => {
    return scope.program.annotation();
  }
});

export const ObjectExpression = common.createConifg({
  annotation: ({ scope }) => {
    const properties = common.scopesAnnotation(scope.properties).join(", ");
    return properties ? `{ ${properties} }` : "{ }";
  }
});

export const ObjectProperty = common.createConifg({
  annotation: ({ scope }) => {
    const key = scope.key.annotation();
    const value = scope.value.annotation();
    return `${key}: ${value}`;
  }
});

export const MemberExpression = common.createConifg({
  annotation: ({ scope }) => {
    const object = scope.object.annotation();
    const property = scope.property.annotation();
    return `${object}.${property}`;
  }
});
