module.exports = {
  "root": true,
  "env": {
    es6: true,
    node: true,
  },
  "parser": "@babel/eslint-parser",
  "extends": [
    "eslint:recommended",
    "google",
  ],
  "parserOptions": {
    ecmaVersion: 2017,
  },
  "rules": {
    "quotes": ["error", "double"],
    "linebreak-style": ["error", "windows"],
  },
};
