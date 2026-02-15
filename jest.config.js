module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated|react-native-worklets-core)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/shared/ui/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/features/*/screens/$1',
    '^@utils/(.*)$': '<rootDir>/src/shared/lib/$1',
    '^@constants/(.*)$': '<rootDir>/src/shared/config/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
    '!src/shared/assets/**/*',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  testMatch: [
    '**/__tests__/**/*.test.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
  ],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
      },
    },
  },
  verbose: true,
  testTimeout: 10000,
};
