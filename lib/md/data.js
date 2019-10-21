const recast = require("recast");
const fs = require("fs");
const path = require("path");

const mdNodes = require("./nodes");
const mdAnnotation = require("./annotation");

/**
 * @return {Array<{ type: string; params: { [propName: string]: any; } }>}
 */
const getData = (params = {}) => {
  const { src } = params;
  const file = fs.readFileSync(src, "utf8");

  const nodeFile = recast.parse(file, {
    parser: getParserByExt(path.parse(src).ext)
  });

  const bodyByTypes = mdNodes.getNodesByTypes(nodeFile.program.body);
  const bodyTypes = Object.keys(bodyByTypes);

  // const nodesById = bodyTypes.reduce((memo, type) => {
  //   const nodes = bodyByTypes[type];
  //   memo[type] = mdNodes.getNodesByIds(type, nodes);
  //   return memo;
  // }, {});

  console.log("   File body types:");
  console.log(`     ${bodyTypes.join("\n     ")}`);

  return [
    { type: "header", params: { value: "Main header", level: 1 } },
    ...getTypesData(bodyByTypes.TSTypeAliasDeclaration),
    ...getInterfacesData(bodyByTypes.TSInterfaceDeclaration),
    ...getVariablesData(bodyByTypes.VariableDeclaration),
    ...getFunctionsData(bodyByTypes.FunctionDeclaration),
    ...getClassesData(bodyByTypes.ClassDeclaration)
  ];
};

const getTypesData = (nodes = []) => {
  const header = { type: "header", params: { value: "Types", level: 2 } };
  const rows = nodes.map(node => [
    node.id.name,
    mdAnnotation.annotationNode(node)
  ]);
  const tableTypes = {
    type: "table",
    params: {
      header: ["Id", "Annotation"],
      rows
    }
  };

  return [header, tableTypes];
};

const getInterfacesData = (nodes = []) => {
  const header = { type: "header", params: { value: "Interfaces", level: 2 } };
  const rows = nodes.map(node => [
    node.id.name,
    mdAnnotation.annotationNode(node.body)
  ]);
  const tableInterfaces = {
    type: "table",
    params: { header: ["Id", "Annotation"], rows }
  };

  return [header, tableInterfaces];
};

const getVariablesData = (nodes = []) => {
  const header = { type: "header", params: { value: "Variables", level: 2 } };
  const rows = nodes.reduce((memo, node) => {
    node.declarations.forEach(nodeDeclaration => {
      memo.push([
        node.kind,
        nodeDeclaration.id.name,
        mdAnnotation.annotationNode(nodeDeclaration.id.typeAnnotation) ||
          "unknow"
      ]);
    });
    return memo;
  }, []);
  const tableVariables = {
    type: "table",
    params: { header: ["Kind", "Id", "Annotation"], rows }
  };

  return [header, tableVariables];
};

const getFunctionsData = (nodes = []) => {
  const header = { type: "header", params: { value: "Functions", level: 2 } };
  const funcs = subDataReduce(nodes, getFunctionData);
  return [header, ...funcs];
};

const getFunctionData = node => {
  const header = { type: "header", params: { value: node.id.name, level: 3 } };
  const argsRows = node.params.map((nodeParam, index) => {
    let name = "unknow";
    let annotation = "unknow";
    let required = "unknow";

    switch (nodeParam.type) {
      case "Identifier":
        name = nodeParam.name;
        annotation = mdAnnotation.annotationNode(nodeParam.typeAnnotation);
        required = (!nodeParam.optional).toString();
        break;
      case "AssignmentPattern":
        name = nodeParam.left.name;
        annotation = mdAnnotation.annotationNode(nodeParam.left.typeAnnotation);
        required = "false";
        break;
      case "ObjectPattern":
        name = `arg${index}`;
        annotation = mdAnnotation.annotationNode(nodeParam.typeAnnotation);
        required = "true";
        break;
    }

    return [unknow(name), unknow(annotation), unknow(required)];
  });
  const args = {
    type: "table",
    params: {
      header: ["Argument", "Annotation", "Required"],
      rows: argsRows
    }
  };
  const lineReturn = {
    type: "line",
    params: {
      elements: [
        { type: "text", params: { value: "Return", style: "bold" } },
        {
          type: "text",
          params: {
            value: mdAnnotation.annotaionFuncReturn(node),
            style: "italic"
          }
        }
      ]
    }
  };

  return [header, args, lineReturn];
};

const getClassesData = (nodes = []) => {
  const header = { type: "header", params: { value: "Classes", level: 2 } };
  const classes = subDataReduce(nodes, getClassData);

  return [header, ...classes];
};

const getClassData = node => {
  const bodyByTypes = mdNodes.getNodesByTypes(node.body.body);
  const methodsByKind = mdNodes.getNodesByKind(bodyByTypes.ClassMethod);

  const header = { type: "header", params: { value: node.id.name, level: 3 } };

  const params = [
    { type: "text", params: { value: "Params" } },
    { type: "text", params: { value: "" } }
  ];

  const propertiesTableRows = (bodyByTypes.ClassProperty || []).map(node => [
    node.key.name,
    mdAnnotation.annotationNode(node)
  ]);
  const propertiesTable = {
    type: "table",
    params: { header: ["Name", "Annotation"], rows: propertiesTableRows }
  };
  const properties = [
    { type: "text", params: { value: "Properties" } },
    propertiesTable
  ];

  const methodsTableRows = (methodsByKind.methodKind || []).map(node => [
    node.key.name,
    `[${mdAnnotation.annotaionFuncParams(node)}]`,
    mdAnnotation.annotaionFuncReturn(node)
  ]);
  const methodsTable = {
    type: "table",
    params: { header: ["Name", "Arguments", "Return"], rows: methodsTableRows }
  };
  const methods = [
    { type: "text", params: { value: "Methods" } },
    methodsTable
  ];

  return [header, ...params, ...properties, ...methods];
};

const subDataReduce = (nodes, func) =>
  nodes.reduce((memo, node) => [...memo, ...func(node)], []);

const getParserByExt = ext => {
  switch (ext) {
    case ".ts":
      return require("recast/parsers/typescript");
  }
};

const unknow = value => value || "unknow";

module.exports.getData = getData;
module.exports.getTypesData = getTypesData;
module.exports.getInterfacesData = getInterfacesData;
module.exports.getVariablesData = getVariablesData;
module.exports.getFunctionsData = getFunctionsData;
module.exports.getFunctionData = getFunctionData;
