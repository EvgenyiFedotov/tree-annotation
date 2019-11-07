module.exports = {
  roots: ["<rootDir>/test"],
  modulePaths: ["<rootDir>/src/"],
  transform: {
    "^.+\\.js?$": ["babel-jest"]
  }
};
