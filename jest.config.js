// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
  collectCoverageFrom: [
    'src/**/*.js',
    "!src/.next/**",
    "!**/node_modules/**",
  ],
  testMatch: ["**/__tests__/**/?(*.)+(spec|test).js?(x)"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
  ],
  // reporters: ["jest-spec-reporter"],
  verbose: true,
  bail: false,
}

