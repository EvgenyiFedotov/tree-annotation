const { getNodesByTypes } = require("../file-tree");

const {
  annotationNodeEscape,
  annotaionFuncReturn,
  escape
} = require("./annotation");

const render = str => str.replace(/(^\n|\n$)/g, "");

const header = (value, level = 1) => `${"".padStart(level, "#")} ${value}`;

/**
 *
 * @param {Array<string>} header
 * @param {Array<string>} aling
 */
const table = (...header) => (...align) => (...rows) =>
  render(`
| ${header.join(" | ")} |
| ${(align.length ? align : header.map(() => ":-")).join(" | ")} |
${rows.map(row => `| ${row.join(" | ")} |`).join("\n")}
`);

const combine = (...blocks) => `${blocks.join("\n\n")}\n`;

// ---

const types = nodesById => nodesTypes => {
  const rows = Object.keys(nodesTypes).map(id => {
    const node = nodesTypes[id];
    return [id, annotationNodeEscape(nodesById)(node)];
  });

  return [header("Types", 2), table("Id", "Annotation")()(...rows)];
};

const interfaces = nodesById => nodes => {
  const rows = Object.keys(nodes).map(id => {
    const node = nodes[id];
    return [id, annotationNodeEscape(nodesById)(node.body)];
  });

  return [header("Interfaces", 2), table("Id", "Annotation")()(...rows)];
};

const variables = nodesById => nodesVariables => {
  const rows = Object.keys(nodesVariables).map(id => {
    const node = nodesVariables[id];
    const annotation = node.id.typeAnnotation
      ? annotationNodeEscape(nodesById)(node.id.typeAnnotation)
      : "unknow";

    return [node.parent.kind, id, annotation];
  });

  return [header("Variables", 2), table("Kind", "Id", "Annotation")()(...rows)];
};

const functions = nodesById => nodes => {
  const funcs = Object.keys(nodes).reduce((memo, id) => {
    const node = nodes[id];

    // console.log(node.body.body.length);

    memo.push(header(id, 3));

    if (node.params && node.params.length) {
      memo.push(tableFunctionArguments(nodesById)(node.params));
    }

    memo.push(`__Return__ _${escape(annotaionFuncReturn(nodesById)(node))}_`);

    return memo;
  }, []);

  return [header("Functions", 2), ...funcs];
};

const classes = nodesById => nodes => {
  const blocks = Object.keys(nodes).reduce((memo, id) => {
    const node = nodes[id];
    const bodyByTypes = getNodesByTypes(node.body.body);

    memo.push(header(id, 3));

    if (bodyByTypes.ClassProperty) {
      const rows = bodyByTypes.ClassProperty.map(node => {
        return [node.key.name, annotationNodeEscape(nodesById)(node)];
      });
      const tableProperties = table("Name", "Annotation")()(...rows);

      memo.push("__Properties__");
      memo.push(tableProperties);
    }

    if (bodyByTypes.ClassMethod) {
      const rows = bodyByTypes.ClassMethod.reduce((memo, node) => {
        switch (node.kind) {
          // TODO
          case "constructor":
            break;
          case "method":
            memo.push([node.key.name, "", ""]);
            break;
        }
        return memo;
      }, []);

      if (rows.length) {
        const tableMehtods = table("Name", "Arguments", "Return")()(...rows);

        memo.push("__Methods__");
        memo.push(tableMehtods);
      }
    }

    return memo;
  }, []);

  return [header("Classes", 2), ...blocks];
};

const tableFunctionArguments = nodesById => nodes => {
  const rows = nodes.map((param, index) => {
    switch (param.type) {
      case "Identifier":
        return [
          param.name,
          annotationNodeEscape(nodesById)(param.typeAnnotation),
          !param.optional,
          "-"
        ];
      case "AssignmentPattern":
        return [
          param.left.name,
          annotationNodeEscape(nodesById)(param.left.typeAnnotation),
          false,
          "-"
        ];
      case "ObjectPattern":
        return [
          `arg${index}`,
          annotationNodeEscape(nodesById)(param.typeAnnotation),
          true,
          "-"
        ];
      default:
        return ["UNKNOW", "UNKNOW", "UNKNOW", "UNKNOW"];
    }
  });

  return table("Argument", "Annotation", "Required", "Description")()(...rows);
};

module.exports.header = header;
module.exports.table = table;
module.exports.combine = combine;

module.exports.types = types;
module.exports.interfaces = interfaces;
module.exports.variables = variables;
module.exports.functions = functions;
module.exports.classes = classes;
module.exports.tableFunctionArguments = tableFunctionArguments;
