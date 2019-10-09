const { Formatter } = require("./formatter");

class Line extends Formatter {
  constructor(...args) {
    super();

    Line.checkValues(args);
    this.value = [...args];
  }

  toArray() {
    return this.value;
  }

  /**
   * @param {string} separator
   */
  toString(separator = " ") {
    return this.value.join(separator);
  }

  /**
   * @param {Array<string>} values
   */
  static checkValues(values = []) {
    values.forEach(value => {
      if (typeof value !== "string")
        throw new Error("Line value is hasn't type string");
    });
  }
}

module.exports.Line = Line;
