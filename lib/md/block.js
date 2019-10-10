const { Formatter } = require("./formatter");

class Block extends Formatter {
  constructor() {
    super();

    this.elements = [];
  }

  /**
   * @param {Formatter} el
   */
  add(el) {
    if (!(el instanceof Formatter))
      throw new Error("Set first argument instance Formatter");

    this.elements.push(el);
  }

  toArray() {
    return this.elements.map(el => el.toString());
  }

  toString() {
    return `${this.toArray().join("\n\n")}\n`;
  }
}

module.exports.Block = Block;
