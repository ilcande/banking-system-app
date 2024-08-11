module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  "jest": {
    "collectCoverage": true,
    "collectCoverageFrom": [
      "src/**/*.ts",
      "!src/**/*.d.ts",
      "!src/**/*.test.ts",
      "!src/config/**",
      "!src/utils/**"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov"]
  }
};
