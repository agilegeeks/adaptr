module.exports = {
  // babel parser to support ES6/7 features
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    sourceType: "module"
  },
  extends: ["eslint:recommended", "prettier"],
  plugins: ["json", "prettier"],
  env: {
    es6: true,
    node: true
  },
  globals: {
    document: false,
    navigator: false,
    window: false
  },
  rules: {
    indent: ["error", 4],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    camelcase: [2, { properties: "never" }],
    "no-restricted-imports": ["error", "lodash", "date-fns"]
  }
};
