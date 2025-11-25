module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'ui/**/*.js',
    '!ui/**/*.test.js',
  ],
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['js', 'json'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  transform: {},
  projects: [
    {
      displayName: 'main',
      testEnvironment: 'node',
      testMatch: ['**/ui/main.test.js'],
    },
    {
      displayName: 'renderer',
      testEnvironment: 'jsdom',
      testMatch: ['**/ui/renderer.test.js'],
    },
    {
      displayName: 'ipc',
      testEnvironment: 'node',
      testMatch: ['**/ui/ipc.integration.test.js'],
    },
    {
      displayName: 'e2e',
      testEnvironment: 'node',
      testMatch: ['**/ui/e2e.test.js'],
    },
    {
      displayName: 'electron',
      testEnvironment: 'node',
      testMatch: ['**/ui/electron.test.js'],
    }
  ]
};