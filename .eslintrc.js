module.exports = {
  parser: 'babel-eslint',
  extends: [
    // "eslint:recommended",
    "standard",
    "plugin:react/recommended",
  ],
  rules: {
    "space-before-function-paren": 'off',
    "keyword-spacing": 'off',
    "no-multiple-empty-lines": 'warn',
    "space-in-parens": 'off',
    "no-multiple-empty-lines": ['warn', { "max": 2, "maxEOF": 1 }],
    "comma-spacing": 'off',
    "semi": ['error', 'never', { beforeStatementContinuationChars:'always'}],
    "func-call-spacing": 'off',
    "no-unexpected-multiline": 'off',
    "no-unused-vars": 'warn',
    "no-sequences": 'off',
    "semi-style": ["error", "first"],
    "space-unary-ops": 'off',
    "quotes": 'off',
    "comma-dangle": ['warn', 'always-multiline'],
    "object-curly-spacing": 'off',
    "space-infix-ops": 'off',
    "no-unexpected-multiline": 'error',
    "padded-blocks": 'warn',

    "standard/object-curly-even-spacing": 'off',
  },
  "settings": {
    "react": {
      "createClass": "createReactClass",
      "pragma": "React",
      "version": require('./package.json').dependencies.react.replace(/^[\^~]/,''),
      "flowVersion": "0.53",
    },
    "propWrapperFunctions": [ "forbidExtraProps" ]
  },

  overrides: [
    {
      files: ["*.test.js"],
      globals: require('eslint-plugin-jest').environments.globals.globals,
      rules: require('eslint-plugin-jest').rules,
    },
  ],
};

