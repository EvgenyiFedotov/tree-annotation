const { Formatter } = require("./formatter");
const { Line } = require("./line");

const COLUMNS_ALIGNMENT = {
  left: ":-",
  center: "-",
  right: "-:",
  l: ":-",
  c: "-",
  r: "-:"
};

class Table extends Formatter {
  /**
   *
   * @param {Array<string>} headers
   * @param {Array<string>} [columnsAlignment]
   */
  constructor(headers, columnsAlignment) {
    super();

    if (!headers) throw new Error("Table doesn't have headers");

    this.headers = new Line(...headers);
    this.columnsAlignmentSet(
      ...(columnsAlignment
        ? columnsAlignment
        : Table.columnsAlignmentBuild(this.headers.length))
    );
    this.lines = [];
  }

  columnsAlignmentSet(...args) {
    if (this.headers.size() !== args.length)
      throw new Error("Size ColumnsAlignment not not equal size header");

    this.columnsAlignment = new Line(
      ...args.map(
        alignment => COLUMNS_ALIGNMENT[alignment] || COLUMNS_ALIGNMENT["center"]
      )
    );
  }

  lineAdd(...args) {
    if (this.headers.size() !== args.length)
      throw new Error("Size line not not equal size header");

    this.lines.push(new Line(...args));
  }

  toArray() {
    return [
      Table.lineToTableLine(this.headers),
      Table.lineToTableLine(this.columnsAlignment),
      ...this.lines.map(line => Table.lineToTableLine(line))
    ];
  }

  toString() {
    return this.toArray().join("\n");
  }

  /**
   * @param {Line} line
   */
  static lineToTableLine(line) {
    return `| ${line.toString(" | ")} |`;
  }

  static columnsAlignmentBuild(count) {
    const res = [];

    for (let i = 0; i < count; i += 1) res.push("center");

    return res;
  }
}

module.exports.Table = Table;
