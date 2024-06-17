const {
  legacyMochaTests,
  legacyMochaTestCoveredFiles,
} = require('./test/mocha/legacy-mocha-tests');

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/app/scripts/**/*.(js|ts|tsx)',
    '<rootDir>/shared/**/*.(js|ts|tsx)',
    '<rootDir>/ui/**/*.(js|ts|tsx)',
  ],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '.stories.*',
    '.snap',
    ...legacyMochaTestCoveredFiles.map((filePath) => {
      return `<rootDir>/${filePath}`;
    }),
  ],
  coverageReporters: ['html', 'json'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test/test-results/',
        outputName: 'junit.xml',
      },
    ],
  ],
  // TODO: enable resetMocks
  // resetMocks: true,
  restoreMocks: true,
  setupFiles: ['<rootDir>/test/setup.js', '<rootDir>/test/env.js'],
  setupFilesAfterEnv: ['<rootDir>/test/jest/setup.js'],
  testMatch: [
    '<rootDir>/app/scripts/**/*.test.(js|ts|tsx)',
    '<rootDir>/shared/**/*.test.(js|ts|tsx)',
    '<rootDir>/ui/**/*.test.(js|ts|tsx)',
    '<rootDir>/development/fitness-functions/**/*.test.(js|ts|tsx)',
    '<rootDir>/test/e2e/helpers.test.js',
  ],
  testPathIgnorePatterns: legacyMochaTests.map((filePath) => {
    return `<rootDir>/${filePath}`;
  }),
  testTimeout: 5500,
  // We have to specify the environment we are running in, which is jsdom. The
  // default is 'node'. This can be modified *per file* using a comment at the
  // head of the file. So it may be worthwhile to switch to 'node' in any
  // background tests.
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  workerIdleMemoryLimit: '500MB',
};
