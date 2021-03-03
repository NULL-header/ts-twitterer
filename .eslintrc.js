module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: "module",
    project: "./tsconfig.json",
  },
  globals: {
    fetch: false,
    AbortController: false,
  },
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  extends: [
    "airbnb-typescript",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "import/prefer-default-export": "off",
    "no-console": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/return-await": "off",
    "consistent-return": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_$" },
    ],
    "@typescript-eslint/comma-dangle": "off",
    "@typescript-eslint/indent": "off",
    "react/jsx-indent": "off",
    "react/require-default-props": "off",
    "func-names": "off",
    "react/jsx-props-no-spreading": "off",
  },
};
