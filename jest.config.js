module.exports = {
  globals: {
    'ts-jest': { tsConfig: 'tsconfig.json' }
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  testMatch: ['**/src/**/__test__/**/*.spec.(ts|js)'],
  testEnvironment: 'node'
}
