/* eslint-env jest */
import js from "@eslint/js";
import babelParser from "@babel/eslint-parser";
import globals from "globals";
import jest from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  {
    plugins: { jest },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      ...jest.configs.recommended.rules,
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: "module",
        babelOptions: {
          plugins: ["@babel/plugin-syntax-import-assertions"],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
