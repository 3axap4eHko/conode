const swcrs = {
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "decoratorsBeforeExport": false
    }
  }
};

export default {
  verbose: true,
  collectCoverage: !!process.env.CI,
  collectCoverageFrom: ['src/**/*.ts'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/coverage', '/node_modules/', '__tests__'],
  coverageDirectory: './coverage',
  transform: {
    '\\.ts$': ['@swc/jest', swcrs],
  },
  testMatch: ['**/__tests__/**/*.ts'],
};
