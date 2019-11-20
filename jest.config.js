module.exports = {
  roots: ["<rootDir>/test"],
  modulePaths: ["<rootDir>/src/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
};
