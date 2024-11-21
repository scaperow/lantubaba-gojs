const tsParser = require("@typescript-eslint/parser");
const espree = require("espree");
module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: {
      js: espree,
      ts: tsParser
    },
  },
  plugins: ["@typescript-eslint"],
  rules: {},
};
