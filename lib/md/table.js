const { Formatter } = require("./formatter");

class Table extends Formatter {
  constructor() {
    super();
    this.header = null;
    this.columnsAlignment = ["-", "-", "-"];
    this.lines = [];
  }

  headerAdd(...args) {
    if (!this.header) this.header = [...args];
  }

  columnsAlignmentSet(...args) {
    if (!this.header) throw new Error("Add header to table");
    if (this.header.length !== args.length)
      throw new Error("Size ColumnsAlignment not not equal size header");

    const map = {
      left: ":-",
      center: "-",
      right: "-:"
    };

    this.columnsAlignment = args.map(alignment => map[alignment]);
  }

  lineAdd(...args) {
    if (!this.header) throw new Error("Add header to table");
    if (this.header.length !== args.length)
      throw new Error("Size line not not equal size header");

    this.lines.push([...args]);
  }

  toArray() {
    return [
      Table.arrToLineString(this.header),
      Table.arrToLineString(this.columnsAlignment),
      ...this.lines.map(line => Table.arrToLineString(line))
    ];
  }

  static arrToLineString(arr) {
    return `| ${arr.join(" | ")} |`;
  }
}

module.exports.Table = Table;
