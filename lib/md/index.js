const combine = (separtor = " ") => (...blocks) => `${blocks.join(separtor)}`;

const line = ({ elements }) => combine(" ")(...elements.map(renderElement));

const header = ({ value, level = 1 }) => `${"".padStart(level, "#")} ${value}`;

const table = ({ header = [], align = [], rows = [] }) =>
  combine("\n")(
    `| ${header.join(" | ")} |`,
    `| ${(align.length ? align : header.map(() => ":-")).join(" | ")} |`,
    rows.map(row => `| ${row.join(" | ")} |`).join("\n")
  );

const text = ({ value, style }) => {
  switch (style) {
    case "bold":
      return `__${escape(value)}__`;
    case "italic":
      return `_${escape(value)}_`;
    default:
      return escape(value);
  }
};

const render = (data = []) =>
  combine("\n\n")(...data.map(renderElement).filter(Boolean));

const renderElement = el => {
  switch (el.type) {
    case "header":
      return header(el.params);
    case "table":
      return table(el.params);
    case "line":
      return line(el.params);
    case "text":
      return text(el.params);
    default:
      return "";
  }
};

const escape = value => value.replace(/(<|>)/gm, "\\$1");

module.exports.combine = combine;
module.exports.header = header;
module.exports.table = table;
module.exports.render = render;
module.exports.text = text;
