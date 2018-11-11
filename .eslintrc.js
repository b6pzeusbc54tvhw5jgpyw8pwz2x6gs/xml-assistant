module.exports = {
  parser: 'babel-eslint',
  extends: ["standard"],
  plugins: ['react'],
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
    "react/jsx-uses-vars": ['warn'],
    "react/jsx-no-undef": ['error'],
  },
  overrides: [
    {
      files: ["*.test.js"],
      globals: require('eslint-plugin-jest').environments.globals.globals,
      rules: require('eslint-plugin-jest').rules,
    }
  ],
};

