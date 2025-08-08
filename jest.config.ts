/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  // множество разных настроек
  moduleNameMapper: {
    '^@pages': '<rootDir>/src/pages',
    '^@components': '<rootDir>/src/components',
    '^@ui': '<rootDir>/src/components/ui',
    '^@ui-pages': '<rootDir>/src/components/ui/pages',
    '^@utils-types': '<rootDir>/src/utils/types',
    '^@api': '<rootDir>/src/utils/burger-api.ts',
    '^@slices': '<rootDir>/src/services/slices',
    '^@selectors': '<rootDir>/src/services/selectors'
  },
  transform: {
    // '^.+\\.[tj]sx?$' для обработки файлов js/ts с помощью `ts-jest`
    // '^.+\\.m?[tj]sx?$' для обработки файлов js/ts/mjs/mts с помощью `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // настройки для ts-jest
      }
    ]
  }
};

export default config;
