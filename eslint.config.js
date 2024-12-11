import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        crypto: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    rules: {
      ...prettierConfig.rules,
    },
  },
];
